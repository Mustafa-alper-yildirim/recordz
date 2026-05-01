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
      const message = [data.message, data.detail].filter(Boolean).join(": ");
      throw new Error(message || "API istegi basarisiz.");
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
    crm: {
      leads: () => request("/crm/leads"),
      detail: (id) => request(`/crm/leads/${id}`),
      create: (payload) => request("/crm/leads", { method: "POST", body: JSON.stringify(payload) }),
      update: (id, payload) => request(`/crm/leads/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
      updateStatus: (id, payload) => request(`/crm/leads/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
      activities: (id) => request(`/crm/leads/${id}/activities`),
      addActivity: (id, payload) => request(`/crm/leads/${id}/activities`, { method: "POST", body: JSON.stringify(payload) }),
      convertToCari: (id, payload = {}) => request(`/crm/leads/${id}/convert-to-cari`, { method: "POST", body: JSON.stringify(payload) }),
      createOffer: (id, payload = {}) => request(`/crm/leads/${id}/create-offer`, { method: "POST", body: JSON.stringify(payload) }),
      dashboard: () => request("/crm/dashboard"),
    },
    offers: {
      list: () => request("/offers"),
      create: (payload) => request("/offers", { method: "POST", body: JSON.stringify(payload) }),
      update: (id, payload) => request(`/offers/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
      createRevision: (id, payload = {}) => request(`/offers/${id}/revision`, { method: "POST", body: JSON.stringify(payload) }),
      approve: (id) => request(`/offers/${id}/approve`, { method: "POST" }),
      updateStatus: (id, status, note = "") => {
        const payload = typeof status === "object" && status !== null
          ? status
          : { status, note };
        return request(`/offers/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) });
      },
      delete: (id) => request(`/offers/${id}`, { method: "DELETE" }),
    },
    orders: {
      list: () => request("/orders"),
      detail: (id) => request(`/orders/${id}`),
      items: (id) => request(`/orders/${id}/items`),
      cutList: (id) => request(`/orders/${id}/cut-list`),
      panjurJob: (id) => request(`/orders/${id}/panjur-job`),
      createPanjurJob: (id) => request(`/orders/${id}/create-panjur-job`, { method: "POST" }),
      generateCutList: (id, payload = {}) => request(`/orders/${id}/generate-cut-list`, { method: "POST", body: JSON.stringify(payload) }),
      createWorkOrder: (id, payload = {}) => request(`/orders/${id}/create-work-order`, { method: "POST", body: JSON.stringify(payload) }),
      runErpFlow: (id) => request(`/orders/${id}/erp-flow`, { method: "POST" }),
      createQuick: (payload) => request("/orders/quick", { method: "POST", body: JSON.stringify(payload) }),
      delete: (id) => request(`/orders/${id}`, { method: "DELETE" }),
      updateStatus: (id, status) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    },
    workOrders: {
      list: () => request("/work-orders"),
      detail: (id) => request(`/work-orders/${id}`),
      updateStatus: (id, payload) => request(`/work-orders/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
      updateStageStatus: (id, stageId, payload) => request(`/work-orders/${id}/stages/${stageId}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
    },
    panjur: {
      templates: {
        list: () => request("/panjur/templates"),
        create: (payload) => request("/panjur/templates", { method: "POST", body: JSON.stringify(payload) }),
        update: (id, payload) => request(`/panjur/templates/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
        delete: (id) => request(`/panjur/templates/${id}`, { method: "DELETE" }),
      },
      jobs: {
        list: () => request("/panjur/jobs"),
        detail: (id) => request(`/panjur/jobs/${id}`),
        create: (payload) => request("/panjur/jobs", { method: "POST", body: JSON.stringify(payload) }),
        update: (id, payload) => request(`/panjur/jobs/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
        delete: (id) => request(`/panjur/jobs/${id}`, { method: "DELETE" }),
        createCncJob: (id, payload = {}) => request(`/panjur/jobs/${id}/create-cnc-job`, { method: "POST", body: JSON.stringify(payload) }),
        updateSettings: (id, payload) => request(`/panjur/jobs/${id}/settings`, { method: "PATCH", body: JSON.stringify(payload) }),
        calculate: (id, payload = {}) => request(`/panjur/jobs/${id}/calculate`, { method: "POST", body: JSON.stringify(payload) }),
        recalculate: (id, payload = {}) => request(`/panjur/jobs/${id}/recalculate`, { method: "POST", body: JSON.stringify(payload) }),
        generateCutList: (id, payload = {}) => request(`/panjur/jobs/${id}/generate-cut-list`, { method: "POST", body: JSON.stringify(payload) }),
        cutItems: (id) => request(`/panjur/jobs/${id}/cut-items`),
        pdfUrl: (id) => `${API_BASE_URL}/panjur/jobs/${id}/pdf`,
        excelUrl: (id) => `${API_BASE_URL}/panjur/jobs/${id}/export-excel`,
      },
      cnc: {
        templates: {
          list: () => request("/panjur/cnc/templates"),
          create: (payload) => request("/panjur/cnc/templates", { method: "POST", body: JSON.stringify(payload) }),
          update: (id, payload) => request(`/panjur/cnc/templates/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
          delete: (id) => request(`/panjur/cnc/templates/${id}`, { method: "DELETE" }),
        },
        jobs: {
          detail: (id) => request(`/panjur/cnc/jobs/${id}`),
          calculateHoles: (id, payload = {}) => request(`/panjur/cnc/jobs/${id}/calculate-holes`, { method: "POST", body: JSON.stringify(payload) }),
          dxfUrl: (id) => `${API_BASE_URL}/panjur/cnc/jobs/${id}/export-dxf`,
        },
      },
    },
    panjurJobs: {
      list: () => request("/panjur/jobs"),
      detail: (id) => request(`/panjur/jobs/${id}`),
      create: (payload) => request("/panjur/jobs", { method: "POST", body: JSON.stringify(payload) }),
      update: (id, payload) => request(`/panjur/jobs/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
      delete: (id) => request(`/panjur/jobs/${id}`, { method: "DELETE" }),
      generateCuts: (id, payload = {}) => request(`/panjur/jobs/${id}/generate-cut-list`, { method: "POST", body: JSON.stringify(payload) }),
      calculate: (id, payload = {}) => request(`/panjur/jobs/${id}/calculate`, { method: "POST", body: JSON.stringify(payload) }),
      pdfUrl: (id) => `${API_BASE_URL}/panjur/jobs/${id}/pdf`,
      excelUrl: (id) => `${API_BASE_URL}/panjur/jobs/${id}/export-excel`,
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
