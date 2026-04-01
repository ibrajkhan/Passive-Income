import fs from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { seedLeads, seedProducts } from "./seedData.js";

const dataDirectory = path.resolve("server/data");
const dataFile = path.join(dataDirectory, "db.json");

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  commissionRate: { type: Number, required: true },
  affiliateUrl: { type: String, required: true },
  affiliateProgramUrl: { type: String, default: "" },
  trafficAngle: { type: String, default: "" },
  affiliateNote: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  clicks: { type: Number, default: 0 },
  createdAt: { type: String, required: true }
});

const leadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  interest: { type: String, required: true },
  createdAt: { type: String, required: true }
});

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);
const LeadModel = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

async function ensureFileStore() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(
      dataFile,
      JSON.stringify({ products: seedProducts, leads: seedLeads }, null, 2),
      "utf8"
    );
  }
}

async function readFileStore() {
  await ensureFileStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw);
}

async function writeFileStore(data) {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
}

function computeMetrics(products, leads) {
  return {
    productsListed: products.length,
    totalClicks: products.reduce((sum, item) => sum + (item.clicks || 0), 0),
    totalLeads: leads.length,
    totalRevenuePotential: `$${products.reduce(
      (sum, item) => sum + item.price * (item.commissionRate / 100),
      0
    )}`
  };
}

export async function createStorage(mongoUri) {
  if (mongoUri) {
    await mongoose.connect(mongoUri);

    if ((await ProductModel.countDocuments()) === 0) {
      await ProductModel.insertMany(seedProducts);
    }

    if ((await LeadModel.countDocuments()) === 0) {
      await LeadModel.insertMany(seedLeads);
    }

    return {
      mode: "mongodb",
      async getStorefront() {
        const [products, leads] = await Promise.all([
          ProductModel.find().sort({ createdAt: -1 }).lean(),
          LeadModel.find().lean()
        ]);
        return {
          products,
          leads,
          categories: [...new Set(products.map((item) => item.category))],
          metrics: computeMetrics(products, leads)
        };
      },
      async addLead(payload) {
        const existing = await LeadModel.findOne({ email: payload.email }).lean();
        if (existing) {
          throw new Error("This email is already subscribed.");
        }

        const lead = {
          id: createId("lead"),
          ...payload,
          createdAt: new Date().toISOString()
        };
        await LeadModel.create(lead);
        return lead;
      },
      async trackClick(productId) {
        const product = await ProductModel.findOneAndUpdate(
          { id: productId },
          { $inc: { clicks: 1 } },
          { new: true }
        ).lean();

        if (!product) {
          throw new Error("Offer not found.");
        }

        return product;
      },
      async addProduct(payload) {
        const product = {
          id: createId("prod"),
          ...payload,
          clicks: 0,
          createdAt: new Date().toISOString()
        };
        await ProductModel.create(product);
        return product;
      }
    };
  }

  await ensureFileStore();

  return {
    mode: "file",
    async getStorefront() {
      const data = await readFileStore();
      return {
        ...data,
        categories: [...new Set(data.products.map((item) => item.category))],
        metrics: computeMetrics(data.products, data.leads)
      };
    },
    async addLead(payload) {
      const data = await readFileStore();
      const existing = data.leads.find(
        (item) => item.email.toLowerCase() === payload.email.toLowerCase()
      );
      if (existing) {
        throw new Error("This email is already subscribed.");
      }

      const lead = {
        id: createId("lead"),
        ...payload,
        createdAt: new Date().toISOString()
      };
      data.leads.unshift(lead);
      await writeFileStore(data);
      return lead;
    },
    async trackClick(productId) {
      const data = await readFileStore();
      const product = data.products.find((item) => item.id === productId);
      if (!product) {
        throw new Error("Offer not found.");
      }

      product.clicks += 1;
      await writeFileStore(data);
      return product;
    },
    async addProduct(payload) {
      const data = await readFileStore();
      const product = {
        id: createId("prod"),
        ...payload,
        affiliateProgramUrl: payload.affiliateProgramUrl || "",
        trafficAngle: payload.trafficAngle || "",
        affiliateNote: payload.affiliateNote || "",
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      data.products.unshift(product);
      await writeFileStore(data);
      return product;
    }
  };
}
