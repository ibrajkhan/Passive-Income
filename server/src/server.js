import "dotenv/config";
import express from "express";
import cors from "cors";
import { createStorage } from "./storage.js";

const port = Number(process.env.PORT || 4000);
const adminKey = process.env.ADMIN_KEY || "demo-admin";
const configuredOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URLS,
  "http://localhost:5173"
]
  .filter(Boolean)
  .flatMap((value) => value.split(","))
  .map((value) => value.trim())
  .filter(Boolean);

const app = express();
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || configuredOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    }
  })
);
app.use(express.json());

function validateProduct(body) {
  const requiredFields = [
    "title",
    "category",
    "description",
    "price",
    "commissionRate",
    "affiliateUrl"
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`Missing field: ${field}`);
    }
  }
}

function requireAdmin(request, response, next) {
  if (request.headers["x-admin-key"] !== adminKey) {
    return response.status(401).json({ message: "Invalid admin key." });
  }
  next();
}

async function start() {
  const storage = await createStorage(process.env.MONGODB_URI);

  app.get("/api/health", (_, response) => {
    response.json({ ok: true, storage: storage.mode });
  });

  app.get("/api/public/storefront", async (_, response) => {
    const storefront = await storage.getStorefront();
    response.json({
      products: storefront.products,
      categories: storefront.categories,
      metrics: storefront.metrics
    });
  });

  app.post("/api/public/leads", async (request, response) => {
    try {
      const { name, email, interest } = request.body;
      if (!name || !email || !interest) {
        return response.status(400).json({ message: "All fields are required." });
      }

      await storage.addLead({ name, email, interest });
      response.status(201).json({
        message: "You are in. This lead is now stored for follow-up campaigns."
      });
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  });

  app.post("/api/public/products/:productId/click", async (request, response) => {
    try {
      const product = await storage.trackClick(request.params.productId);
      response.json({
        redirectUrl: product.affiliateUrl,
        message: "Click tracked."
      });
    } catch (error) {
      response.status(404).json({ message: error.message });
    }
  });

  app.get("/api/admin/overview", requireAdmin, async (_, response) => {
    const storefront = await storage.getStorefront();
    response.json({
      products: storefront.products,
      leads: storefront.leads,
      metrics: storefront.metrics
    });
  });

  app.post("/api/admin/products", requireAdmin, async (request, response) => {
    try {
      validateProduct(request.body);
      await storage.addProduct(request.body);
      response.status(201).json({ message: "Product saved successfully." });
    } catch (error) {
      response.status(400).json({ message: error.message });
    }
  });

  app.listen(port, () => {
    console.log(`Sleepy Commissions API running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
