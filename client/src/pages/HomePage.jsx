import { useEffect, useMemo, useState } from "react";
import { api } from "../api";

const editorialPlan = [
  {
    title: "Best CRM for small business in 2026",
    description: "A comparison page targeting high-intent searchers who are ready to pick a sales stack.",
    channel: "SEO"
  },
  {
    title: "Semrush vs Ahrefs for solo creators",
    description: "A product-vs-product article that can rank, earn clicks, and feed your email list.",
    channel: "Blog"
  },
  {
    title: "How creators monetize newsletters with Kit and beehiiv",
    description: "A tutorial-format page designed to convert educational traffic into recurring software referrals.",
    channel: "Newsletter"
  }
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function ProductCard({ product, onPromote }) {
  return (
    <article className="product-card">
      <div className="product-card__content">
        <span className="product-badge">{product.category}</span>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <p className="product-note">
          <strong>Traffic angle:</strong> {product.trafficAngle}
        </p>
      </div>
      <div className="product-card__meta">
        <div>
          <strong>{formatCurrency(product.price)}</strong>
          <span>{product.commissionRate}% commission</span>
        </div>
        <button onClick={() => onPromote(product.id)}>Visit Offer</button>
      </div>
      <div className="product-links">
        <a href={product.affiliateProgramUrl} target="_blank" rel="noreferrer">
          View affiliate program
        </a>
        <small>{product.affiliateNote}</small>
      </div>
    </article>
  );
}

function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    interest: "AI Tools"
  });
  const [leadMessage, setLeadMessage] = useState("");

  useEffect(() => {
    api
      .getPublicData()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categoryOptions = useMemo(() => {
    if (!data) return [];
    return ["All", ...data.categories];
  }, [data]);

  const visibleProducts = useMemo(() => {
    if (!data) return [];
    if (selectedCategory === "All") return data.products;
    return data.products.filter((product) => product.category === selectedCategory);
  }, [data, selectedCategory]);

  async function handleVisitOffer(productId) {
    try {
      const result = await api.trackClick(productId);
      window.open(result.redirectUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLeadSubmit(event) {
    event.preventDefault();
    setLeadMessage("");

    try {
      const result = await api.subscribe(leadForm);
      setLeadMessage(result.message);
      setLeadForm({ name: "", email: "", interest: "AI Tools" });
    } catch (err) {
      setLeadMessage(err.message);
    }
  }

  if (loading) {
    return <div className="panel">Loading storefront...</div>;
  }

  if (error && !data) {
    return <div className="panel error">{error}</div>;
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Earn around the clock</p>
          <h2>Real SaaS programs, tracked referrals, and content-led traffic.</h2>
          <p className="hero__text">
            The seeded offers now point to real software companies with real affiliate
            programs. The fastest path to revenue is comparison content, list growth,
            and swapping in your approved tracked links from each partner dashboard.
          </p>
          <div className="hero__metrics">
            <div className="stat">
              <span>{data.metrics.productsListed}</span>
              <small>real offers live</small>
            </div>
            <div className="stat">
              <span>{data.metrics.totalClicks}</span>
              <small>tracked clicks</small>
            </div>
            <div className="stat">
              <span>{data.metrics.totalLeads}</span>
              <small>captured leads</small>
            </div>
          </div>
        </div>

        <div className="hero__card">
          <p>Traffic plan</p>
          <ul>
            <li>Rank for comparison and alternatives keywords</li>
            <li>Turn reviews into newsletter subscribers</li>
            <li>Promote partner offers through email follow-up</li>
          </ul>
          <div className="hero__accent" />
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <div>
            <p className="eyebrow">Storefront</p>
            <h2>Featured affiliate programs with real destinations</h2>
          </div>
          <div className="chip-row">
            {categoryOptions.map((category) => (
              <button
                key={category}
                className={category === selectedCategory ? "chip active" : "chip"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPromote={handleVisitOffer}
            />
          ))}
        </div>
      </section>

      <section className="section section--split">
        <div className="panel">
          <p className="eyebrow">Lead capture</p>
          <h2>Turn traffic into an owned audience</h2>
          <p>
            Offer a buyer's guide or weekly tools roundup. That lets you monetize the same
            visitor multiple times instead of depending on a single outbound click.
          </p>
          <form className="lead-form" onSubmit={handleLeadSubmit}>
            <input
              type="text"
              placeholder="Your name"
              value={leadForm.name}
              onChange={(event) =>
                setLeadForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={leadForm.email}
              onChange={(event) =>
                setLeadForm((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
            <select
              value={leadForm.interest}
              onChange={(event) =>
                setLeadForm((current) => ({
                  ...current,
                  interest: event.target.value
                }))
              }
            >
              {data.categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <button type="submit">Join the profit list</button>
          </form>
          {leadMessage ? <p className="form-message">{leadMessage}</p> : null}
        </div>

        <div className="panel">
          <p className="eyebrow">Content engine</p>
          <h2>Pages to publish if you want traffic</h2>
          <div className="timeline">
            {editorialPlan.map((item) => (
              <div key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                <small>{item.channel}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--split">
        <div className="panel">
          <p className="eyebrow">SEO playbook</p>
          <h2>How this actually gets visitors</h2>
          <div className="timeline">
            <div>
              <strong>1. Publish one comparison page per offer</strong>
              <p>Target search terms like best, alternatives, versus, review, and pricing.</p>
            </div>
            <div>
              <strong>2. Capture emails with a free buyer's guide</strong>
              <p>Use the built-in form to start a weekly tools digest or niche recommendation list.</p>
            </div>
            <div>
              <strong>3. Repurpose content into social proof loops</strong>
              <p>Turn each review into X threads, LinkedIn posts, short-form videos, and newsletter issues.</p>
            </div>
          </div>
        </div>

        <div className="panel">
          <p className="eyebrow">Disclosure</p>
          <h2>Important monetization note</h2>
          <p>
            These seeded links now point to real companies and real affiliate-program pages,
            but commission tracking only starts after you replace each destination with your
            unique partner link from HubSpot, Semrush, Kit, or beehiiv.
          </p>
          <p>
            Until then, the app functions correctly and tracks clicks, but those outbound
            visits will not be credited to you as affiliate sales.
          </p>
        </div>
      </section>

      {error ? <div className="panel error">{error}</div> : null}
    </main>
  );
}

export default HomePage;
