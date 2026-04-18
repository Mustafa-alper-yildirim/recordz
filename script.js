const DB_NAME = "kapakpro-panel-db";
const DB_VERSION = 1;
const STORE_ORDERS = "orders";
const STORE_CUSTOMERS = "customers";
const STORE_PERSONNEL = "personnel";

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const navLinks = [...document.querySelectorAll(".nav-link")];
const views = [...document.querySelectorAll(".view")];
const quickLinks = [...document.querySelectorAll("[data-action], [data-view-link]")];
const primaryActionBtn = document.getElementById("primaryActionBtn");
const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById("pageDescription");
const resetDemoBtn = document.getElementById("resetDemoBtn");

const orderForm = document.getElementById("orderForm");
const customerForm = document.getElementById("customerForm");
const personnelForm = document.getElementById("personnelForm");
const orderSearch = document.getElementById("orderSearch");

const viewMeta = {
  dashboard: {
    title: "Hos Geldiniz, Mustafa A. Yildirim",
    description: "Isletmenizin guncel durum ozeti ve istatistikleri.",
    primaryLabel: "+ Yeni Siparis",
  },
  orders: {
    title: "Siparis Yonetimi",
    description: "Siparis kaydi ekleyin, arayin ve mevcut kayitlari takip edin.",
    primaryLabel: "+ Yeni Siparis",
  },
  customers: {
    title: "Musteri Yonetimi",
    description: "Musteri portfoyunuzu saklayin ve iletisim bilgilerini yonetin.",
    primaryLabel: "+ Yeni Musteri",
  },
  personnel: {
    title: "Personel Yonetimi",
    description: "Personellerin durumunu ve rollerini tek panelden yonetin.",
    primaryLabel: "+ Yeni Personel",
  },
  settings: {
    title: "Panel Ayarlari",
    description: "Bu surumun veri ve kullanim ozetini buradan gorebilirsiniz.",
    primaryLabel: "Panele Don",
  },
};

let currentView = "dashboard";
let db;

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveView(link.dataset.view));
});

quickLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const viewName = link.dataset.action || link.dataset.viewLink;
    setActiveView(viewName);
  });
});

primaryActionBtn.addEventListener("click", () => {
  if (currentView === "dashboard" || currentView === "orders") {
    setActiveView("orders");
    orderForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    orderForm?.querySelector("input[name='trackingNo']")?.focus();
    return;
  }

  if (currentView === "customers") {
    customerForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    customerForm?.querySelector("input[name='name']")?.focus();
    return;
  }

  if (currentView === "personnel") {
    personnelForm?.scrollIntoView({ behavior: "smooth", block: "start" });
    personnelForm?.querySelector("input[name='name']")?.focus();
    return;
  }

  setActiveView("dashboard");
});

resetDemoBtn?.addEventListener("click", async () => {
  const approved = window.confirm("Tum demo verilerini sifirlamak istiyor musunuz?");
  if (!approved) return;
  await resetDatabase();
  await seedInitialData();
  await refreshUI();
});

orderForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(orderForm);
  await addRecord(STORE_ORDERS, {
    trackingNo: formData.get("trackingNo")?.toString().trim(),
    customerName: formData.get("customerName")?.toString().trim(),
    date: formData.get("date"),
    amount: Number(formData.get("amount")),
    status: formData.get("status"),
    notes: formData.get("notes")?.toString().trim() || "",
    createdAt: Date.now(),
  });
  orderForm.reset();
  setDefaultDates();
  await refreshUI();
  setActiveView("orders");
});

customerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(customerForm);
  await addRecord(STORE_CUSTOMERS, {
    name: formData.get("name")?.toString().trim(),
    phone: formData.get("phone")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    city: formData.get("city")?.toString().trim(),
    createdAt: Date.now(),
  });
  customerForm.reset();
  await refreshUI();
  setActiveView("customers");
});

personnelForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(personnelForm);
  await addRecord(STORE_PERSONNEL, {
    name: formData.get("name")?.toString().trim(),
    role: formData.get("role")?.toString().trim(),
    status: formData.get("status"),
    phone: formData.get("phone")?.toString().trim(),
    createdAt: Date.now(),
  });
  personnelForm.reset();
  await refreshUI();
  setActiveView("personnel");
});

orderSearch?.addEventListener("input", () => {
  renderOrdersTable(window.__ordersCache || []);
});

window.addEventListener("DOMContentLoaded", async () => {
  setDefaultDates();
  db = await openDatabase();
  await seedInitialData();
  await refreshUI();
});

function setActiveView(viewName) {
  currentView = viewName;
  views.forEach((view) => {
    view.classList.toggle("active", view.id === `view-${viewName}`);
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.view === viewName);
  });
  const meta = viewMeta[viewName];
  if (meta) {
    pageTitle.textContent = meta.title;
    pageDescription.textContent = meta.description;
    primaryActionBtn.textContent = meta.primaryLabel;
  }
  sidebar?.classList.remove("open");
}

function setDefaultDates() {
  const dateInput = orderForm?.querySelector("input[name='date']");
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().slice(0, 10);
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_ORDERS)) {
        database.createObjectStore(STORE_ORDERS, { keyPath: "id", autoIncrement: true });
      }
      if (!database.objectStoreNames.contains(STORE_CUSTOMERS)) {
        database.createObjectStore(STORE_CUSTOMERS, { keyPath: "id", autoIncrement: true });
      }
      if (!database.objectStoreNames.contains(STORE_PERSONNEL)) {
        database.createObjectStore(STORE_PERSONNEL, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAllRecords(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function addRecord(storeName, payload) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.add(payload);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteRecord(storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function resetDatabase() {
  await clearStore(STORE_ORDERS);
  await clearStore(STORE_CUSTOMERS);
  await clearStore(STORE_PERSONNEL);
}

function clearStore(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function seedInitialData() {
  const [orders, customers, personnel] = await Promise.all([
    getAllRecords(STORE_ORDERS),
    getAllRecords(STORE_CUSTOMERS),
    getAllRecords(STORE_PERSONNEL),
  ]);

  if (!orders.length) {
    const defaultOrders = [
      { trackingNo: "S10001", customerName: "samil yildirim", date: "2026-03-28", amount: 800, status: "Yeni", notes: "Yeni siparis", createdAt: Date.now() - 400000 },
      { trackingNo: "S10002", customerName: "Atlas Reklam", date: "2026-03-29", amount: 2450, status: "Onayli", notes: "Katalog baski", createdAt: Date.now() - 300000 },
      { trackingNo: "S10003", customerName: "Luna Ambalaj", date: "2026-03-30", amount: 5200, status: "Uretim", notes: "Kutu tasarim", createdAt: Date.now() - 200000 },
      { trackingNo: "S10004", customerName: "Nova Store", date: "2026-03-31", amount: 3100, status: "Tamamlandi", notes: "Etiket seti", createdAt: Date.now() - 100000 },
    ];
    for (const order of defaultOrders) {
      await addRecord(STORE_ORDERS, order);
    }
  }

  if (!customers.length) {
    const defaultCustomers = [
      { name: "Atlas Reklam", phone: "0532 100 10 10", email: "atlas@firma.com", city: "Istanbul", createdAt: Date.now() - 600000 },
      { name: "Luna Ambalaj", phone: "0533 200 20 20", email: "luna@firma.com", city: "Ankara", createdAt: Date.now() - 500000 },
      { name: "Nova Store", phone: "0534 300 30 30", email: "nova@firma.com", city: "Izmir", createdAt: Date.now() - 400000 },
    ];
    for (const customer of defaultCustomers) {
      await addRecord(STORE_CUSTOMERS, customer);
    }
  }

  if (!personnel.length) {
    const defaultPersonnel = [
      { name: "Ayse Demir", role: "Grafik Tasarimci", status: "Aktif", phone: "0541 111 11 11", createdAt: Date.now() - 300000 },
      { name: "Mehmet Kaya", role: "Uretim Sorumlusu", status: "Aktif", phone: "0542 222 22 22", createdAt: Date.now() - 200000 },
      { name: "Elif Arslan", role: "Satis Temsilcisi", status: "Izinli", phone: "0543 333 33 33", createdAt: Date.now() - 100000 },
    ];
    for (const person of defaultPersonnel) {
      await addRecord(STORE_PERSONNEL, person);
    }
  }
}

async function refreshUI() {
  const [orders, customers, personnel] = await Promise.all([
    getAllRecords(STORE_ORDERS),
    getAllRecords(STORE_CUSTOMERS),
    getAllRecords(STORE_PERSONNEL),
  ]);

  const sortedOrders = orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const sortedCustomers = customers.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const sortedPersonnel = personnel.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  window.__ordersCache = sortedOrders;

  renderMetrics(sortedOrders);
  renderChart(sortedOrders);
  renderRecentOrders(sortedOrders.slice(0, 5));
  renderOrdersTable(sortedOrders);
  renderCustomers(sortedCustomers);
  renderPersonnel(sortedPersonnel);
}

function renderMetrics(orders) {
  const active = orders.filter((order) => order.status !== "Tamamlandi").length;
  const inProduction = orders.filter((order) => order.status === "Uretim").length;
  const completed = orders.filter((order) => order.status === "Tamamlandi").length;
  const revenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

  document.getElementById("metricActiveOrders").textContent = String(active);
  document.getElementById("metricProductionOrders").textContent = String(inProduction);
  document.getElementById("metricCompletedOrders").textContent = String(completed);
  document.getElementById("metricRevenue").textContent = formatCurrency(revenue);
}

function renderChart(orders) {
  const statuses = ["Yeni", "Onayli", "Uretim", "Tamamlandi"];
  const counts = statuses.map((status) => orders.filter((order) => order.status === status).length);
  const max = Math.max(...counts, 1);
  const chart = document.getElementById("statusChart");

  chart.innerHTML = statuses.map((status, index) => {
    const count = counts[index];
    const height = Math.max((count / max) * 100, 6);
    return `
      <div class="chart-column">
        <strong>${count}</strong>
        <div class="chart-bar-wrap">
          <div class="chart-bar" style="height:${height}%"></div>
        </div>
        <label>${status}</label>
      </div>
    `;
  }).join("");
}

function renderRecentOrders(orders) {
  const table = document.getElementById("recentOrdersTable");
  table.innerHTML = createOrdersTableMarkup(orders, false);
  bindDeleteActions();
}

function renderOrdersTable(orders) {
  const term = orderSearch?.value?.trim().toLowerCase() || "";
  const filtered = !term
    ? orders
    : orders.filter((order) => {
        return [order.trackingNo, order.customerName, order.status]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term));
      });

  const table = document.getElementById("ordersTable");
  table.innerHTML = createOrdersTableMarkup(filtered, true);
  bindDeleteActions();
}

function createOrdersTableMarkup(orders, showHeader) {
  if (!orders.length) {
    return `<div class="orders-row empty">Kayit bulunamadi.</div>`;
  }

  const head = showHeader
    ? `
      <div class="orders-head">
        <span>TAKIP NO</span>
        <span>MUSTERI</span>
        <span>TARIH</span>
        <span>TUTAR</span>
        <span>DURUM</span>
        <span>ISLEM</span>
      </div>
    `
    : `
      <div class="orders-head">
        <span>TAKIP NO</span>
        <span>MUSTERI</span>
        <span>TARIH</span>
        <span>TUTAR</span>
        <span>DURUM</span>
        <span>ISLEM</span>
      </div>
    `;

  const rows = orders.map((order) => `
    <div class="orders-row">
      <span>${escapeHtml(order.trackingNo)}</span>
      <span>${escapeHtml(order.customerName)}</span>
      <span>${formatDate(order.date)}</span>
      <span>${formatCurrency(order.amount)}</span>
      <span><b class="status-pill status-${escapeHtml(order.status)}">${escapeHtml(order.status)}</b></span>
      <span><button class="inline-link delete-btn" data-store="${STORE_ORDERS}" data-id="${order.id}">Sil</button></span>
    </div>
  `).join("");

  return `${head}${rows}`;
}

function renderCustomers(customers) {
  const list = document.getElementById("customersList");
  if (!customers.length) {
    list.innerHTML = `<div class="entity-card empty-state">Musteri kaydi bulunamadi.</div>`;
    return;
  }

  list.innerHTML = customers.map((customer) => `
    <article class="entity-card">
      <div>
        <strong>${escapeHtml(customer.name)}</strong>
        <span>${escapeHtml(customer.email)}</span>
      </div>
      <div>
        <small>${escapeHtml(customer.phone)}</small>
        <span>${escapeHtml(customer.city)}</span>
      </div>
      <div class="entity-actions">
        <button class="ghost-action delete-btn" data-store="${STORE_CUSTOMERS}" data-id="${customer.id}">Sil</button>
      </div>
    </article>
  `).join("");
  bindDeleteActions();
}

function renderPersonnel(personnel) {
  const list = document.getElementById("personnelList");
  if (!personnel.length) {
    list.innerHTML = `<div class="entity-card empty-state">Personel kaydi bulunamadi.</div>`;
    return;
  }

  list.innerHTML = personnel.map((person) => `
    <article class="entity-card">
      <div>
        <strong>${escapeHtml(person.name)}</strong>
        <span>${escapeHtml(person.role)}</span>
      </div>
      <div>
        <small>${escapeHtml(person.phone)}</small>
        <span><b class="status-pill status-${escapeHtml(person.status)}">${escapeHtml(person.status)}</b></span>
      </div>
      <div class="entity-actions">
        <button class="ghost-action delete-btn" data-store="${STORE_PERSONNEL}" data-id="${person.id}">Sil</button>
      </div>
    </article>
  `).join("");
  bindDeleteActions();
}

function bindDeleteActions() {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.onclick = async () => {
      const store = button.dataset.store;
      const id = Number(button.dataset.id);
      const approved = window.confirm("Bu kaydi silmek istiyor musunuz?");
      if (!approved) return;
      await deleteRecord(store, id);
      await refreshUI();
    };
  });
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("tr-TR")} TL`;
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return escapeHtml(String(dateValue));
  return date.toLocaleDateString("tr-TR");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
