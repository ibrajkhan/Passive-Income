const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  getPublicData() {
    return request("/public/storefront");
  },
  trackClick(productId) {
    return request(`/public/products/${productId}/click`, {
      method: "POST"
    });
  },
  subscribe(payload) {
    return request("/public/leads", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  getAdminOverview(adminKey) {
    return request("/admin/overview", {
      headers: {
        "x-admin-key": adminKey
      }
    });
  },
  saveProduct(adminKey, payload) {
    return request("/admin/products", {
      method: "POST",
      headers: {
        "x-admin-key": adminKey
      },
      body: JSON.stringify(payload)
    });
  }
};
