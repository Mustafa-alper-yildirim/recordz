(function () {
  const API_BASE_URL = "http://localhost:4000/api";
  const API_ROOT_URL = API_BASE_URL.replace(/\/api$/, "");

  function getToken() {
    return localStorage.getItem("silva_api_token") || "";
  }

  async function request(path, options) {
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      (options && options.headers) || {}
    );

    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    let response;
    try {
      response = await fetch(`${API_BASE_URL}${path}`, Object.assign({}, options, { headers }));
    } catch (error) {
      throw new Error(
        "Backend API'ye ulasilamadi. `server/backend` klasorunde sunucuyu baslatin: npm install, npm run db:init, npm run dev."
      );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "API istegi basarisiz.");
    }

    return data;
  }

  function resolveAssetUrl(path) {
    if (!path) return "";
    if (/^(https?:|data:)/i.test(path)) return path;
    return `${API_ROOT_URL}${path.startsWith("/") ? path : `/${path}`}`;
  }

  window.silvaApi = {
    resolveAssetUrl,
    auth: {
      async login(payload) {
        const data = await request("/auth/login", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        localStorage.setItem("silva_api_token", data.token);
        localStorage.setItem("silva_api_user", JSON.stringify(data.user));
        return data;
      },
      async me() {
        const data = await request("/users/me");
        localStorage.setItem("silva_api_user", JSON.stringify(data));
        return data;
      },
      logout() {
        localStorage.removeItem("silva_api_token");
        localStorage.removeItem("silva_api_user");
      },
      getUser() {
        try {
          return JSON.parse(localStorage.getItem("silva_api_user") || "null");
        } catch {
          return null;
        }
      },
    },
    cari: {
      list: () => request("/cari"),
      create: (payload) => request("/cari", { method: "POST", body: JSON.stringify(payload) }),
      update: (id, payload) => request(`/cari/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
      delete: (id) => request(`/cari/${id}`, { method: "DELETE" }),
      statement: (id) => request(`/cari/${id}/statement`),
    },
    offers: {
      list: () => request("/offers"),
      create: (payload) => request("/offers", { method: "POST", body: JSON.stringify(payload) }),
      approve: (id) => request(`/offers/${id}/approve`, { method: "POST" }),
      delete: (id) => request(`/offers/${id}`, { method: "DELETE" }),
    },
    orders: {
      list: () => request("/orders"),
      delete: (id) => request(`/orders/${id}`, { method: "DELETE" }),
      updateStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    },
    products: {
      list: () => request("/products"),
      create: (payload) => request("/products", { method: "POST", body: JSON.stringify(payload) }),
      update: (id, payload) => request(`/products/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
      uploadImage: (payload) => request("/products/upload-image", { method: "POST", body: JSON.stringify(payload) }),
      bulkUpdateCategory: (payload) => request("/products/bulk-update-category", { method: "POST", body: JSON.stringify(payload) }),
      delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
    },
    stocks: {
      list: () => request("/stocks"),
      create: (payload) => request("/stocks", { method: "POST", body: JSON.stringify(payload) }),
      delete: (id) => request(`/stocks/${id}`, { method: "DELETE" }),
    },
    finance: {
      list: () => request("/finance"),
      create: (payload) => request("/finance", { method: "POST", body: JSON.stringify(payload) }),
      delete: (id) => request(`/finance/${id}`, { method: "DELETE" }),
    },
    personnel: {
      list: () => request("/personnel"),
      create: (payload) => request("/personnel", { method: "POST", body: JSON.stringify(payload) }),
      delete: (id) => request(`/personnel/${id}`, { method: "DELETE" }),
    },
    movements: {
      list: () => request("/movements"),
      create: (payload) => request("/movements", { method: "POST", body: JSON.stringify(payload) }),
      update: (id, payload) => request(`/movements/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
      delete: (id) => request(`/movements/${id}`, { method: "DELETE" }),
    },
  };
})();
