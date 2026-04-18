const API_BASE_URL = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("silva_api_token") || "";
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "API istegi basarisiz.");
  }

  return data;
}

export const api = {
  auth: {
    async login(payload) {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      localStorage.setItem("silva_api_token", data.token);
      return data;
    },
    logout() {
      localStorage.removeItem("silva_api_token");
    },
    me() {
      return request("/users/me");
    },
  },
  cari: {
    list: () => request("/cari"),
    create: (payload) => request("/cari", { method: "POST", body: JSON.stringify(payload) }),
    statement: (id) => request(`/cari/${id}/statement`),
  },
  offers: {
    list: () => request("/offers"),
    create: (payload) => request("/offers", { method: "POST", body: JSON.stringify(payload) }),
    approve: (id) => request(`/offers/${id}/approve`, { method: "POST" }),
  },
  orders: {
    list: () => request("/orders"),
    updateStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
  products: {
    list: () => request("/products"),
    create: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
  },
  stocks: {
    list: () => request("/stocks"),
    create: (payload) => request("/stocks", { method: "POST", body: JSON.stringify(payload) }),
  },
  finance: {
    list: () => request("/finance"),
    create: (payload) => request("/finance", { method: "POST", body: JSON.stringify(payload) }),
  },
  personnel: {
    list: () => request("/personnel"),
    create: (payload) => request("/personnel", { method: "POST", body: JSON.stringify(payload) }),
  },
  movements: {
    list: () => request("/movements"),
    create: (payload) => request("/movements", { method: "POST", body: JSON.stringify(payload) }),
  },
};
