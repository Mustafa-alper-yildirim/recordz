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
const offerLinesContainer = document.getElementById("offerLinesContainer");
const addOfferLineBtn = document.getElementById("addOfferLineBtn");
const offerNoDisplay = document.getElementById("offerNoDisplay");
const offerDiscountRateInput = document.getElementById("offerDiscountRate");
const offerLineCountLabel = document.getElementById("offerLineCountLabel");
const offerProductsList = document.getElementById("offerProductsList");
const offerProductSearch = document.getElementById("offerProductSearch");
const offerOnlyCovers = document.getElementById("offerOnlyCovers");
const cariSearch = document.getElementById("cariSearch");
const cariTypeFilter = document.getElementById("cariTypeFilter");
const cariBalanceFilter = document.getElementById("cariBalanceFilter");
const cariSort = document.getElementById("cariSort");
const cariList = document.getElementById("cariList");
const cariEditId = document.getElementById("cariEditId");
const clearCariSelectionBtn = document.getElementById("clearCariSelectionBtn");
const cariSubmitBtn = document.getElementById("cariSubmitBtn");
const cariDetailBadge = document.getElementById("cariDetailBadge");
const cariDetailCompany = document.getElementById("cariDetailCompany");
const cariDetailName = document.getElementById("cariDetailName");
const cariDetailPhone = document.getElementById("cariDetailPhone");
const cariDetailLastMovement = document.getElementById("cariDetailLastMovement");
const cariDetailBalance = document.getElementById("cariDetailBalance");
const cariDetailLimit = document.getElementById("cariDetailLimit");
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

const offerLineInputs = {
  height: document.getElementById("offerLineHeight"),
  width: document.getElementById("offerLineWidth"),
  quantity: document.getElementById("offerLineQuantity"),
  materialGroup: document.getElementById("offerLineMaterialGroup"),
  coverType: document.getElementById("offerLineCoverType"),
  color: document.getElementById("offerLineColor"),
  unitPrice: document.getElementById("offerLineUnitPrice"),
  note: document.getElementById("offerLineNote"),
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
let selectedCariId = null;

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
  const payload = {
    fullName: data.fullName,
    companyName: data.companyName,
    phone: data.phone,
    taxOffice: data.taxOffice,
    taxNumber: data.taxNumber,
    discountRate: Number(data.discountRate || 0),
    balanceLimit: Number(data.balanceLimit || 0),
    riskLimit: Number(data.riskLimit || 0),
    type: data.type,
  };
  if (cariEditId?.value) {
    await api.cari.update(Number(cariEditId.value), {
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
  } else {
    await addRecord(STORES.cari, payload);
  }
  clearCariSelection();
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
  const rows = collectOfferRows();
  if (!rows.length) {
    window.alert("En az bir kapak siparis satiri girmeniz gerekiyor.");
    return;
  }
  const cari = (cache.cari || []).find((item) => String(item.id) === String(data.cariId));
  const summary = calculateOfferSummary(rows, Number(data.discountRate || cari?.discountRate || 0), Number(data.vatRate || 0));
  const firstRow = rows[0];
  const offerNo = generateOfferNo();
  const contractText = serializeOfferContract({
    notes: data.contractText || "",
    formType: data.formType,
    vatRate: Number(data.vatRate || 0),
    discountRate: Number(data.discountRate || 0),
    rows,
    summary,
  });

  await addRecord(STORES.offers, {
    offerNo,
    cariId: Number(data.cariId),
    coverType: firstRow.coverType || `${rows.length} Kalem Kapak`,
    color: firstRow.color || "Karışık",
    width: Number(firstRow.width || 0),
    height: Number(firstRow.height || 0),
    quantity: summary.totalQuantity,
    shipment: data.shipment || "",
    orderDate: data.orderDate,
    termDays: Number(data.termDays || 0),
    deliveryDate: data.deliveryDate,
    unitPrice: Number(firstRow.unitPrice || 0),
    grossTotal: summary.grossTotal,
    discountRate: Number(data.discountRate || cari?.discountRate || 0),
    netTotal: summary.grandTotal,
    contractText,
    status: "Beklemede",
  });
  forms.offer.reset();
  setDefaultDates();
  syncOfferDefaults();
  initializeOfferLines(createDefaultOfferRows());
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
cariSearch?.addEventListener("input", () => renderCari(cache.cari || [], cache.movements || [], cache.orders || []));
cariTypeFilter?.addEventListener("change", () => renderCari(cache.cari || [], cache.movements || [], cache.orders || []));
cariBalanceFilter?.addEventListener("change", () => renderCari(cache.cari || [], cache.movements || [], cache.orders || []));
cariSort?.addEventListener("change", () => renderCari(cache.cari || [], cache.movements || [], cache.orders || []));
clearCariSelectionBtn?.addEventListener("click", clearCariSelection);
cariList?.addEventListener("click", (event) => {
  if (event.target.closest(".delete-btn")) return;
  const card = event.target.closest("[data-cari-select]");
  if (!card) return;
  const cari = (cache.cari || []).find((item) => item.id === Number(card.dataset.cariSelect));
  if (!cari) return;
  fillCariForm(cari);
  renderCari(cache.cari || [], cache.movements || [], cache.orders || []);
  renderMovements(cache.movements || [], cache.cari || []);
  renderCariStatements(cache.cari || [], cache.movements || [], cache.orders || []);
});

printOfferBtn?.addEventListener("click", () => handleOfferOutput(false));
pdfOfferBtn?.addEventListener("click", () => handleOfferOutput(true));
addOfferLineBtn?.addEventListener("click", () => appendOfferLine());
offerLinesContainer?.addEventListener("click", handleOfferLineDelete);
forms.offer?.querySelector("[name='discountRate']")?.addEventListener("input", () => recalcOfferSummary());
forms.offer?.querySelector("[name='vatRate']")?.addEventListener("input", () => recalcOfferSummary());
forms.offer?.querySelector("[name='cariId']")?.addEventListener("change", handleOfferCariChange);
offerProductsList?.addEventListener("click", handleOfferProductPick);
offerProductsList?.addEventListener("dblclick", handleOfferProductDoublePick);
offerProductSearch?.addEventListener("input", () => renderOfferProductsPicker(cache.products || []));
offerOnlyCovers?.addEventListener("change", () => renderOfferProductsPicker(cache.products || []));

window.addEventListener("DOMContentLoaded", async () => {
  setDefaultDates();
  syncOfferDefaults();
  initializeOfferLines(createDefaultOfferRows());
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

function syncOfferDefaults() {
  if (offerNoDisplay) {
    offerNoDisplay.value = generateOfferNo();
  }
  const defaultCari = (cache.cari || [])[0];
  if (defaultCari && offerDiscountRateInput && !offerDiscountRateInput.value) {
    offerDiscountRateInput.value = String(defaultCari.discountRate || 0);
  }
  recalcOfferSummary();
}

function createDefaultOfferRows() {
  return [];
}

function initializeOfferLines(rows) {
  if (!offerLinesContainer) return;
  offerLinesContainer.innerHTML = "";
  rows.forEach((row) => appendOfferLine(row));
  resetOfferLineInputs();
  recalcOfferSummary();
}

function appendOfferLine(row = null) {
  if (!offerLinesContainer) return;
  const payload = row || getOfferLineInputValues();
  if (!payload) {
    window.alert("Kapak bilgilerini girip sonra Ekle butonuna basin.");
    return;
  }
  const wrapper = document.createElement("div");
  wrapper.className = "offer-line-row";
  wrapper.dataset.row = JSON.stringify(payload);
  wrapper.innerHTML = createOfferLineMarkup(payload);
  offerLinesContainer.appendChild(wrapper);
  resetOfferLineInputs();
  recalcOfferSummary();
}

function createOfferLineMarkup(row = {}) {
  const total = Number(row.total || 0);
  return `
    <div class="offer-line-main">
      <strong>${escapeHtml(row.coverType || "Kapak")}</strong>
      <span>${escapeHtml(row.materialGroup || "-")} | ${escapeHtml(row.color || "-")}</span>
    </div>
    <div class="offer-line-meta">
      <span>${Number(row.height || 0)} x ${Number(row.width || 0)} mm</span>
      <span>${Number(row.quantity || 0)} adet | ${Number(row.m2 || 0).toFixed(3)} m2</span>
    </div>
    <div class="offer-line-price">
      <strong>${formatCurrency(total)}</strong>
      <span>Birim ${formatCurrency(row.unitPrice || 0)}</span>
    </div>
    <button class="offer-line-delete" type="button" data-line-delete="1">Sil</button>
  `;
}

function createOfferMaterialOptions(selectedValue) {
  const options = [
    "LAKE_KAPAK_18MM",
    "LAKE_PANJUR_KAPAK_22MM",
    "HAM_KAPAKLAR",
    "HAM_PANJURLAR",
    "AHSAP_PANJUR_KAPAK",
    "CNC_ISCILIK",
    "KAPAK_YENI",
  ];

  return options.map((option) => `
    <option value="${option}" ${option === selectedValue ? "selected" : ""}>${option.replaceAll("_", " ")}</option>
  `).join("");
}

function createOfferTypeOptions(selectedValue, category = "", productName = "") {
  const normalized = `${category} ${productName}`.toLowerCase();
  let options = [productName || "Kapak Secin"];

  if (normalized.includes("lake") && normalized.includes("panjur")) {
    options = [productName, "Lake Panjur Beyaz", "Lake Panjur RAL", "Lake Panjur Eskitme"];
  } else if (normalized.includes("lake")) {
    options = [productName, "Lake Kapak Beyaz Duz", "Lake Kapak RAL Duz", "Lake Kapak Tarama Model", "Lake Kapak Citali"];
  } else if (normalized.includes("ham") && normalized.includes("panjur")) {
    options = [productName, "Ham Panjur", "Kapali Panjur", "Derzli Panjur"];
  } else if (normalized.includes("ham")) {
    options = [productName, "Ham Kapak Duz", "Ham Kapak Tarama", "Ham Kapak Citali"];
  } else if (normalized.includes("cam")) {
    options = [productName, "Camli Kapak Cerceve", "Camli Kapak Citali", "Camli Duz Kapak"];
  } else if (normalized.includes("kapak")) {
    options = [productName, "Duz Kapak", "Tarama Kapak", "Citali Kapak", "J Kulp Kapak"];
  }

  const unique = [...new Set(options.filter(Boolean))];
  return unique.map((option) => `
    <option value="${escapeHtml(option)}" ${option === selectedValue ? "selected" : ""}>${escapeHtml(option)}</option>
  `).join("");
}

function renderOfferProductsPicker(products) {
  if (!offerProductsList) return;
  const searchTerm = offerProductSearch?.value?.trim().toLowerCase() || "";
  const onlyCovers = Boolean(offerOnlyCovers?.checked);
  const filtered = (products || []).filter((item) => {
    const haystack = [item.name, item.category, item.costNotes].join(" ").toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    const matchesCoverFilter = !onlyCovers || haystack.includes("kapak") || haystack.includes("panjur");
    return matchesSearch && matchesCoverFilter;
  });

  offerProductsList.innerHTML = filtered.length ? filtered.map((item) => `
    <button class="offer-product-item" type="button"
      data-product-id="${item.id}"
      data-product-name="${escapeHtml(item.name)}"
      data-product-category="${escapeHtml(item.category || "")}"
      data-product-price="${item.salePrice || item.m2Price || 0}"
      data-product-cover-options="${escapeHtml(JSON.stringify(getPresetCoverTypes(item.category, item.name)))}">
      <strong>${escapeHtml(item.name)}</strong>
      <span>${escapeHtml(item.category || "Urun")}</span>
      <small>Satis ${formatCurrency(item.salePrice || item.m2Price || 0)}</small>
    </button>
  `).join("") : `<div class="entity-card empty-state">Urun bulunamadi. Once Urunler sayfasindan kayit ekleyin.</div>`;
}

function handleOfferProductPick(event) {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  if (offerLineInputs.coverType) {
    offerLineInputs.coverType.innerHTML = createOfferTypeOptions(button.dataset.productName || "", button.dataset.productCategory, button.dataset.productName);
  }
  if (offerLineInputs.materialGroup) {
    offerLineInputs.materialGroup.innerHTML = createOfferMaterialOptions(categoryToMaterialGroup(button.dataset.productCategory));
  }
  if (offerLineInputs.unitPrice) offerLineInputs.unitPrice.value = button.dataset.productPrice || "";
  if (offerLineInputs.note && !offerLineInputs.note.value) {
    offerLineInputs.note.value = `${button.dataset.productCategory || "Urun"} secildi`;
  }
  offerProductsList.querySelectorAll(".offer-product-item").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
}

function handleOfferProductDoublePick(event) {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  handleOfferProductPick(event);
  appendOfferLine();
}

function getPresetCoverTypes(category, productName) {
  const normalized = `${category || ""} ${productName || ""}`.toLowerCase();
  if (normalized.includes("lake") && normalized.includes("panjur")) return ["Lake Panjur Beyaz", "Lake Panjur RAL", "Lake Panjur Eskitme"];
  if (normalized.includes("lake")) return ["Lake Kapak Beyaz Duz", "Lake Kapak RAL Duz", "Lake Kapak Tarama Model", "Lake Kapak Citali"];
  if (normalized.includes("ham") && normalized.includes("panjur")) return ["Ham Panjur", "Kapali Panjur", "Derzli Panjur"];
  if (normalized.includes("ham")) return ["Ham Kapak Duz", "Ham Kapak Tarama", "Ham Kapak Citali"];
  if (normalized.includes("cam")) return ["Camli Kapak Cerceve", "Camli Kapak Citali", "Camli Duz Kapak"];
  if (normalized.includes("kapak")) return ["Duz Kapak", "Tarama Kapak", "Citali Kapak", "J Kulp Kapak"];
  return [productName || "Kapak"];
}

function categoryToMaterialGroup(category) {
  const normalized = String(category || "").toLowerCase();
  if (normalized.includes("lake panjur")) return "LAKE_PANJUR_KAPAK_22MM";
  if (normalized.includes("ham panjur")) return "HAM_PANJURLAR";
  if (normalized.includes("ham")) return "HAM_KAPAKLAR";
  if (normalized.includes("ahsap")) return "AHSAP_PANJUR_KAPAK";
  if (normalized.includes("cnc")) return "CNC_ISCILIK";
  if (normalized.includes("lake")) return "LAKE_KAPAK_18MM";
  return "KAPAK_YENI";
}

function handleOfferLineDelete(event) {
  const button = event.target.closest("[data-line-delete]");
  if (!button) return;
  const rows = offerLinesContainer?.querySelectorAll(".offer-line-row") || [];
  button.closest(".offer-line-row")?.remove();
  recalcOfferSummary();
}

function getOfferLineInputValues() {
  const width = Number(offerLineInputs.width?.value || 0);
  const height = Number(offerLineInputs.height?.value || 0);
  const quantity = Number(offerLineInputs.quantity?.value || 0);
  const materialGroup = offerLineInputs.materialGroup?.value || "";
  const coverType = offerLineInputs.coverType?.value?.trim() || "";
  const color = offerLineInputs.color?.value?.trim() || "";
  const unitPrice = Number(offerLineInputs.unitPrice?.value || 0);
  const note = offerLineInputs.note?.value?.trim() || "";

  if (!width || !height || !quantity || !coverType) {
    return null;
  }

  const m2 = (width * height * quantity) / 1000000;
  return {
    width,
    height,
    quantity,
    m2,
    materialGroup,
    coverType,
    color,
    unitPrice,
    total: m2 * unitPrice,
    note,
  };
}

function resetOfferLineInputs() {
  if (offerLineInputs.height) offerLineInputs.height.value = "";
  if (offerLineInputs.width) offerLineInputs.width.value = "";
  if (offerLineInputs.quantity) offerLineInputs.quantity.value = "1";
  if (offerLineInputs.materialGroup) {
    offerLineInputs.materialGroup.innerHTML = createOfferMaterialOptions("LAKE_KAPAK_18MM");
  }
  if (offerLineInputs.coverType) {
    offerLineInputs.coverType.innerHTML = createOfferTypeOptions("Kapak Secin", "", "");
  }
  if (offerLineInputs.color) offerLineInputs.color.value = "";
  if (offerLineInputs.unitPrice) offerLineInputs.unitPrice.value = "";
  if (offerLineInputs.note) offerLineInputs.note.value = "";
  offerProductsList?.querySelectorAll(".offer-product-item").forEach((item) => item.classList.remove("active"));
}

function collectOfferRows() {
  return [...(offerLinesContainer?.querySelectorAll(".offer-line-row") || [])]
    .map((row) => {
      try {
        return JSON.parse(row.dataset.row || "{}");
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function calculateOfferSummary(rows, discountRate, vatRate) {
  const totalQuantity = rows.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
  const totalM2 = rows.reduce((sum, row) => sum + Number(row.m2 || 0), 0);
  const grossTotal = rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
  const discountAmount = grossTotal * (Number(discountRate || 0) / 100);
  const subtotal = grossTotal - discountAmount;
  const vatAmount = subtotal * (Number(vatRate || 0) / 100);
  const grandTotal = subtotal + vatAmount;
  return { totalQuantity, totalM2, grossTotal, discountAmount, subtotal, vatAmount, grandTotal };
}

function recalcOfferSummary() {
  const rows = collectOfferRows();
  const summary = calculateOfferSummary(
    rows,
    Number(forms.offer?.querySelector("[name='discountRate']")?.value || 0),
    Number(forms.offer?.querySelector("[name='vatRate']")?.value || 0),
  );
  const quantityEl = document.getElementById("offerSummaryQuantity");
  const m2El = document.getElementById("offerSummaryM2");
  const grossEl = document.getElementById("offerSummaryGross");
  const grandEl = document.getElementById("offerSummaryGrand");
  if (offerLineCountLabel) offerLineCountLabel.textContent = `${rows.length} kalem`;
  if (quantityEl) quantityEl.textContent = String(summary.totalQuantity);
  if (m2El) m2El.textContent = summary.totalM2.toFixed(3);
  if (grossEl) grossEl.textContent = formatCurrency(summary.grossTotal);
  if (grandEl) grandEl.textContent = formatCurrency(summary.grandTotal);
}

function handleOfferCariChange() {
  const selectedId = Number(forms.offer?.querySelector("[name='cariId']")?.value || 0);
  const cari = (cache.cari || []).find((item) => item.id === selectedId);
  if (cari && offerDiscountRateInput) {
    offerDiscountRateInput.value = String(cari.discountRate || 0);
  }
  recalcOfferSummary();
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
  renderOfferProductsPicker(cache.products);
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

function clearCariSelection() {
  selectedCariId = null;
  forms.cari?.reset();
  if (cariEditId) cariEditId.value = "";
  if (cariSubmitBtn) cariSubmitBtn.textContent = "Cariyi Kaydet";
  renderCariDetail(null, [], []);
}

function fillCariForm(cari) {
  if (!cari || !forms.cari) return;
  selectedCariId = cari.id;
  if (cariEditId) cariEditId.value = String(cari.id);
  setCariFormValue("fullName", cari.fullName || "");
  setCariFormValue("companyName", cari.companyName || "");
  setCariFormValue("phone", cari.phone || "");
  setCariFormValue("taxOffice", cari.taxOffice || "");
  setCariFormValue("taxNumber", cari.taxNumber || "");
  setCariFormValue("discountRate", String(cari.discountRate || 0));
  setCariFormValue("balanceLimit", String(cari.balanceLimit || 0));
  setCariFormValue("riskLimit", String(cari.riskLimit || 0));
  setCariFormValue("type", cari.type || "Musteri");
  if (cariSubmitBtn) cariSubmitBtn.textContent = "Cariyi Guncelle";
  renderCariDetail(cari, cache.movements || [], cache.orders || []);
}

function setCariFormValue(name, value) {
  const input = forms.cari?.querySelector(`[name="${name}"]`);
  if (input) input.value = value;
}

function renderCariDetail(cari, movements, orders) {
  if (!cari) {
    if (cariDetailBadge) {
      cariDetailBadge.textContent = "Secim Yok";
      cariDetailBadge.className = "cari-status-badge";
    }
    if (cariDetailCompany) cariDetailCompany.textContent = "-";
    if (cariDetailName) cariDetailName.textContent = "-";
    if (cariDetailPhone) cariDetailPhone.textContent = "-";
    if (cariDetailLastMovement) cariDetailLastMovement.textContent = "-";
    if (cariDetailBalance) cariDetailBalance.textContent = "0 TL";
    if (cariDetailLimit) cariDetailLimit.textContent = "0 TL";
    return;
  }

  const balance = calcCariBalance(cari.id, movements, orders);
  const lastMovement = (movements || [])
    .filter((item) => item.cariId === cari.id)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  const exceeded = isCariLimitExceeded(cari.id, movements, orders, cari.balanceLimit);
  const badgeText = balance > 0 ? "Borclu" : "Alacakli";

  if (cariDetailBadge) {
    cariDetailBadge.textContent = badgeText;
    cariDetailBadge.className = `cari-status-badge ${balance > 0 ? "is-debt" : "is-credit"} ${exceeded ? "is-risk" : ""}`;
  }
  if (cariDetailCompany) cariDetailCompany.textContent = cari.companyName || "-";
  if (cariDetailName) cariDetailName.textContent = cari.fullName || "-";
  if (cariDetailPhone) cariDetailPhone.textContent = cari.phone || "-";
  if (cariDetailLastMovement) cariDetailLastMovement.textContent = lastMovement ? formatDate(lastMovement.date) : "Hareket yok";
  if (cariDetailBalance) cariDetailBalance.textContent = formatCurrency(balance);
  if (cariDetailLimit) cariDetailLimit.textContent = formatCurrency(cari.balanceLimit || 0);
}

function renderCari(records, movements, orders) {
  const target = document.getElementById("cariList");
  const totalEl = document.getElementById("cariStatTotal");
  const debtEl = document.getElementById("cariStatDebt");
  const riskEl = document.getElementById("cariStatRisk");
  const searchTerm = cariSearch?.value?.trim().toLowerCase() || "";
  const typeTerm = cariTypeFilter?.value || "";
  const balanceFilter = cariBalanceFilter?.value || "";
  const sortMode = cariSort?.value || "selected";
  const debtCount = (records || []).filter((item) => calcCariBalance(item.id, movements, orders) > 0).length;
  const riskCount = (records || []).filter((item) => isCariLimitExceeded(item.id, movements, orders, item.balanceLimit)).length;
  if (totalEl) totalEl.textContent = String((records || []).length);
  if (debtEl) debtEl.textContent = String(debtCount);
  if (riskEl) riskEl.textContent = String(riskCount);
  const filtered = (records || []).filter((item) => {
    const haystack = [item.companyName, item.fullName, item.phone, item.taxNumber].join(" ").toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    const matchesType = !typeTerm || item.type === typeTerm;
    const balance = calcCariBalance(item.id, movements, orders);
    const exceeds = isCariLimitExceeded(item.id, movements, orders, item.balanceLimit);
    const matchesBalance =
      !balanceFilter ||
      (balanceFilter === "debt" && balance > 0) ||
      (balanceFilter === "credit" && balance <= 0) ||
      (balanceFilter === "risk" && exceeds);
    return matchesSearch && matchesType && matchesBalance;
  });
  const sorted = [...filtered].sort((left, right) => sortCariRecords(left, right, movements, orders, sortMode));

  target.innerHTML = sorted.length ? sorted.map((item) => `
    <article class="entity-card cari-card ${selectedCariId === item.id ? "is-selected" : ""} ${isCariLimitExceeded(item.id, movements, orders, item.balanceLimit) ? "is-risk" : ""}" data-cari-select="${item.id}">
      <div><strong>${escapeHtml(item.companyName || item.fullName)}</strong><span>${escapeHtml(item.fullName)}</span></div>
      <div><small>${escapeHtml(item.phone)}</small><span>${escapeHtml(item.type)} | Iskonto %${item.discountRate || 0}</span></div>
      <div><small>${getCariLastMovementText(item.id, movements)}</small><span>Bakiye ${formatCurrency(calcCariBalance(item.id, movements, orders))}</span></div>
      <div class="entity-actions"><button class="ghost-action delete-btn" data-store="${STORES.cari}" data-id="${item.id}">Sil</button></div>
    </article>
  `).join("") : `<div class="entity-card empty-state">Cari kaydi bulunamadi.</div>`;
}

function sortCariRecords(left, right, movements, orders, mode) {
  const leftName = String(left.companyName || left.fullName || "").localeCompare(String(right.companyName || right.fullName || ""), "tr");
  const leftBalance = calcCariBalance(left.id, movements, orders);
  const rightBalance = calcCariBalance(right.id, movements, orders);
  const leftMovement = getCariLastMovementTimestamp(left.id, movements);
  const rightMovement = getCariLastMovementTimestamp(right.id, movements);

  if (mode === "selected") {
    if (left.id === selectedCariId) return -1;
    if (right.id === selectedCariId) return 1;
    return rightMovement - leftMovement || leftName;
  }
  if (mode === "name-asc") return leftName;
  if (mode === "name-desc") return -leftName;
  if (mode === "balance-desc") return rightBalance - leftBalance;
  if (mode === "balance-asc") return leftBalance - rightBalance;
  if (mode === "movement-desc") return rightMovement - leftMovement;
  return 0;
}

function getCariLastMovementText(cariId, movements) {
  const lastMovement = (movements || [])
    .filter((item) => item.cariId === cariId)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  return lastMovement ? `Son hareket ${formatDate(lastMovement.date)}` : "Hareket yok";
}

function getCariLastMovementTimestamp(cariId, movements) {
  const lastMovement = (movements || [])
    .filter((item) => item.cariId === cariId)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  return lastMovement ? new Date(lastMovement.date).getTime() : 0;
}

function renderCariSelect(records) {
  const select = document.getElementById("offerCariSelect");
  select.innerHTML = records.length ? records.map((item) => `<option value="${item.id}">${escapeHtml(item.companyName || item.fullName)}</option>`).join("") : `<option value="">Once cari ekleyin</option>`;
  handleOfferCariChange();
}

function renderMovementCariSelect(records) {
  const select = document.getElementById("movementCariSelect");
  if (!select) return;
  select.innerHTML = records.length ? records.map((item) => `<option value="${item.id}">${escapeHtml(item.companyName || item.fullName)}</option>`).join("") : `<option value="">Once cari ekleyin</option>`;
}

function renderMovements(movements, cariler) {
  const target = document.getElementById("movementsList");
  const cariMap = new Map(cariler.map((item) => [item.id, item]));
  const filteredMovements = selectedCariId ? movements.filter((item) => item.cariId === selectedCariId) : movements;
  target.innerHTML = filteredMovements.length ? filteredMovements.map((item) => {
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
  const filteredCariler = selectedCariId ? cariler.filter((cari) => cari.id === selectedCariId) : cariler;
  target.innerHTML = filteredCariler.length ? filteredCariler.map((cari) => {
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
      <span>TEKLIF NO</span><span>FORM / CARI</span><span>KALEM OZETI</span><span>TESLIM</span><span>TUTAR</span><span>ISLEM</span>
    </div>
    ${records.map((item) => `
      <div class="offers-row">
        <span>${escapeHtml(item.offerNo || `TK-${item.id}`)}<br><small>${escapeHtml(item.cariName)}</small></span>
        <span>${escapeHtml(item.meta?.formType || "Teklif Formu")}<br><small>${escapeHtml(item.cariName)}</small></span>
        <span>${escapeHtml(item.coverType)} / ${escapeHtml(item.color)}<br><small>${item.meta?.rows?.length || 1} kalem - ${item.meta?.summary?.totalQuantity || item.quantity} adet</small></span>
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
    ? records.map((item) => `<option value="${item.id}">${escapeHtml(item.offerNo || `TK-${item.id}`)} - ${escapeHtml(item.cariName)} - ${formatCurrency(item.netTotal)}</option>`).join("")
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
  const meta = offer.meta || {};
  const rows = meta.rows?.length ? meta.rows : [{
    coverType: offer.coverType,
    color: offer.color,
    width: offer.width,
    height: offer.height,
    quantity: offer.quantity,
    unitPrice: offer.unitPrice,
    total: offer.netTotal,
    note: "",
  }];
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
              <p class="muted">${escapeHtml(meta.formType || "Kapak Imalat Teklif Formu")}</p>
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
          <thead><tr><th>Kapak Cinsi</th><th>Renk</th><th>Olcu</th><th>Adet</th><th>M2</th><th>Birim</th><th>Tutar</th></tr></thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <td>${escapeHtml(row.coverType)}</td>
                <td>${escapeHtml(row.color || "-")}</td>
                <td>${Number(row.width || 0)} x ${Number(row.height || 0)} mm</td>
                <td>${Number(row.quantity || 0)}</td>
                <td>${Number(row.m2 || 0).toFixed(3)}</td>
                <td>${formatCurrency(row.unitPrice)}</td>
                <td>${formatCurrency(row.total)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <p class="total">Toplam Teklif: ${formatCurrency(meta.summary?.grandTotal || offer.netTotal)}</p>
      </div>
      <div class="card grid two">
        <div>
          <h3>Sevkiyat ve Termin</h3>
          <p>Kargo/Sevkiyat: ${escapeHtml(offer.shipment || "-")}</p>
          <p>Teslim Tarihi: ${formatDate(offer.deliveryDate)}</p>
          <p>Termin: ${offer.termDays} gun</p>
          <p>Toplam Kapak: ${meta.summary?.totalQuantity || offer.quantity}</p>
        </div>
        <div>
          <h3>Sozlesme</h3>
          <p class="muted">${escapeHtml(meta.notes || offer.contractText || "Sozlesme metni daha sonra eklenebilir.")}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function serializeOfferContract(meta) {
  return `__META__${JSON.stringify(meta)}`;
}

function parseOfferContract(contractText) {
  if (!contractText?.startsWith("__META__")) {
    return { notes: contractText || "", rows: [] };
  }
  try {
    return JSON.parse(contractText.slice("__META__".length));
  } catch {
    return { notes: contractText, rows: [] };
  }
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
  return (rows || []).map((row) => {
    const meta = parseOfferContract(row.contract_text);
    return {
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
      contractText: meta.notes || row.contract_text,
      meta,
      status: row.status,
      createdAt: row.created_at,
    };
  });
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

function isCariLimitExceeded(cariId, movements, orders, balanceLimit) {
  const limit = Number(balanceLimit || 0);
  if (!limit) return false;
  return calcCariBalance(cariId, movements, orders) > limit;
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
