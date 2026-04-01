import { useState } from "react";
import { api } from "../api";

const initialProduct = {
  title: "",
  category: "AI Tools",
  description: "",
  price: "",
  commissionRate: "",
  affiliateUrl: "",
  affiliateProgramUrl: "",
  trafficAngle: "",
  affiliateNote: "",
  imageUrl: ""
};

function AdminPage() {
  const [adminKey, setAdminKey] = useState("demo-admin");
  const [overview, setOverview] = useState(null);
  const [message, setMessage] = useState("");
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);

  async function loadOverview() {
    setLoading(true);
    setMessage("");

    try {
      const data = await api.getAdminOverview(adminKey);
      setOverview(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const payload = {
        ...product,
        price: Number(product.price),
        commissionRate: Number(product.commissionRate)
      };
      const result = await api.saveProduct(adminKey, payload);
      setMessage(result.message);
      setProduct(initialProduct);
      await loadOverview();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <main className="page">
      <section className="section section--split">
        <div className="panel">
          <p className="eyebrow">Secure dashboard</p>
          <h2>Admin overview</h2>
          <p>
            Use the admin key to manage offers, inspect the referral funnel, and keep notes on where each real affiliate program lives.
          </p>
          <div className="admin-auth">
            <input
              type="password"
              placeholder="Admin key"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
            />
            <button onClick={loadOverview} disabled={loading}>
              {loading ? "Loading..." : "Load dashboard"}
            </button>
          </div>
          {message ? <p className="form-message">{message}</p> : null}

          {overview ? (
            <div className="dashboard">
              <div className="stats-grid">
                <div className="panel panel--inner">
                  <span>{overview.metrics.totalRevenuePotential}</span>
                  <small>Monthly revenue potential</small>
                </div>
                <div className="panel panel--inner">
                  <span>{overview.metrics.totalClicks}</span>
                  <small>Total offer clicks</small>
                </div>
                <div className="panel panel--inner">
                  <span>{overview.metrics.totalLeads}</span>
                  <small>Lead count</small>
                </div>
              </div>

              <div className="table-like">
                <div className="table-row table-row--head">
                  <span>Offer</span>
                  <span>Category</span>
                  <span>Clicks</span>
                  <span>Commission</span>
                </div>
                {overview.products.map((item) => (
                  <div className="table-row" key={item.id}>
                    <span>{item.title}</span>
                    <span>{item.category}</span>
                    <span>{item.clicks}</span>
                    <span>{item.commissionRate}%</span>
                  </div>
                ))}
              </div>

              <div className="table-like">
                <div className="table-row table-row--head">
                  <span>Name</span>
                  <span>Email</span>
                  <span>Interest</span>
                  <span>Joined</span>
                </div>
                {overview.leads.map((lead) => (
                  <div className="table-row" key={lead.id}>
                    <span>{lead.name}</span>
                    <span>{lead.email}</span>
                    <span>{lead.interest}</span>
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="panel">
          <p className="eyebrow">Add offer</p>
          <h2>Publish a new affiliate product</h2>
          <p>
            Add the real tracked affiliate URL when you have it. If you only have the brand site for now, store that first and update it later.
          </p>
          <form className="lead-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Offer title"
              value={product.title}
              onChange={(event) =>
                setProduct((current) => ({ ...current, title: event.target.value }))
              }
              required
            />
            <select
              value={product.category}
              onChange={(event) =>
                setProduct((current) => ({ ...current, category: event.target.value }))
              }
            >
              <option>AI Tools</option>
              <option>Creator Economy</option>
              <option>Productivity</option>
              <option>Remote Work</option>
              <option>Finance</option>
            </select>
            <textarea
              placeholder="Why this offer converts"
              value={product.description}
              onChange={(event) =>
                setProduct((current) => ({
                  ...current,
                  description: event.target.value
                }))
              }
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Product price"
              value={product.price}
              onChange={(event) =>
                setProduct((current) => ({ ...current, price: event.target.value }))
              }
              required
            />
            <input
              type="number"
              min="1"
              max="100"
              placeholder="Commission rate"
              value={product.commissionRate}
              onChange={(event) =>
                setProduct((current) => ({
                  ...current,
                  commissionRate: event.target.value
                }))
              }
              required
            />
            <input
              type="url"
              placeholder="Tracked affiliate or destination URL"
              value={product.affiliateUrl}
              onChange={(event) =>
                setProduct((current) => ({
                  ...current,
                  affiliateUrl: event.target.value
                }))
              }
              required
            />
            <input
              type="url"
              placeholder="Official affiliate program URL"
              value={product.affiliateProgramUrl}
              onChange={(event) =>
                setProduct((current) => ({
                  ...current,
                  affiliateProgramUrl: event.target.value
                }))
              }
            />
            <input
              type="text"
              placeholder="Traffic angle or SEO keyword cluster"
              value={product.trafficAngle}
              onChange={(event) =>
                setProduct((current) => ({
                  ...current,
                  trafficAngle: event.target.value
                }))
              }
            />
            <textarea
              placeholder="Affiliate note or swap reminder"
              value={product.affiliateNote}
              onChange={(event) =>
                setProduct((current) => ({
                  ...current,
                  affiliateNote: event.target.value
                }))
              }
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              value={product.imageUrl}
              onChange={(event) =>
                setProduct((current) => ({
                  ...current,
                  imageUrl: event.target.value
                }))
              }
            />
            <button type="submit">Save offer</button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default AdminPage;
