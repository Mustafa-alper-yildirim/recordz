const STORES = {
  cari: "cari",
  offers: "offers",
  orders: "orders",
  products: "products",
  stocks: "stocks",
  finance: "finance",
  personnel: "personnel",
  movements: "movements",
};
const api = window.silvaApi;

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const navLinks = [...document.querySelectorAll(".nav-link")];
const views = [...document.querySelectorAll(".view")];
const quickLinks = [...document.querySelectorAll("[data-action], [data-view-link]")];
const primaryActionBtn = document.getElementById("primaryActionBtn");
const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById("pageDescription");
const resetDemoBtn = document.getElementById("resetDemoBtn");
const orderSearch = document.getElementById("orderSearch");
const logoutBtn = document.getElementById("logoutBtn");
const authError = document.getElementById("authError");
const sessionUser = document.getElementById("sessionUser");
const sessionRole = document.getElementById("sessionRole");
const printOfferBtn = document.getElementById("printOfferBtn");
const pdfOfferBtn = document.getElementById("pdfOfferBtn");
const offerPrintSelect = document.getElementById("offerPrintSelect");
const roleControlledViews = {
  finance: document.querySelector('[data-view="finance"]'),
  personnel: document.querySelector('[data-view="personnel"]'),
};

const forms = {
  cari: document.getElementById("cariForm"),
  offer: document.getElementById("offerForm"),
  product: document.getElementById("productForm"),
  stock: document.getElementById("stockForm"),
  finance: document.getElementById("financeForm"),
  personnel: document.getElementById("personnelForm"),
  movement: document.getElementById("movementForm"),
};

const viewMeta = {
  dashboard: ["Silva Ahsap Kapak Imalat Programi", "Teklif, siparis, maliyet ve personel surecini tek panelden yonetin.", "+ Yeni Teklif"],
  cari: ["Cari Yonetimi", "Musteri ve tedarikci kayitlarini, limitleri ve iskontolari yonetin.", "+ Yeni Cari"],
  offers: ["Teklif Yonetimi", "Kapak cinsi, olcu, termin ve sozlesme detayi ile teklif olusturun.", "+ Yeni Teklif"],
  orders: ["Siparis Takibi", "Onaylanan teklifler siparise donusun ve termin bazli izlenebilsin.", "+ Yeni Teklif"],
  products: ["Urun ve Kapak Fiyatlari", "Alis, satis ve m2 fiyatlarini detayli yonetin.", "+ Yeni Urun"],
  stocks: ["Stok ve Hammadde", "Hammadde ve stok kalemlerini miktar ve birim fiyatlariyla izleyin.", "+ Yeni Stok"],
  finance: ["Muhasebe ve Maliyet", "Hammadde, iscilik ve genel giderleri analiz edin.", "+ Yeni Gider"],
  reports: ["Raporlar", "Siparis, ciro, cari ve personel raporlarini bu ekranda izleyin.", "+ Rapor Olustur"],
  personnel: ["Personel Takibi", "Ozluk, maas ve mesai bilgilerini kayit altina alin.", "+ Yeni Personel"],
  settings: ["Ayarlar", "Programin kullanim notlari ve demo sifirlama islemleri.", "Panele Don"],
};

let currentView = "dashboard";
let cache = {};

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => sidebar.classList.toggle("open"));
}

navLinks.forEach((link) => link.addEventListener("click", () => setActiveView(link.dataset.view)));
quickLinks.forEach((link) => link.addEventListener("click", () => setActiveView(link.dataset.action || link.dataset.viewLink)));

primaryActionBtn?.addEventListener("click", () => {
  const targetMap = {
    dashboard: ["offers", forms.offer],
    cari: ["cari", forms.cari],
    offers: ["offers", forms.offer],
    orders: ["offers", forms.offer],
    products: ["products", forms.product],
    stocks: ["stocks", forms.stock],
    finance: ["finance", forms.finance],
    reports: ["reports", null],
    personnel: ["personnel", forms.personnel],
    settings: ["dashboard", null],
  };
  const [viewName, form] = targetMap[currentView] || ["dashboard", null];
  setActiveView(viewName);
  form?.scrollIntoView({ behavior: "smooth", block: "start" });
  form?.querySelector("input, select")?.focus();
});

resetDemoBtn?.addEventListener("click", async () => {
  if (!window.confirm("Tum demo verilerini sifirlamak istiyor musunuz?")) return;
  const resetOrder = [
    STORES.orders,
    STORES.movements,
    STORES.offers,
    STORES.finance,
    STORES.stocks,
    STORES.products,
    STORES.personnel,
    STORES.cari,
  ];
  for (const storeName of resetOrder) {
    await clearStore(storeName);
  }
  await refreshUI();
});

logoutBtn?.addEventListener("click", async () => {
  api.auth.logout();
  await applyAuthState();
});

forms.cari?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.cari);
  await addRecord(STORES.cari, {
    fullName: data.fullName,
    companyName: data.companyName,
    phone: data.phone,
    taxOffice: data.taxOffice,
    taxNumber: data.taxNumber,
    discountRate: Number(data.discountRate || 0),
    balanceLimit: Number(data.balanceLimit || 0),
    riskLimit: Number(data.riskLimit || 0),
    type: data.type,
  });
  forms.cari.reset();
  await refreshUI();
});

forms.movement?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.movement);
  await addRecord(STORES.movements, {
    cariId: Number(data.cariId),
    movementType: data.movementType,
    amount: Number(data.amount || 0),
    date: data.date,
    note: data.note || "",
  });
  forms.movement.reset();
  setDefaultDates();
  await refreshUI();
});

forms.offer?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.offer);
  const cari = (cache.cari || []).find((item) => String(item.id) === String(data.cariId));
  const quantity = Number(data.quantity || 0);
  const unitPrice = Number(data.unitPrice || 0);
  const grossTotal = quantity * unitPrice;
  const discountRate = Number(cari?.discountRate || 0);
  const netTotal = grossTotal * (1 - discountRate / 100);

  await addRecord(STORES.offers, {
    offerNo: generateOfferNo(),
    cariId: Number(data.cariId),
    coverType: data.coverType,
    color: data.color,
    width: Number(data.width || 0),
    height: Number(data.height || 0),
    quantity,
    shipment: data.shipment || "",
    orderDate: data.orderDate,
    termDays: Number(data.termDays || 0),
    deliveryDate: data.deliveryDate,
    unitPrice,
    grossTotal,
    discountRate,
    netTotal,
    contractText: data.contractText || "",
    status: "Beklemede",
  });
  forms.offer.reset();
  setDefaultDates();
  await refreshUI();
});

forms.product?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.product);
  await addRecord(STORES.products, {
    name: data.name,
    category: data.category,
    purchasePrice: Number(data.purchasePrice || 0),
    salePrice: Number(data.salePrice || 0),
    m2Price: Number(data.m2Price || 0),
    rawM2Price: Number(data.rawM2Price || 0),
    paintedM2Price: Number(data.paintedM2Price || 0),
    costNotes: data.costNotes,
  });
  forms.product.reset();
  await refreshUI();
});

forms.stock?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.stock);
  await addRecord(STORES.stocks, {
    name: data.name,
    type: data.type,
    quantity: Number(data.quantity || 0),
    unit: data.unit,
    unitPrice: Number(data.unitPrice || 0),
    supplier: data.supplier,
  });
  forms.stock.reset();
  await refreshUI();
});

forms.finance?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.finance);
  await addRecord(STORES.finance, {
    type: data.type,
    title: data.title,
    amount: Number(data.amount || 0),
  });
  forms.finance.reset();
  await refreshUI();
});

forms.personnel?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.personnel);
  await addRecord(STORES.personnel, {
    name: data.name,
    role: data.role,
    status: data.status,
    phone: data.phone,
    fileStatus: data.fileStatus,
    salary: Number(data.salary || 0),
    overtimeHours: Number(data.overtimeHours || 0),
  });
  forms.personnel.reset();
  await refreshUI();
});

orderSearch?.addEventListener("input", () => renderOrdersTable(cache.orders || []));

printOfferBtn?.addEventListener("click", () => handleOfferOutput(false));
pdfOfferBtn?.addEventListener("click", () => handleOfferOutput(true));

window.addEventListener("DOMContentLoaded", async () => {
  setDefaultDates();
  await ensureAutoLogin();
  await applyAuthState();
  if (getSession()) {
    await refreshUI();
  }
});

function setActiveView(viewName) {
  currentView = viewName;
  views.forEach((view) => view.classList.toggle("active", view.id === `view-${viewName}`));
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.view === viewName));
  const meta = viewMeta[viewName];
  if (meta) {
    pageTitle.textContent = meta[0];
    pageDescription.textContent = meta[1];
    primaryActionBtn.textContent = meta[2];
  }
  sidebar?.classList.remove("open");
}

function setDefaultDates() {
  const today = new Date().toISOString().slice(0, 10);
  forms.offer?.querySelectorAll("input[type='date']").forEach((input) => {
    if (!input.value) input.value = today;
  });
  forms.movement?.querySelectorAll("input[type='date']").forEach((input) => {
    if (!input.value) input.value = today;
  });
}

async function applyAuthState() {
  let session = getSession();
  if (localStorage.getItem("silva_api_token")) {
    try {
      session = await api.auth.me();
    } catch {
      api.auth.logout();
      session = null;
    }
  }
  document.body.classList.toggle("auth-locked", !session);
  sessionUser.textContent = session ? `${session.name}` : "";
  sessionRole.textContent = session ? session.role : "";
  applyRoleVisibility(session?.role);
  authError.textContent = session ? "" : "Backend kapaliysa panel acilamaz.";
}

function getSession() {
  if (!localStorage.getItem("silva_api_token")) {
    return null;
  }
  return api.auth.getUser();
}

async function ensureAutoLogin() {
  if (localStorage.getItem("silva_api_token")) {
    return;
  }

  try {
    await api.auth.login({
      email: "admin@silvaahsap.com",
      password: "123456",
    });
  } catch (error) {
    authError.textContent = error.message || "Otomatik giris basarisiz.";
  }
}

function applyRoleVisibility(role) {
  const isAdmin = role === "admin";
  const isFinance = role === "muhasebe";
  const isPersonnel = role === "personel";

  roleControlledViews.finance?.classList.toggle("role-hidden", isPersonnel);
  roleControlledViews.personnel?.classList.toggle("role-hidden", isFinance);

  document.querySelectorAll("#view-finance, #view-personnel").forEach((section) => {
    if (section.id === "view-finance") {
      section.classList.toggle("role-hidden", isPersonnel);
    }
    if (section.id === "view-personnel") {
      section.classList.toggle("role-hidden", isFinance);
    }
  });

  if (!isAdmin && currentView === "finance" && isPersonnel) {
    setActiveView("dashboard");
  }
  if (!isAdmin && currentView === "personnel" && isFinance) {
    setActiveView("dashboard");
  }
}

function openDatabase() {
  return Promise.resolve(null);
}

async function getAllRecords(storeName) {
  try {
    switch (storeName) {
      case STORES.cari:
        return normalizeCari(await api.cari.list());
      case STORES.offers:
        return normalizeOffers(await api.offers.list());
      case STORES.orders:
        return normalizeOrders(await api.orders.list());
      case STORES.products:
        return normalizeProducts(await api.products.list());
      case STORES.stocks:
        return normalizeStocks(await api.stocks.list());
      case STORES.finance: {
        const response = await api.finance.list();
        return normalizeFinance(response.items || []);
      }
      case STORES.personnel:
        return normalizePersonnel(await api.personnel.list());
      case STORES.movements:
        return normalizeMovements(await api.movements.list());
      default:
        return [];
    }
  } catch {
    return [];
  }
}

async function addRecord(storeName, payload) {
  switch (storeName) {
    case STORES.cari:
      return api.cari.create({
        full_name: payload.fullName,
        company_name: payload.companyName,
        phone: payload.phone,
        tax_office: payload.taxOffice,
        tax_number: payload.taxNumber,
        discount_rate: payload.discountRate,
        balance_limit: payload.balanceLimit,
        risk_limit: payload.riskLimit,
        type: payload.type,
      });
    case STORES.offers:
      return api.offers.create({
        offer_no: payload.offerNo,
        cari_id: payload.cariId,
        cover_type: payload.coverType,
        color: payload.color,
        width: payload.width,
        height: payload.height,
        quantity: payload.quantity,
        shipment: payload.shipment,
        order_date: payload.orderDate,
        term_days: payload.termDays,
        delivery_date: payload.deliveryDate,
        unit_price: payload.unitPrice,
        gross_total: payload.grossTotal,
        discount_rate: payload.discountRate,
        net_total: payload.netTotal,
        contract_text: payload.contractText,
        status: payload.status,
      });
    case STORES.products:
      return api.products.create({
        name: payload.name,
        category: payload.category,
        purchase_price: payload.purchasePrice,
        sale_price: payload.salePrice,
        m2_price: payload.m2Price,
        raw_m2_price: payload.rawM2Price,
        painted_m2_price: payload.paintedM2Price,
        cost_notes: payload.costNotes,
      });
    case STORES.stocks:
      return api.stocks.create({
        name: payload.name,
        type: payload.type,
        quantity: payload.quantity,
        unit: payload.unit,
        unit_price: payload.unitPrice,
        supplier: payload.supplier,
      });
    case STORES.finance:
      return api.finance.create({
        type: payload.type,
        title: payload.title,
        amount: payload.amount,
      });
    case STORES.personnel:
      return api.personnel.create({
        name: payload.name,
        role_title: payload.role,
        status: payload.status,
        phone: payload.phone,
        file_status: payload.fileStatus,
        salary: payload.salary,
        overtime_hours: payload.overtimeHours,
      });
    case STORES.movements:
      return api.movements.create({
        cari_id: payload.cariId,
        movement_type: payload.movementType,
        amount: payload.amount,
        movement_date: payload.date,
        note: payload.note,
      });
    default:
      return null;
  }
}

async function updateRecord(storeName, payload) {
  if (storeName === STORES.orders) {
    return api.orders.updateStatus(payload.id, payload.status);
  }
  return null;
}

async function deleteRecord(storeName, id) {
  switch (storeName) {
    case STORES.cari:
      return api.cari.delete(id);
    case STORES.offers:
      return api.offers.delete(id);
    case STORES.orders:
      return api.orders.delete(id);
    case STORES.products:
      return api.products.delete(id);
    case STORES.stocks:
      return api.stocks.delete(id);
    case STORES.finance:
      return api.finance.delete(id);
    case STORES.personnel:
      return api.personnel.delete(id);
    case STORES.movements:
      return api.movements.delete(id);
    default:
      return null;
  }
}

async function clearStore(storeName) {
  const records = await getAllRecords(storeName);
  await Promise.all(records.map((record) => deleteRecord(storeName, record.id)));
}

async function seedInitialData() {
  return;
}

async function loadAllStores() {
  const entries = await Promise.all(Object.entries(STORES).map(async ([key, storeName]) => [key, await getAllRecords(storeName)]));
  return Object.fromEntries(entries);
}

async function refreshUI() {
  cache = await loadAllStores();
  Object.keys(cache).forEach((key) => cache[key].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
  await ensureDemoFlow();
  Object.keys(cache).forEach((key) => cache[key].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
  renderDashboard(cache);
  renderCari(cache.cari, cache.movements, cache.orders);
  renderCariSelect(cache.cari);
  renderMovementCariSelect(cache.cari);
  renderMovements(cache.movements, cache.cari);
  renderOffers(cache.offers);
  renderOfferPrintSelect(cache.offers);
  renderOrdersTable(cache.orders);
  renderProducts(cache.products);
  renderStocks(cache.stocks);
  renderFinance(cache.finance, cache.products, cache.orders);
  renderReports(cache);
  renderPersonnel(cache.personnel);
  renderCariStatements(cache.cari, cache.movements, cache.orders);
  bindActions();
}

async function ensureDemoFlow() {
  return;
}

function renderDashboard(data) {
  const active = data.orders.filter((item) => item.status !== "Tamamlandi").length;
  const production = data.orders.filter((item) => item.status === "Uretim").length;
  const completed = data.orders.filter((item) => item.status === "Tamamlandi").length;
  const revenue = data.orders.reduce((sum, item) => sum + Number(item.netTotal || 0), 0);
  document.getElementById("metricActiveOrders").textContent = String(active);
  document.getElementById("metricProductionOrders").textContent = String(production);
  document.getElementById("metricCompletedOrders").textContent = String(completed);
  document.getElementById("metricRevenue").textContent = formatCurrency(revenue);
  renderChart(data.orders);
  renderRecentOrders(data.orders.slice(0, 5));
}

function renderChart(orders) {
  const labels = ["Yeni", "Onayli", "Uretim", "Tamamlandi"];
  const counts = labels.map((status) => orders.filter((item) => normalizeStatus(item.status) === status).length);
  const max = Math.max(...counts, 1);
  document.getElementById("statusChart").innerHTML = labels.map((label, index) => `
    <div class="chart-column">
      <strong>${counts[index]}</strong>
      <div class="chart-bar-wrap"><div class="chart-bar" style="height:${Math.max((counts[index] / max) * 100, 6)}%"></div></div>
      <label>${label}</label>
    </div>
  `).join("");
}

function renderRecentOrders(records) {
  document.getElementById("recentOrdersTable").innerHTML = createOrdersMarkup(records);
}

function renderCari(records, movements, orders) {
  const target = document.getElementById("cariList");
  target.innerHTML = records.length ? records.map((item) => `
    <article class="entity-card">
      <div><strong>${escapeHtml(item.companyName || item.fullName)}</strong><span>${escapeHtml(item.fullName)}</span></div>
      <div><small>${escapeHtml(item.phone)}</small><span>${escapeHtml(item.type)} | Iskonto %${item.discountRate || 0} | Bakiye ${formatCurrency(calcCariBalance(item.id, movements, orders))}</span></div>
      <div class="entity-actions"><button class="ghost-action delete-btn" data-store="${STORES.cari}" data-id="${item.id}">Sil</button></div>
    </article>
  `).join("") : `<div class="entity-card empty-state">Cari kaydi bulunamadi.</div>`;
}

function renderCariSelect(records) {
  const select = document.getElementById("offerCariSelect");
  select.innerHTML = records.length ? records.map((item) => `<option value="${item.id}">${escapeHtml(item.companyName || item.fullName)}</option>`).join("") : `<option value="">Once cari ekleyin</option>`;
}

function renderMovementCariSelect(records) {
  const select = document.getElementById("movementCariSelect");
  if (!select) return;
  select.innerHTML = records.length ? records.map((item) => `<option value="${item.id}">${escapeHtml(item.companyName || item.fullName)}</option>`).join("") : `<option value="">Once cari ekleyin</option>`;
}

function renderMovements(movements, cariler) {
  const target = document.getElementById("movementsList");
  const cariMap = new Map(cariler.map((item) => [item.id, item]));
  target.innerHTML = movements.length ? movements.map((item) => {
    const cari = cariMap.get(item.cariId);
    const sign = item.movementType === "Tahsilat" ? "+" : "-";
    return `
      <article class="entity-card">
        <div><strong>${escapeHtml(cari?.companyName || cari?.fullName || "Cari")}</strong><span>${escapeHtml(item.movementType)} | ${formatDate(item.date)}</span></div>
        <div><small>${sign}${formatCurrency(item.amount)}</small><span>${escapeHtml(item.note || "-")}</span></div>
        <div class="entity-actions"><button class="ghost-action delete-btn" data-store="${STORES.movements}" data-id="${item.id}">Sil</button></div>
      </article>
    `;
  }).join("") : `<div class="entity-card empty-state">Cari hareketi bulunamadi.</div>`;
}

function renderCariStatements(cariler, movements, orders) {
  const target = document.getElementById("cariStatementList");
  target.innerHTML = cariler.length ? cariler.map((cari) => {
    const orderTotal = calcCariOrderTotal(cari.id, orders);
    const collection = (movements || []).filter((item) => item.cariId === cari.id && item.movementType === "Tahsilat").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const payment = (movements || []).filter((item) => item.cariId === cari.id && item.movementType !== "Tahsilat").reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const balance = calcCariBalance(cari.id, movements, orders);
    return `
      <article class="entity-card">
        <div><strong>${escapeHtml(cari.companyName || cari.fullName)}</strong><span>${escapeHtml(cari.type)}</span></div>
        <div><small>Siparis ${formatCurrency(orderTotal)}</small><span>Tahsilat ${formatCurrency(collection)} | Odeme ${formatCurrency(payment)}</span></div>
        <div><strong>${formatCurrency(balance)}</strong></div>
      </article>
    `;
  }).join("") : `<div class="entity-card empty-state">Cari ekstre verisi bulunamadi.</div>`;
}

function renderOffers(records) {
  const target = document.getElementById("offersTable");
  target.innerHTML = records.length ? `
    <div class="offers-head">
      <span>TEKLIF NO</span><span>KAPAK</span><span>OLCU/ADET</span><span>TESLIM</span><span>TUTAR</span><span>ISLEM</span>
    </div>
    ${records.map((item) => `
      <div class="offers-row">
        <span>${escapeHtml(item.offerNo || `TK-${item.id}`)}<br><small>${escapeHtml(item.cariName)}</small></span>
        <span>${escapeHtml(item.coverType)} / ${escapeHtml(item.color)}</span>
        <span>${item.width}x${item.height} - ${item.quantity} adet</span>
        <span>${formatDate(item.deliveryDate)}</span>
        <span>${formatCurrency(item.netTotal)}</span>
        <span>${item.status === "Beklemede" ? `<button class="inline-link approve-offer-btn" data-id="${item.id}">Onayla</button>` : `<b class="status-pill status-Tamamlandi">Onaylandi</b>`} <button class="inline-link delete-btn" data-store="${STORES.offers}" data-id="${item.id}">Sil</button></span>
      </div>
    `).join("")}
  ` : `<div class="offers-row empty">Teklif kaydi bulunamadi.</div>`;
}

function renderOfferPrintSelect(records) {
  if (!offerPrintSelect) return;
  offerPrintSelect.innerHTML = records.length
    ? records.map((item) => `<option value="${item.id}">${escapeHtml(item.cariName)} - ${escapeHtml(item.coverType)} - ${formatCurrency(item.netTotal)}</option>`).join("")
    : `<option value="">Teklif bulunamadi</option>`;
}

function renderOrdersTable(records) {
  const term = orderSearch?.value?.trim().toLowerCase() || "";
  const filtered = records.filter((item) => !term || [item.trackingNo, item.cariName, item.status].join(" ").toLowerCase().includes(term));
  document.getElementById("ordersTable").innerHTML = createOrdersMarkup(filtered);
}

function createOrdersMarkup(records) {
  if (!records.length) return `<div class="orders-row empty">Siparis kaydi bulunamadi.</div>`;
  return `
    <div class="orders-head">
      <span>TAKIP NO</span><span>CARI</span><span>TARIH/TERMIN</span><span>TUTAR</span><span>DURUM</span><span>ISLEM</span>
    </div>
    ${records.map((item) => `
      <div class="orders-row">
        <span>${escapeHtml(item.trackingNo)}</span>
        <span>${escapeHtml(item.cariName)}</span>
        <span>${formatDate(item.orderDate)} / ${item.termDays} gun</span>
        <span>${formatCurrency(item.netTotal)}</span>
        <span><b class="status-pill status-${normalizeStatus(item.status)}">${escapeHtml(normalizeStatus(item.status))}</b></span>
        <span><button class="inline-link delete-btn" data-store="${STORES.orders}" data-id="${item.id}">Sil</button></span>
      </div>
    `).join("")}
  `;
}

function renderProducts(records) {
  const target = document.getElementById("productsList");
  target.innerHTML = records.length ? records.map((item) => `
    <article class="entity-card">
      <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.category || "-")}</span></div>
      <div><small>Alis ${formatCurrency(item.purchasePrice)}</small><span>Satis ${formatCurrency(item.salePrice)} | M2 ${formatCurrency(item.m2Price)}</span></div>
      <div class="entity-actions"><button class="ghost-action delete-btn" data-store="${STORES.products}" data-id="${item.id}">Sil</button></div>
    </article>
  `).join("") : `<div class="entity-card empty-state">Urun kaydi bulunamadi.</div>`;
}

function renderStocks(records) {
  const target = document.getElementById("stocksList");
  target.innerHTML = records.length ? records.map((item) => `
    <article class="entity-card">
      <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.type || "-")}</span></div>
      <div><small>${item.quantity} ${escapeHtml(item.unit || "")}</small><span>${formatCurrency(item.unitPrice)} | ${escapeHtml(item.supplier || "-")}</span></div>
      <div class="entity-actions"><button class="ghost-action delete-btn" data-store="${STORES.stocks}" data-id="${item.id}">Sil</button></div>
    </article>
  `).join("") : `<div class="entity-card empty-state">Stok kaydi bulunamadi.</div>`;
}

function renderFinance(finance, products, orders) {
  const totalCost = finance.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalSales = orders.reduce((sum, item) => sum + Number(item.netTotal || 0), 0) || products.reduce((sum, item) => sum + Number(item.salePrice || 0), 0);
  const estimatedProfit = totalSales - totalCost;
  const generalExpenses = finance.filter((item) => item.type === "Dukkan" || item.type === "Showroom").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalCollection = (cache.movements || []).filter((item) => item.movementType === "Tahsilat").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalPayment = (cache.movements || []).filter((item) => item.movementType !== "Tahsilat").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  document.getElementById("metricTotalCost").textContent = formatCurrency(totalCost);
  document.getElementById("metricTotalSales").textContent = formatCurrency(totalSales);
  document.getElementById("metricEstimatedProfit").textContent = formatCurrency(estimatedProfit);
  document.getElementById("metricGeneralExpenses").textContent = formatCurrency(generalExpenses);
  document.getElementById("metricTotalCollection").textContent = formatCurrency(totalCollection);
  document.getElementById("metricTotalPayment").textContent = formatCurrency(totalPayment);

  const target = document.getElementById("financeList");
  target.innerHTML = finance.length ? finance.map((item) => `
    <article class="entity-card">
      <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.type)}</span></div>
      <div><small>${formatCurrency(item.amount)}</small><span>${formatDate(new Date(item.createdAt).toISOString())}</span></div>
      <div class="entity-actions"><button class="ghost-action delete-btn" data-store="${STORES.finance}" data-id="${item.id}">Sil</button></div>
    </article>
  `).join("") : `<div class="entity-card empty-state">Maliyet kalemi bulunamadi.</div>`;
}

function renderReports(data) {
  const orders = data.orders || [];
  const monthlyOrders = orders.length;
  const monthlyRevenue = orders.reduce((sum, item) => sum + Number(item.netTotal || 0), 0);
  const activeCari = (data.cari || []).length;
  const personnelCount = (data.personnel || []).length;
  const inProduction = orders.filter((item) => normalizeStatus(item.status) === "Uretim").length;
  const completed = orders.filter((item) => normalizeStatus(item.status) === "Tamamlandi").length;
  const waitingOffers = (data.offers || []).filter((item) => item.status === "Beklemede").length;

  const monthlyOrdersEl = document.getElementById("reportMonthlyOrders");
  const monthlyRevenueEl = document.getElementById("reportMonthlyRevenue");
  const activeCariEl = document.getElementById("reportActiveCari");
  const personnelCountEl = document.getElementById("reportPersonnelCount");
  const reportsSummaryList = document.getElementById("reportsSummaryList");
  const reportsTrendBars = document.getElementById("reportsTrendBars");
  const reportCardsList = document.getElementById("reportCardsList");
  const reportsActionList = document.getElementById("reportsActionList");

  if (monthlyOrdersEl) monthlyOrdersEl.textContent = String(monthlyOrders);
  if (monthlyRevenueEl) monthlyRevenueEl.textContent = formatCurrency(monthlyRevenue);
  if (activeCariEl) activeCariEl.textContent = String(activeCari);
  if (personnelCountEl) personnelCountEl.textContent = String(personnelCount);

  if (reportsTrendBars) {
    const monthlyBuckets = buildMonthlyReportBuckets(orders);
    const maxValue = Math.max(...monthlyBuckets.map((item) => item.count), 1);
    reportsTrendBars.innerHTML = monthlyBuckets.map((item) => `
      <div class="report-bar-column">
        <span>${item.label}</span>
        <div class="report-bar-track">
          <div class="report-bar-fill" style="height:${Math.max((item.count / maxValue) * 100, item.count ? 12 : 4)}%"></div>
        </div>
        <strong>${item.count}</strong>
        <small>${formatCurrency(item.revenue)}</small>
      </div>
    `).join("");
  }

  if (reportCardsList) {
    reportCardsList.innerHTML = `
      <article class="report-mini-card">
        <strong>Satis Raporu</strong>
        <span>Toplam ciro ${formatCurrency(monthlyRevenue)}</span>
      </article>
      <article class="report-mini-card">
        <strong>Uretim Raporu</strong>
        <span>Uretimde bekleyen siparis ${inProduction}</span>
      </article>
      <article class="report-mini-card">
        <strong>Teklif Raporu</strong>
        <span>Onay bekleyen teklif ${waitingOffers}</span>
      </article>
      <article class="report-mini-card">
        <strong>Personel Raporu</strong>
        <span>Kayitli personel ${personnelCount}</span>
      </article>
    `;
  }

  if (reportsSummaryList) {
    reportsSummaryList.innerHTML = `
      <article class="entity-card">
        <div>
          <strong>Siparis ve Ciro Ozet</strong>
          <span>Toplam siparis adedi: ${monthlyOrders}</span>
        </div>
        <div>
          <small>Toplam ciro: ${formatCurrency(monthlyRevenue)}</small>
          <span>Aktif cari: ${activeCari}</span>
        </div>
        <div class="entity-actions">
          <button class="ghost-action" type="button">Hazir</button>
        </div>
      </article>
      <article class="entity-card">
        <div>
          <strong>Personel ve Operasyon</strong>
          <span>Kayitli personel sayisi: ${personnelCount}</span>
        </div>
        <div>
          <small>Bu alan ileride filtreli raporlar icin genisletilebilir.</small>
        </div>
        <div class="entity-actions">
          <button class="ghost-action" type="button">Hazir</button>
        </div>
      </article>
      <article class="entity-card">
        <div>
          <strong>Tamamlanma Performansi</strong>
          <span>Tamamlanan siparis sayisi: ${completed}</span>
        </div>
        <div>
          <small>Aktif uretim: ${inProduction}</small>
          <span>Bekleyen teklif: ${waitingOffers}</span>
        </div>
        <div class="entity-actions">
          <button class="ghost-action" type="button">Hazir</button>
        </div>
      </article>
    `;
  }

  if (reportsActionList) {
    reportsActionList.innerHTML = `
      <article class="entity-card">
        <div>
          <strong>Cari Risk Raporu</strong>
          <span>Bakiye ve risk limiti analizi icin bu alan genisletilebilir.</span>
        </div>
        <div><small>Sonraki adim: limit asim uyarilari</small></div>
        <div class="entity-actions"><button class="ghost-action" type="button">Planli</button></div>
      </article>
      <article class="entity-card">
        <div>
          <strong>Termin Gecikme Raporu</strong>
          <span>Teslim tarihi gecen siparisleri ayri listede izleyebilirsiniz.</span>
        </div>
        <div><small>Sonraki adim: geciken siparis filtresi</small></div>
        <div class="entity-actions"><button class="ghost-action" type="button">Planli</button></div>
      </article>
      <article class="entity-card">
        <div>
          <strong>Maliyet Karsilastirma Raporu</strong>
          <span>Hammadde, iscilik ve genel giderlerin aylik dagilimi burada toplanabilir.</span>
        </div>
        <div><small>Sonraki adim: kategori bazli grafik</small></div>
        <div class="entity-actions"><button class="ghost-action" type="button">Planli</button></div>
      </article>
    `;
  }
}

function buildMonthlyReportBuckets(orders) {
  const formatter = new Intl.DateTimeFormat("tr-TR", { month: "short" });
  const now = new Date();
  const buckets = [];

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const items = orders.filter((item) => {
      const sourceDate = item.orderDate || item.createdAt;
      if (!sourceDate) return false;
      const orderDate = new Date(sourceDate);
      return orderDate.getMonth() === month && orderDate.getFullYear() === year;
    });
    buckets.push({
      label: formatter.format(date),
      count: items.length,
      revenue: items.reduce((sum, item) => sum + Number(item.netTotal || 0), 0),
    });
  }

  return buckets;
}

function renderPersonnel(records) {
  const target = document.getElementById("personnelList");
  target.innerHTML = records.length ? records.map((item) => `
    <article class="entity-card">
      <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.role)}</span></div>
      <div><small>Maas ${formatCurrency(item.salary)}</small><span>Mesai ${item.overtimeHours || 0} saat | Ozluk ${escapeHtml(item.fileStatus || "-")}</span></div>
      <div class="entity-actions"><button class="ghost-action delete-btn" data-store="${STORES.personnel}" data-id="${item.id}">Sil</button></div>
    </article>
  `).join("") : `<div class="entity-card empty-state">Personel kaydi bulunamadi.</div>`;
}

function bindActions() {
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.onclick = async () => {
      if (!window.confirm("Bu kaydi silmek istiyor musunuz?")) return;
      await deleteRecord(button.dataset.store, Number(button.dataset.id));
      await refreshUI();
    };
  });
  document.querySelectorAll(".approve-offer-btn").forEach((button) => {
    button.onclick = async () => {
      await api.offers.approve(Number(button.dataset.id));
      await refreshUI();
      setActiveView("orders");
    };
  });
}

function handleOfferOutput(preferPdf) {
  const offerId = Number(offerPrintSelect?.value);
  const offer = (cache.offers || []).find((item) => item.id === offerId);
  if (!offer) {
    window.alert("Yazdirilacak teklif bulunamadi.");
    return;
  }
  const cari = (cache.cari || []).find((item) => item.id === offer.cariId);
  const html = buildOfferPrintHtml(offer, cari);
  const printWindow = window.open("", "_blank", "width=960,height=800");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    if (!preferPdf) return;
  }, 300);
}

function buildOfferPrintHtml(offer, cari) {
  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Teklif Ciktisi</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #1a2233; }
        .head, .grid { display: grid; gap: 12px; }
        .head { grid-template-columns: 1fr auto; align-items: start; margin-bottom: 24px; }
        .brand { font-size: 28px; font-weight: 700; }
        .muted { color: #667085; }
        .card { border: 1px solid #dde5f0; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
        .grid.two { grid-template-columns: 1fr 1fr; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #dde5f0; padding: 10px; text-align: left; }
        h2, h3, p { margin: 0; }
        .total { margin-top: 18px; font-size: 20px; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="head">
        <div>
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:44px; height:44px; border-radius:12px; background:#2f6fed; color:#fff; display:grid; place-items:center; font-weight:700;">S</div>
            <div>
              <div class="brand">Silva Ahsap</div>
              <p class="muted">Kapak Imalat Teklif Formu</p>
            </div>
          </div>
        </div>
        <div>
          <strong>Teklif No:</strong> ${escapeHtml(offer.offerNo || `TK-${offer.id}`)}<br>
          <strong>Tarih:</strong> ${formatDate(offer.orderDate)}
        </div>
      </div>
      <div class="card grid two">
        <div>
          <h3>Cari Bilgisi</h3>
          <p>${escapeHtml(cari?.companyName || offer.cariName)}</p>
          <p class="muted">${escapeHtml(cari?.fullName || "")}</p>
          <p class="muted">${escapeHtml(cari?.phone || "")}</p>
        </div>
        <div>
          <h3>Vergi Bilgisi</h3>
          <p>${escapeHtml(cari?.taxOffice || "-")}</p>
          <p class="muted">${escapeHtml(cari?.taxNumber || "-")}</p>
          <p class="muted">Iskonto: %${Number(offer.discountRate || 0)}</p>
        </div>
      </div>
      <div class="card">
        <h3>Urun ve Olcu Bilgileri</h3>
        <table>
          <thead><tr><th>Kapak Cinsi</th><th>Renk</th><th>Olcu</th><th>Adet</th><th>Birim</th><th>Net Tutar</th></tr></thead>
          <tbody><tr><td>${escapeHtml(offer.coverType)}</td><td>${escapeHtml(offer.color)}</td><td>${offer.width} x ${offer.height} mm</td><td>${offer.quantity}</td><td>${formatCurrency(offer.unitPrice)}</td><td>${formatCurrency(offer.netTotal)}</td></tr></tbody>
        </table>
        <p class="total">Toplam Teklif: ${formatCurrency(offer.netTotal)}</p>
      </div>
      <div class="card grid two">
        <div>
          <h3>Sevkiyat ve Termin</h3>
          <p>Kargo/Sevkiyat: ${escapeHtml(offer.shipment || "-")}</p>
          <p>Teslim Tarihi: ${formatDate(offer.deliveryDate)}</p>
          <p>Termin: ${offer.termDays} gun</p>
        </div>
        <div>
          <h3>Sozlesme</h3>
          <p class="muted">${escapeHtml(offer.contractText || "Sozlesme metni daha sonra eklenebilir.")}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function createOrderFromOffer(offer) {
  return {
    offerId: offer.id,
    trackingNo: `SP-${offer.id}`,
    cariName: offer.cariName,
    orderDate: offer.orderDate,
    deliveryDate: offer.deliveryDate,
    termDays: offer.termDays,
    netTotal: offer.netTotal,
    status: "Yeni",
    createdAt: Date.now(),
  };
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function normalizeCari(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    companyName: row.company_name,
    phone: row.phone,
    taxOffice: row.tax_office,
    taxNumber: row.tax_number,
    discountRate: Number(row.discount_rate || 0),
    balanceLimit: Number(row.balance_limit || 0),
    riskLimit: Number(row.risk_limit || 0),
    type: row.type,
    createdAt: row.created_at,
  }));
}

function normalizeOffers(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    offerId: row.id,
    offerNo: row.offer_no,
    cariId: row.cari_id,
    cariName: row.company_name || row.full_name || row.cariName,
    coverType: row.cover_type,
    color: row.color,
    width: Number(row.width || 0),
    height: Number(row.height || 0),
    quantity: Number(row.quantity || 0),
    shipment: row.shipment,
    orderDate: row.order_date,
    termDays: Number(row.term_days || 0),
    deliveryDate: row.delivery_date,
    unitPrice: Number(row.unit_price || 0),
    grossTotal: Number(row.gross_total || 0),
    discountRate: Number(row.discount_rate || 0),
    netTotal: Number(row.net_total || 0),
    contractText: row.contract_text,
    status: row.status,
    createdAt: row.created_at,
  }));
}

function normalizeOrders(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    offerId: row.offer_id,
    trackingNo: row.tracking_no,
    cariName: row.company_name || row.full_name || "-",
    orderDate: row.order_date,
    deliveryDate: row.delivery_date,
    termDays: Number(row.term_days || 0),
    netTotal: Number(row.net_total || 0),
    status: row.status,
    createdAt: row.created_at,
  }));
}

function normalizeProducts(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    purchasePrice: Number(row.purchase_price || 0),
    salePrice: Number(row.sale_price || 0),
    m2Price: Number(row.m2_price || 0),
    rawM2Price: Number(row.raw_m2_price || 0),
    paintedM2Price: Number(row.painted_m2_price || 0),
    costNotes: row.cost_notes,
    createdAt: row.created_at,
  }));
}

function normalizeStocks(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    quantity: Number(row.quantity || 0),
    unit: row.unit,
    unitPrice: Number(row.unit_price || 0),
    supplier: row.supplier,
    createdAt: row.created_at,
  }));
}

function normalizeFinance(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    amount: Number(row.amount || 0),
    createdAt: row.created_at,
  }));
}

function normalizePersonnel(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role_title,
    status: row.status,
    phone: row.phone,
    fileStatus: row.file_status,
    salary: Number(row.salary || 0),
    overtimeHours: Number(row.overtime_hours || 0),
    createdAt: row.created_at,
  }));
}

function normalizeMovements(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    cariId: row.cari_id,
    movementType: row.movement_type,
    amount: Number(row.amount || 0),
    date: row.movement_date,
    note: row.note,
    createdAt: row.created_at,
  }));
}

function calcCariBalance(cariId, movements, orders) {
  const orderTotal = calcCariOrderTotal(cariId, orders);
  const movementDelta = (movements || []).filter((item) => item.cariId === cariId).reduce((sum, item) => {
    if (item.movementType === "Tahsilat") return sum - Number(item.amount || 0);
    return sum + Number(item.amount || 0);
  }, 0);
  return orderTotal + movementDelta;
}

function calcCariOrderTotal(cariId, orders) {
  return (orders || []).reduce((sum, item) => {
    const offer = (cache.offers || []).find((row) => row.id === item.offerId);
    return offer?.cariId === cariId ? sum + Number(item.netTotal || 0) : sum;
  }, 0);
}

function generateOfferNo() {
  const now = new Date();
  const year = now.getFullYear();
  const next = ((cache.offers || []).length + 1).toString().padStart(4, "0");
  return `SLV-TKF-${year}-${next}`;
}

function normalizeStatus(status) {
  if (status === "Onaylandi") return "Onayli";
  if (status === "Beklemede") return "Yeni";
  return status || "Yeni";
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("tr-TR")} TL`;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? escapeHtml(String(value)) : date.toLocaleDateString("tr-TR");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
