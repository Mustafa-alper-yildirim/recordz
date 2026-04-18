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
const navGroupToggles = [...document.querySelectorAll("[data-nav-group]")];
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
const productCategoryForm = document.getElementById("productCategoryForm");
const productCategoryInput = document.getElementById("productCategoryInput");
const productCategoryList = document.getElementById("productCategoryList");
const categoryManagerForm = document.getElementById("categoryManagerForm");
const categoryManagerInput = document.getElementById("categoryManagerInput");
const categoryManagerList = document.getElementById("categoryManagerList");
const categoryTypeForm = document.getElementById("categoryTypeForm");
const categoryTypeInput = document.getElementById("categoryTypeInput");
const categoryTypeUnit = document.getElementById("categoryTypeUnit");
const categoryTypeList = document.getElementById("categoryTypeList");
const categoryTypeEditId = document.getElementById("categoryTypeEditId");
const categoryTypeResetBtn = document.getElementById("categoryTypeResetBtn");
const categoryTypeSubmitBtn = document.getElementById("categoryTypeSubmitBtn");
const categoryTypeSelectedName = document.getElementById("categoryTypeSelectedName");
const categoryTypeSelectedMeta = document.getElementById("categoryTypeSelectedMeta");
const productCategorySelect = document.getElementById("productCategorySelect");
const productTypeSelect = document.getElementById("productTypeSelect");
const productEditId = document.getElementById("productEditId");
const productImageFile = document.getElementById("productImageFile");
const productImagePreview = document.getElementById("productImagePreview");
const productResetBtn = document.getElementById("productResetBtn");
const productSubmitBtn = document.getElementById("productSubmitBtn");
const productFormSection = document.getElementById("productFormSection");
const productsListSection = document.getElementById("productsListSection");
const productsSearch = document.getElementById("productsSearch");
const productsSelectionSummary = document.getElementById("productsSelectionSummary");
const productFilterList = document.getElementById("productFilterList");
const productTypeFilterList = document.getElementById("productTypeFilterList");
const productsHierarchyTree = document.getElementById("productsHierarchyTree");
const productBulkUpdateForm = document.getElementById("productBulkUpdateForm");
const productBulkCategory = document.getElementById("productBulkCategory");
const productImageModal = document.getElementById("productImageModal");
const productImageModalImg = document.getElementById("productImageModalImg");
const productImageModalClose = document.getElementById("productImageModalClose");
const cariSearch = document.getElementById("cariSearch");
const cariTypeFilter = document.getElementById("cariTypeFilter");
const cariBalanceFilter = document.getElementById("cariBalanceFilter");
const cariSort = document.getElementById("cariSort");
const cariList = document.getElementById("cariList");
const cariEditId = document.getElementById("cariEditId");
const clearCariSelectionBtn = document.getElementById("clearCariSelectionBtn");
const cariSubmitBtn = document.getElementById("cariSubmitBtn");
const cariFormSection = document.getElementById("cariFormSection");
const cariListSection = document.getElementById("cariListSection");
const movementFormSection = document.getElementById("movementFormSection");
const cariStatementSection = document.getElementById("cariStatementSection");
const cariStatementSearch = document.getElementById("cariStatementSearch");
const cariStatementBalanceFilter = document.getElementById("cariStatementBalanceFilter");
const cariStatementSort = document.getElementById("cariStatementSort");
const cariStatementDetailPanel = document.getElementById("cariStatementDetailPanel");
const cariStatementDetailTitle = document.getElementById("cariStatementDetailTitle");
const cariStatementDetailMeta = document.getElementById("cariStatementDetailMeta");
const cariStatementDetailContent = document.getElementById("cariStatementDetailContent");
const cariStatementDetailCloseBtn = document.getElementById("cariStatementDetailCloseBtn");
const cariStatementPrintBtn = document.getElementById("cariStatementPrintBtn");
const cariStatementOutputForm = document.getElementById("cariStatementOutputForm");
const cariStatementLogoFile = document.getElementById("cariStatementLogoFile");
const cariStatementPreviewFrame = document.getElementById("cariStatementPreviewFrame");
const cariStatementDesignList = document.getElementById("cariStatementDesignList");
const cariStatementDesignName = document.getElementById("cariStatementDesignName");
const cariStatementDesignCreateBtn = document.getElementById("cariStatementDesignCreateBtn");
const cariStatementDesignActivateBtn = document.getElementById("cariStatementDesignActivateBtn");
const cariStatementDesignDuplicateBtn = document.getElementById("cariStatementDesignDuplicateBtn");
const cariStatementDesignDeleteBtn = document.getElementById("cariStatementDesignDeleteBtn");
const cariStatementDesignSaveBtn = document.getElementById("cariStatementDesignSaveBtn");
const movementEditId = document.getElementById("movementEditId");
const movementResetBtn = document.getElementById("movementResetBtn");
const movementSubmitBtn = document.getElementById("movementSubmitBtn");
const movementsFilter = document.getElementById("movementsFilter");
const movementReceiptBtn = document.getElementById("movementReceiptBtn");
const movementReceiptPanel = document.getElementById("movementReceiptPanel");
const movementReceiptForm = document.getElementById("movementReceiptForm");
const movementReceiptCloseBtn = document.getElementById("movementReceiptCloseBtn");
const movementReceiptPrintBtn = document.getElementById("movementReceiptPrintBtn");
const movementReceiptCopyBtn = document.getElementById("movementReceiptCopyBtn");
const movementReceiptWhatsappBtn = document.getElementById("movementReceiptWhatsappBtn");
const cariStickyName = document.getElementById("cariStickyName");
const cariStickyMeta = document.getElementById("cariStickyMeta");
const cariStickyBalance = document.getElementById("cariStickyBalance");
const cariStatDebtAmount = document.getElementById("cariStatDebtAmount");
const cariStatCreditAmount = document.getElementById("cariStatCreditAmount");
const cariMiniChart = document.getElementById("cariMiniChart");
const cariDetailBadge = document.getElementById("cariDetailBadge");
const cariDetailCompany = document.getElementById("cariDetailCompany");
const cariDetailName = document.getElementById("cariDetailName");
const cariDetailPhone = document.getElementById("cariDetailPhone");
const cariDetailLastMovement = document.getElementById("cariDetailLastMovement");
const cariDetailBalance = document.getElementById("cariDetailBalance");
const cariDetailLimit = document.getElementById("cariDetailLimit");
const cariDetailDiscount = document.getElementById("cariDetailDiscount");
const cariDetailNotes = document.getElementById("cariDetailNotes");
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
  categories: ["Kategori Yonetimi", "Kapak ve urun kategorilerini ayri ekranda ekleyin ve duzenleyin.", "+ Yeni Kategori"],
  products: ["Urun ve Kapak Fiyatlari", "Alis, satis ve m2 fiyatlarini detayli yonetin.", "+ Yeni Urun"],
  stocks: ["Stok ve Hammadde", "Hammadde ve stok kalemlerini miktar ve birim fiyatlariyla izleyin.", "+ Yeni Stok"],
  finance: ["Cari Hareket ve Takip", "Cari borc ve alacak dekontlarini girin, cari durumunu tablo halinde izleyin.", "+ Yeni Dekont"],
  reports: ["Raporlar", "Siparis, ciro, cari ve personel raporlarini bu ekranda izleyin.", "+ Rapor Olustur"],
  personnel: ["Personel Takibi", "Ozluk, maas ve mesai bilgilerini kayit altina alin.", "+ Yeni Personel"],
  users: ["Kullanici Yonetimi", "Kullanici, rol ve yetki ekranlari burada yer alacak.", "+ Yeni Kullanici"],
  sms: ["Sms Modulu", "Sms sablonlari ve gonderim surecleri burada yonetilecek.", "+ Yeni Sms"],
  settings: ["Ayarlar", "Programin kullanim notlari ve demo sifirlama islemleri.", "Panele Don"],
};

let currentView = "dashboard";
let cache = {};
let selectedCariId = null;
let selectedMovementId = null;
let selectedProductCategoryFilter = "";
let selectedProductTypeFilter = "";
let selectedExpandedProductCategory = "";
let selectedCategoryManager = "";
let currentCariSubview = "list";
let currentFinanceSubview = "movement";
let currentProductsSubview = "form";
let selectedStatementCariId = null;
let productSortState = {
  key: "name",
  dir: "asc",
};
const PRODUCT_CATEGORY_STORAGE_KEY = "silva-product-categories";
const CARI_STATEMENT_DESIGNS_STORAGE_KEY = "silva-cari-statement-designs";
const CARI_STATEMENT_ACTIVE_DESIGN_STORAGE_KEY = "silva-cari-statement-active-design-id";
let cariStatementDesigns = [];
let activeCariStatementDesignId = "";
let hasPendingCariStatementDesignChanges = false;

function setActiveNavLink(activeLink) {
  navLinks.forEach((link) => link.classList.toggle("active", link === activeLink));
}

initializeMoneyInputs();

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    if (window.innerWidth <= 860) {
      sidebar.classList.toggle("open");
      return;
    }
    document.body.classList.toggle("sidebar-collapsed");
  });
}

navLinks.forEach((link) => link.addEventListener("click", () => {
  setActiveNavLink(link);
  if (!link.dataset.view) return;
  setActiveView(link.dataset.view);
  if (link.dataset.view === "cari") {
    const targetId = link.dataset.sectionTarget || "";
    currentCariSubview = targetId === "cariFormSection" ? "form" : "list";
    applyCariSubview(currentCariSubview);
  }
  if (link.dataset.view === "finance") {
    const targetId = link.dataset.sectionTarget || "";
    currentFinanceSubview = targetId === "cariStatementSection" ? "statement" : "movement";
    applyFinanceSubview(currentFinanceSubview);
  }
  if (link.dataset.view === "products") {
    const targetId = link.dataset.sectionTarget || "";
    currentProductsSubview = targetId === "productsListSection" ? "list" : "form";
    applyProductsSubview(currentProductsSubview);
  }
  const targetId = link.dataset.sectionTarget;
  if (targetId) {
    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}));
navGroupToggles.forEach((toggle) => toggle.addEventListener("click", () => {
  setActiveNavLink(toggle);
  const groupName = toggle.dataset.navGroup;
  const wrap = document.querySelector(`[data-nav-group-wrap="${groupName}"]`);
  wrap?.classList.toggle("open");
}));
quickLinks.forEach((link) => link.addEventListener("click", () => setActiveView(link.dataset.action || link.dataset.viewLink)));
cariStatementOutputForm?.addEventListener("input", handleCariStatementDesignFormChange);
cariStatementOutputForm?.addEventListener("change", handleCariStatementDesignFormChange);

cariStatementDesignList?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-design-id]");
  if (!card) return;
  selectCariStatementDesign(card.dataset.designId || "");
});

cariStatementDesignName?.addEventListener("input", () => {
  markCariStatementDesignAsDirty();
  refreshCariStatementPreview();
});

cariStatementDesignCreateBtn?.addEventListener("click", () => {
  createCariStatementDesign(String(cariStatementDesignName?.value || "").trim());
});

cariStatementDesignActivateBtn?.addEventListener("click", () => {
  const design = getActiveCariStatementDesign();
  if (!design) return;
  activeCariStatementDesignId = design.id;
  saveCariStatementDesignStore();
  renderCariStatementDesignList();
  refreshCariStatementPreview();
});

cariStatementDesignDuplicateBtn?.addEventListener("click", duplicateActiveCariStatementDesign);
cariStatementDesignDeleteBtn?.addEventListener("click", deleteActiveCariStatementDesign);
cariStatementDesignSaveBtn?.addEventListener("click", saveActiveCariStatementDesignChanges);

primaryActionBtn?.addEventListener("click", () => {
  const targetMap = {
    dashboard: ["offers", forms.offer],
    cari: ["cari", forms.cari],
    offers: ["offers", forms.offer],
    orders: ["offers", forms.offer],
    categories: ["categories", categoryManagerForm],
    products: ["products", forms.product],
    stocks: ["stocks", forms.stock],
    finance: ["finance", forms.movement],
    reports: ["reports", null],
    personnel: ["personnel", forms.personnel],
    users: ["users", null],
    sms: ["sms", null],
    settings: ["dashboard", null],
  };
  const [viewName, form] = targetMap[currentView] || ["dashboard", null];
  setActiveView(viewName);
  if (viewName === "cari") {
    currentCariSubview = "form";
    applyCariSubview(currentCariSubview);
  }
  if (viewName === "finance") {
    currentFinanceSubview = "movement";
    applyFinanceSubview(currentFinanceSubview);
  }
  if (viewName === "products") {
    currentProductsSubview = "form";
    applyProductsSubview(currentProductsSubview);
  }
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
  try {
    const data = formToObject(forms.cari);
    const payload = {
      fullName: data.fullName,
      companyName: data.companyName,
      phone: data.phone,
      taxOffice: data.taxOffice,
      taxNumber: data.taxNumber,
      discountRate: Math.max(0, Math.min(100, parseDecimalInput(data.discountRate))),
      balanceLimit: 0,
      riskLimit: parseMoneyInput(data.riskLimit),
      type: data.type,
      notes: data.notes || "",
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
        notes: payload.notes,
      });
    } else {
      await addRecord(STORES.cari, payload);
    }
    clearCariSelection();
    await refreshUI();
  } catch (error) {
    console.error("Cari kaydi guncellenemedi:", error);
    window.alert(`Cari kaydi guncellenemedi: ${error?.message || "Bilinmeyen hata"}`);
  }
});

forms.movement?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.movement);
  const payload = {
    cariId: Number(data.cariId),
    movementType: data.movementType,
    amount: parseMoneyInput(data.amount),
    date: data.date,
    note: data.note || "",
  };
  if (movementEditId?.value) {
    await updateMovementRecord(Number(movementEditId.value), payload);
  } else {
    await addRecord(STORES.movements, payload);
  }
  const receiptPayload = { ...payload };
  const receiptCariId = payload.cariId;
  resetMovementForm();
  setDefaultDates();
  await refreshUI();
  const receiptCari = (cache.cari || []).find((item) => item.id === receiptCariId);
  if (receiptCari) {
    openMovementReceiptBuilderFromData(receiptPayload, receiptCari);
    movementReceiptPrintBtn?.focus();
  }
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
  if (!data.category) {
    window.alert("Lutfen once bir kategori secin.");
    productCategorySelect?.focus();
    return;
  }
  const payload = {
    name: data.name,
    type: data.type || data.name,
    category: data.category,
    costType: data.costType || "M2",
    costAmount: parseMoneyInput(data.costAmount),
    imageUrl: data.imageUrl || "",
    costNotes: data.costNotes,
  };
  if (productEditId?.value) {
    await api.products.update(Number(productEditId.value), buildProductApiPayload(payload));
  } else {
    await addRecord(STORES.products, payload);
  }
  resetProductFormEditor();
  await refreshUI();
});

function addProductCategory(value = "") {
  const normalizedValue = (value || "").trim();
  if (!normalizedValue) return false;
  const categories = getStoredProductCategories();
  if (!categories.some((item) => item.toLowerCase() === normalizedValue.toLowerCase())) {
    categories.push(normalizedValue);
    saveStoredProductCategories(categories);
  }
  renderProductCategories(cache.products || []);
  return true;
}

function buildProductApiPayload(payload = {}) {
  const costType = payload.costType || payload.cost_type || "M2";
  const costAmount = Number(payload.costAmount ?? payload.cost_amount ?? payload.salePrice ?? payload.sale_price ?? 0) || 0;
  const unit = payload.unit || payload.productTypeUnit || "M2";
  return {
    name: payload.name || "",
    type: payload.type || payload.name || "",
    category: payload.category || "Kategorisiz",
    purchase_price: Number(payload.purchasePrice ?? payload.purchase_price ?? costAmount) || 0,
    sale_price: Number(payload.salePrice ?? payload.sale_price ?? costAmount) || 0,
    m2_price: Number(payload.m2Price ?? payload.m2_price ?? (costType === "M2" ? costAmount : 0)) || 0,
    raw_m2_price: Number(payload.rawM2Price ?? payload.raw_m2_price ?? 0) || 0,
    painted_m2_price: Number(payload.paintedM2Price ?? payload.painted_m2_price ?? 0) || 0,
    unit,
    cost_type: costType,
    cost_amount: costAmount,
    image_url: payload.imageUrl ?? payload.image_url ?? "",
    cost_notes: payload.costNotes ?? payload.cost_notes ?? "",
  };
}

productCategoryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (addProductCategory(productCategoryInput?.value)) {
    if (productCategoryInput) productCategoryInput.value = "";
  }
});

categoryManagerForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (addProductCategory(categoryManagerInput?.value)) {
    if (categoryManagerInput) {
      categoryManagerInput.value = "";
      categoryManagerInput.focus();
    }
  }
});

categoryTypeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedCategoryManager) {
    window.alert("Lutfen once soldan bir kategori secin.");
    return;
  }
  const name = categoryTypeInput?.value?.trim();
  if (!name) return;
  const unit = categoryTypeUnit?.value || "M2";

  if (categoryTypeEditId?.value) {
    const existing = (cache.products || []).find((item) => item.id === Number(categoryTypeEditId.value));
    if (!existing) return;
    await api.products.update(existing.id, buildProductApiPayload({
      ...existing,
      name,
      category: selectedCategoryManager,
      unit,
    }));
  } else {
    await api.products.create(buildProductApiPayload({
      name,
      category: selectedCategoryManager,
      unit,
      cost_type: "M2",
      cost_amount: 0,
      image_url: "",
      cost_notes: "",
    }));
  }

  resetCategoryTypeForm();
  await refreshUI();
});

categoryTypeResetBtn?.addEventListener("click", resetCategoryTypeForm);

productResetBtn?.addEventListener("click", resetProductFormEditor);

productImageFile?.addEventListener("change", async () => {
  const file = productImageFile.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    const imageInput = forms.product?.querySelector("[name='imageUrl']");
    const dataUrl = String(reader.result || "");
    renderProductImagePreview(dataUrl);
    if (productSubmitBtn) productSubmitBtn.disabled = true;
    try {
      const response = await api.products.uploadImage({
        data_url: dataUrl,
        file_name: file.name,
      });
      if (imageInput) imageInput.value = response.image_url || "";
      renderProductImagePreview(response.image_url || "");
    } catch (error) {
      window.alert(error.message || "Gorsel yuklenemedi.");
      if (imageInput) imageInput.value = "";
      renderProductImagePreview("");
    } finally {
      if (productSubmitBtn) productSubmitBtn.disabled = false;
    }
  };
  reader.readAsDataURL(file);
});

forms.stock?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.stock);
  await addRecord(STORES.stocks, {
    name: data.name,
    type: data.type,
    quantity: Number(data.quantity || 0),
    unit: data.unit,
    unitPrice: parseMoneyInput(data.unitPrice),
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
    amount: parseMoneyInput(data.amount),
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
    salary: parseMoneyInput(data.salary),
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
movementResetBtn?.addEventListener("click", resetMovementForm);
movementsFilter?.addEventListener("change", () => renderMovements(cache.movements || [], cache.cari || []));
movementReceiptBtn?.addEventListener("click", openMovementReceiptBuilder);
cariStatementSearch?.addEventListener("input", () => renderCariStatements(cache.cari || [], cache.movements || [], cache.orders || []));
cariStatementBalanceFilter?.addEventListener("change", () => renderCariStatements(cache.cari || [], cache.movements || [], cache.orders || []));
cariStatementSort?.addEventListener("change", () => renderCariStatements(cache.cari || [], cache.movements || [], cache.orders || []));
cariStatementDetailCloseBtn?.addEventListener("click", () => {
  selectedStatementCariId = null;
  renderCariStatements(cache.cari || [], cache.movements || [], cache.orders || []);
});
cariStatementPrintBtn?.addEventListener("click", printCariStatementDetail);
cariStatementLogoFile?.addEventListener("change", () => {
  const file = cariStatementLogoFile.files?.[0];
  if (!file) {
    setFormFieldValue(cariStatementOutputForm, "logoDataUrl", "");
    handleCariStatementDesignFormChange();
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    setFormFieldValue(cariStatementOutputForm, "logoDataUrl", String(reader.result || ""));
    handleCariStatementDesignFormChange();
  };
  reader.readAsDataURL(file);
});
movementReceiptCloseBtn?.addEventListener("click", () => {
  if (movementReceiptPanel) movementReceiptPanel.hidden = true;
});
movementReceiptPrintBtn?.addEventListener("click", printMovementReceipt);
movementReceiptCopyBtn?.addEventListener("click", copyMovementReceiptMessage);
movementReceiptWhatsappBtn?.addEventListener("click", sendMovementReceiptWhatsapp);
document.addEventListener("click", async (event) => {
  const cariEditButton = event.target.closest(".edit-cari-btn");
  if (cariEditButton) {
    event.preventDefault();
    event.stopPropagation();
    const cari = (cache.cari || []).find((item) => item.id === Number(cariEditButton.dataset.id));
    if (cari) fillCariForm(cari);
    return;
  }
  const editButton = event.target.closest(".edit-movement-btn");
  if (editButton) {
    event.preventDefault();
    event.stopPropagation();
    const movement = (cache.movements || []).find((item) => item.id === Number(editButton.dataset.id));
    if (movement) fillMovementForm(movement);
    return;
  }
  const button = event.target.closest(".delete-btn");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  if (!window.confirm("Bu kaydi silmek istiyor musunuz?")) return;
  await deleteRecord(button.dataset.store, Number(button.dataset.id));
  await refreshUI();
});

document.getElementById("productsList")?.addEventListener("click", (event) => {
  if (event.target.closest(".delete-btn")) return;
  const imageButton = event.target.closest("[data-product-image-open]");
  if (imageButton) {
    openProductImageModal(imageButton.dataset.productImageOpen || "");
    return;
  }
  const card = event.target.closest("[data-product-edit]");
  if (!card) return;
  const product = (cache.products || []).find((item) => item.id === Number(card.dataset.productEdit));
  if (product) {
    fillProductForm(product);
  }
});
document.getElementById("productsList")?.addEventListener("click", (event) => {
  const sortButton = event.target.closest("[data-product-sort]");
  if (!sortButton) return;
  const key = sortButton.dataset.productSort;
  if (!key) return;
  if (productSortState.key === key) {
    productSortState.dir = productSortState.dir === "asc" ? "desc" : "asc";
  } else {
    productSortState = { key, dir: "asc" };
  }
  renderProducts(cache.products || []);
});

productImageModal?.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-product-image]")) {
    closeProductImageModal();
  }
});
productImageModalClose?.addEventListener("click", closeProductImageModal);

cariList?.addEventListener("click", (event) => {
  if (event.target.closest(".delete-btn") || event.target.closest(".edit-cari-btn")) return;
  const card = event.target.closest("[data-cari-select]");
  if (!card) return;
  const cari = (cache.cari || []).find((item) => item.id === Number(card.dataset.cariSelect));
  if (!cari) return;
  resetCariFormEditor();
  selectedCariId = cari.id;
  renderCariSticky(cari, cache.movements || [], cache.orders || []);
  renderCariDetail(cari, cache.movements || [], cache.orders || []);
  renderCari(cache.cari || [], cache.movements || [], cache.orders || []);
  renderMovements(cache.movements || [], cache.cari || []);
  renderCariStatements(cache.cari || [], cache.movements || [], cache.orders || []);
});

document.getElementById("cariStatementList")?.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-cari-statement-detail]");
  if (!detailButton) return;
  const clickedCariId = Number(detailButton.dataset.cariStatementDetail);
  selectedStatementCariId = selectedStatementCariId === clickedCariId ? null : clickedCariId;
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
productsSearch?.addEventListener("input", () => renderProducts(cache.products || []));
async function handleCategoryListClick(event, source = "products") {
  const editButton = event.target.closest("[data-category-edit]");
  if (editButton) {
    const oldName = editButton.dataset.categoryEdit || "";
    const newName = window.prompt("Yeni kategori adini girin:", oldName)?.trim();
    if (!newName || newName === oldName) return;
    await renameProductCategory(oldName, newName);
    return;
  }
  const deleteButton = event.target.closest("[data-category-delete]");
  if (deleteButton) {
    const categoryName = deleteButton.dataset.categoryDelete || "";
    if (!window.confirm(`"${categoryName}" kategorisini silmek istiyor musunuz? Bu kategorideki urunler "Kategorisiz" olarak guncellenecek.`)) return;
    await deleteProductCategory(categoryName);
    return;
  }
  const button = event.target.closest("[data-category-pick]");
  if (!button) return;
  const pickedCategory = button.dataset.categoryPick || "";
  if (source === "categories") {
    selectedCategoryManager = pickedCategory;
    resetCategoryTypeForm();
    renderProductCategories(cache.products || []);
    renderCategoryTypeManager(cache.products || []);
    categoryTypeInput?.focus();
    return;
  }
  if (!productCategorySelect) return;
  productCategorySelect.value = pickedCategory;
  renderProductCategories(cache.products || []);
  if (source === "products") {
    productCategorySelect.focus();
  }
}
productCategoryList?.addEventListener("click", (event) => {
  handleCategoryListClick(event, "products");
});
categoryManagerList?.addEventListener("click", (event) => {
  handleCategoryListClick(event, "categories");
});
categoryTypeList?.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-category-type-edit]");
  if (editButton) {
    const product = (cache.products || []).find((item) => item.id === Number(editButton.dataset.categoryTypeEdit));
    if (product) {
      fillCategoryTypeForm(product);
    }
    return;
  }
  const deleteButton = event.target.closest("[data-category-type-delete]");
  if (deleteButton) {
    const productId = Number(deleteButton.dataset.categoryTypeDelete);
    const product = (cache.products || []).find((item) => item.id === productId);
    if (!product) return;
    if (!window.confirm(`"${product.name}" urun cinsini silmek istiyor musunuz?`)) return;
    await api.products.delete(productId);
    resetCategoryTypeForm();
    await refreshUI();
  }
});
productCategorySelect?.addEventListener("change", () => {
  syncProductTypeSelect(cache.products || [], productCategorySelect.value);
  renderProductCategories(cache.products || []);
});
productFilterList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-filter]");
  if (!button) return;
  selectedProductCategoryFilter = button.dataset.productFilter || "";
  selectedProductTypeFilter = "";
  renderProducts(cache.products || []);
});
productTypeFilterList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-type-filter]");
  if (!button) return;
  selectedProductTypeFilter = button.dataset.productTypeFilter || "";
  renderProducts(cache.products || []);
});
productsHierarchyTree?.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("[data-hierarchy-toggle]");
  if (toggleButton) {
    const category = toggleButton.dataset.hierarchyToggle || "";
    selectedExpandedProductCategory = selectedExpandedProductCategory === category ? "" : category;
    renderProducts(cache.products || []);
    return;
  }
  const categoryButton = event.target.closest("[data-hierarchy-category]");
  if (categoryButton) {
    selectedProductCategoryFilter = categoryButton.dataset.hierarchyCategory || "";
    selectedExpandedProductCategory = selectedProductCategoryFilter;
    selectedProductTypeFilter = "";
    renderProducts(cache.products || []);
    return;
  }
  const typeButton = event.target.closest("[data-hierarchy-product-type]");
  if (typeButton) {
    selectedProductCategoryFilter = typeButton.dataset.hierarchyCategory || "";
    selectedExpandedProductCategory = selectedProductCategoryFilter;
    selectedProductTypeFilter = typeButton.dataset.hierarchyProductType || "";
    renderProducts(cache.products || []);
  }
});
productBulkUpdateForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(productBulkUpdateForm);
  const amount = parseMoneyInput(data.value);
  if (!data.category) {
    window.alert("Lutfen bir kategori secin.");
    productBulkCategory?.focus();
    return;
  }
  if (!Number.isFinite(amount) || amount === 0) {
    window.alert("Guncelleme degeri girin.");
    return;
  }
  await api.products.bulkUpdateCategory({
    category: data.category,
    mode: data.mode,
    value: amount,
  });
  productBulkUpdateForm.reset();
  if (productBulkCategory) productBulkCategory.value = data.category;
  await refreshUI();
});

window.addEventListener("DOMContentLoaded", async () => {
  setDefaultDates();
  syncOfferDefaults();
  initializeOfferLines(createDefaultOfferRows());
  ensureCariStatementDesignStore();
  await ensureAutoLogin();
  await applyAuthState();
  if (getSession()) {
    await refreshUI();
  }
});

function setActiveView(viewName) {
  currentView = viewName;
  views.forEach((view) => view.classList.toggle("active", view.id === `view-${viewName}`));
  const meta = viewMeta[viewName];
  if (meta) {
    pageTitle.textContent = meta[0];
    pageDescription.textContent = meta[1];
    primaryActionBtn.textContent = meta[2];
  }
  if (viewName === "cari") {
    applyCariSubview(currentCariSubview);
  }
  if (viewName === "finance") {
    applyFinanceSubview(currentFinanceSubview);
  }
  if (viewName === "products") {
    applyProductsSubview(currentProductsSubview);
  }
  sidebar?.classList.remove("open");
}

function applyCariSubview(mode) {
  const showForm = mode === "form";
  if (cariFormSection) cariFormSection.hidden = !showForm;
  if (cariListSection) cariListSection.hidden = showForm;
}

function applyFinanceSubview(mode) {
  const showMovement = mode === "movement";
  if (movementFormSection) movementFormSection.hidden = !showMovement;
  if (cariStatementSection) cariStatementSection.hidden = showMovement;
}

function applyProductsSubview(mode) {
  const showList = mode === "list";
  if (showList) {
    productSortState = { key: "name", dir: "asc" };
  }
  if (productFormSection) productFormSection.hidden = showList;
  if (productsListSection) productsListSection.hidden = !showList;
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

function initializeMoneyInputs() {
  document.querySelectorAll("input[data-money='1']").forEach((input) => {
    if (input.dataset.moneyBound === "1") return;
    input.dataset.moneyBound = "1";
    input.addEventListener("focus", () => {
      if (!input.value) return;
      input.value = normalizeEditableMoney(input.value);
    });
    input.addEventListener("blur", () => {
      if (!input.value.trim()) return;
      input.value = formatMoneyInputValue(input.value);
    });
    if (input.value) input.value = formatMoneyInputValue(input.value);
  });
}

function parseMoneyInput(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  let text = String(value || "").trim();
  if (!text) return 0;
  text = text.replace(/[^\d,.-]/g, "");
  if (text.includes(",")) {
    text = text.replace(/\./g, "").replace(",", ".");
  } else {
    const dotCount = (text.match(/\./g) || []).length;
    if (dotCount > 1) {
      const lastDotIndex = text.lastIndexOf(".");
      text = `${text.slice(0, lastDotIndex).replace(/\./g, "")}.${text.slice(lastDotIndex + 1)}`;
    } else if (dotCount === 1) {
      const [left = "", right = ""] = text.split(".");
      const looksLikeThousandsSeparator = right.length === 3 && left.length >= 1;
      if (looksLikeThousandsSeparator) {
        text = `${left}${right}`;
      }
    }
  }
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeEditableMoney(value) {
  const parsed = parseMoneyInput(value);
  return Number.isFinite(parsed) ? String(parsed).replace(".", ",") : "";
}

function parseDecimalInput(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  let text = String(value || "").trim();
  if (!text) return 0;
  text = text.replace(/[^\d,.-]/g, "");
  if (text.includes(",") && text.includes(".")) {
    text = text.replace(/\./g, "").replace(",", ".");
  } else {
    text = text.replace(",", ".");
  }
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoneyInputValue(value) {
  const parsed = parseMoneyInput(value);
  return parsed.toLocaleString("tr-TR", {
    minimumFractionDigits: Number.isInteger(parsed) ? 0 : 2,
    maximumFractionDigits: 2,
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
      data-product-price="${item.costAmount || item.m2Price || item.salePrice || 0}"
      data-product-cover-options="${escapeHtml(JSON.stringify(getPresetCoverTypes(item.category, item.name)))}">
      <strong>${escapeHtml(item.name)}</strong>
      <span>${escapeHtml(item.category || "Urun")}</span>
      <small>Maliyet ${formatCurrency(item.costAmount || item.m2Price || item.salePrice || 0)}</small>
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
  if (offerLineInputs.unitPrice) offerLineInputs.unitPrice.value = formatMoneyInputValue(button.dataset.productPrice || 0);
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
  const unitPrice = parseMoneyInput(offerLineInputs.unitPrice?.value || 0);
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
      notes: payload.notes,
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
      return api.products.create(buildProductApiPayload(payload));
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

async function updateMovementRecord(id, payload) {
  return api.movements.update(id, {
    cari_id: payload.cariId,
    movement_type: payload.movementType,
    amount: payload.amount,
    movement_date: payload.date,
    note: payload.note,
  });
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
  renderCategoryTypeManager(cache.products);
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
  resetCariFormEditor();
  currentCariSubview = "list";
  if (currentView === "cari") {
    applyCariSubview(currentCariSubview);
  }
  renderCariSticky(null, [], []);
  renderCariDetail(null, [], []);
}

function resetCariFormEditor() {
  forms.cari?.reset();
  if (cariEditId) cariEditId.value = "";
  if (cariSubmitBtn) cariSubmitBtn.textContent = "Cariyi Kaydet";
}

function resetMovementForm() {
  forms.movement?.reset();
  if (movementEditId) movementEditId.value = "";
  selectedMovementId = null;
  if (movementSubmitBtn) movementSubmitBtn.textContent = "Hareketi Kaydet";
  movementResetBtn?.classList.remove("is-active");
  movementSubmitBtn?.classList.remove("is-active");
  const dateInput = forms.movement?.querySelector('[name="date"]');
  if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
  if (movementReceiptPanel) movementReceiptPanel.hidden = true;
  renderMovements(cache.movements || [], cache.cari || []);
  initializeMoneyInputs();
}

function fillMovementForm(movement) {
  if (!movement || !forms.movement) return;
  setActiveView("finance");
  currentFinanceSubview = "movement";
  applyFinanceSubview(currentFinanceSubview);
  if (movementEditId) movementEditId.value = String(movement.id);
  selectedMovementId = movement.id;
  const cariInput = forms.movement.querySelector('[name="cariId"]');
  const typeInput = forms.movement.querySelector('[name="movementType"]');
  const amountInput = forms.movement.querySelector('[name="amount"]');
  const dateInput = forms.movement.querySelector('[name="date"]');
  const noteInput = forms.movement.querySelector('[name="note"]');
  if (cariInput) cariInput.value = String(movement.cariId);
  if (typeInput) typeInput.value = movement.movementType;
  if (amountInput) amountInput.value = formatMoneyInputValue(movement.amount || 0);
  if (dateInput) dateInput.value = movement.date || "";
  if (noteInput) noteInput.value = movement.note || "";
  if (movementSubmitBtn) movementSubmitBtn.textContent = "Hareketi Guncelle";
  movementResetBtn?.classList.add("is-active");
  movementSubmitBtn?.classList.add("is-active");
  renderMovements(cache.movements || [], cache.cari || []);
  document.getElementById("movementFormSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openMovementReceiptBuilder() {
  const data = formToObject(forms.movement);
  const cari = (cache.cari || []).find((item) => String(item.id) === String(data.cariId));
  if (!cari) {
    window.alert("Makbuz olusturmak icin once bir cari secin.");
    return;
  }
  openMovementReceiptBuilderFromData({
    cariId: Number(data.cariId),
    movementType: data.movementType || "",
    amount: Number(data.amount || 0),
    date: data.date,
    note: data.note || "",
  }, cari);
}

function openMovementReceiptBuilderFromData(data, cari) {
  if (!movementReceiptForm) return;
  const receiptNo = `MKB-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${movementEditId?.value || "YENI"}`;
  setReceiptField("receiptTitle", "Cari Dekont Makbuzu");
  setReceiptField("receiptNo", receiptNo);
  setReceiptField("logoUrl", "");
  setReceiptField("companyName", cari.companyName || "");
  setReceiptField("contactName", cari.fullName || "");
  setReceiptField("phone", cari.phone || "");
  setReceiptField("whatsappPhone", normalizePhoneForWhatsapp(cari.phone || ""));
  setReceiptField("movementType", data.movementType || "");
  setReceiptField("amount", formatCurrency(Number(data.amount || 0)));
  setReceiptField("date", formatDate(data.date));
  setReceiptField("description", data.note || `${data.movementType || "Dekont"} islemine ait makbuz.`);
  setReceiptField("receiptNote", "Bu makbuz Silva Ahsap Kapak Imalat Programi uzerinden olusturulmustur.");
  setReceiptField("signatureName", "Yetkili Imza");
  setReceiptField("signatureTitle", "Silva Ahsap Yetkilisi");
  if (movementReceiptPanel) movementReceiptPanel.hidden = false;
  movementReceiptPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function setReceiptField(name, value) {
  const input = movementReceiptForm?.querySelector(`[name="${name}"]`);
  if (!input) return;
  input.value = value || "";
}

function getMovementReceiptData() {
  if (!movementReceiptForm) return null;
  return formToObject(movementReceiptForm);
}

function printMovementReceipt() {
  const data = getMovementReceiptData();
  if (!data) return;
  const printWindow = window.open("", "_blank", "width=860,height=760");
  if (!printWindow) return;
  printWindow.document.write(buildMovementReceiptHtml(data));
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}

function sendMovementReceiptWhatsapp() {
  const data = getMovementReceiptData();
  if (!data) return;
  const phone = normalizePhoneForWhatsapp(data.whatsappPhone || data.phone || "");
  const message = buildMovementReceiptMessage(data);
  const baseUrl = phone ? `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}` : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(baseUrl, "_blank");
}

async function copyMovementReceiptMessage() {
  const data = getMovementReceiptData();
  if (!data) return;
  const message = buildMovementReceiptMessage(data);
  try {
    await navigator.clipboard.writeText(message);
    window.alert("Makbuz mesaji kopyalandi. Simdi WhatsApp Web uzerinden yapistirabilirsiniz.");
  } catch {
    window.alert("Mesaj kopyalanamadi. Tarayici izinlerini kontrol edin.");
  }
}

function buildMovementReceiptMessage(data) {
  return [
    data.receiptTitle,
    `Belge No: ${data.receiptNo}`,
    `Firma: ${data.companyName}`,
    `Yetkili: ${data.contactName}`,
    `Telefon: ${data.phone}`,
    `Tur: ${data.movementType}`,
    `Tutar: ${data.amount}`,
    `Tarih: ${data.date}`,
    `Aciklama: ${data.description}`,
    data.receiptNote ? `Not: ${data.receiptNote}` : "",
  ].filter(Boolean).join("\n");
}

function normalizePhoneForWhatsapp(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `9${digits}`;
  return digits;
}

function buildMovementReceiptHtml(data) {
  const logoMarkup = data.logoUrl ? `<img src="${escapeHtml(data.logoUrl)}" alt="Firma Logosu" class="logo">` : "";
  return `
    <!doctype html>
    <html lang="tr">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(data.receiptTitle || "Cari Dekont Makbuzu")}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          * { box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            color: #162233;
            background: #ffffff;
          }
          .sheet {
            width: 100%;
            min-height: calc(297mm - 28mm);
            border: 1px solid #d8e1ec;
            border-radius: 16px;
            overflow: hidden;
            background: #fff;
          }
          .top-band {
            height: 10px;
            background: linear-gradient(90deg, #1d4ed8 0%, #60a5fa 100%);
          }
          .content {
            padding: 22px 24px 26px;
          }
          .head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 18px;
            padding-bottom: 18px;
            border-bottom: 1px solid #e6edf5;
          }
          .brand {
            display: flex;
            gap: 14px;
            align-items: center;
          }
          .logo {
            width: 78px;
            height: 78px;
            object-fit: contain;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 8px;
            background: #fff;
          }
          .brand-copy h1 {
            margin: 0 0 6px;
            font-size: 24px;
            letter-spacing: 0.2px;
          }
          .subtitle {
            color: #64748b;
            font-size: 12px;
          }
          .doc-box {
            min-width: 220px;
            padding: 14px 16px;
            border: 1px solid #dbe4ef;
            border-radius: 14px;
            background: #f8fbff;
          }
          .doc-box span {
            display: block;
            font-size: 11px;
            color: #64748b;
            margin-bottom: 4px;
          }
          .doc-box strong {
            display: block;
            font-size: 15px;
            margin-bottom: 10px;
          }
          .summary-strip {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr 0.8fr;
            gap: 12px;
            margin: 18px 0;
          }
          .summary-card {
            border: 1px solid #dbe4ef;
            border-radius: 14px;
            padding: 14px 16px;
            background: #fbfdff;
          }
          .summary-card span {
            display: block;
            color: #64748b;
            font-size: 11px;
            margin-bottom: 6px;
          }
          .summary-card strong {
            display: block;
            font-size: 18px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 18px;
          }
          .item {
            border: 1px solid #e6edf5;
            border-radius: 12px;
            padding: 14px 16px;
            background: #ffffff;
          }
          .item span {
            display: block;
            color: #6b7280;
            font-size: 11px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .item strong {
            display: block;
            font-size: 15px;
            line-height: 1.45;
          }
          .wide { grid-column: 1 / -1; }
          .note {
            min-height: 96px;
            white-space: pre-wrap;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 18px;
            margin-top: 28px;
          }
          .footer-note {
            max-width: 55%;
            color: #64748b;
            font-size: 11px;
            line-height: 1.5;
          }
          .signature {
            min-width: 250px;
            text-align: center;
          }
          .signature-line {
            margin-top: 34px;
            border-top: 1px solid #94a3b8;
            padding-top: 10px;
          }
          .signature-line strong {
            display: block;
            font-size: 14px;
            margin-bottom: 4px;
          }
          .signature-line span {
            color: #64748b;
            font-size: 12px;
          }
          @media print {
            body { background: #fff; }
            .sheet { border: 0; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="top-band"></div>
          <div class="content">
            <div class="head">
              <div class="brand">
                ${logoMarkup}
                <div class="brand-copy">
                  <h1>${escapeHtml(data.receiptTitle || "Cari Dekont Makbuzu")}</h1>
                  <div class="subtitle">Silva Ahsap Kapak Imalat Programi</div>
                </div>
              </div>
              <div class="doc-box">
                <span>Belge No</span>
                <strong>${escapeHtml(data.receiptNo || "-")}</strong>
                <span>Belge Tarihi</span>
                <strong>${escapeHtml(data.date || "-")}</strong>
              </div>
            </div>
            <div class="summary-strip">
              <div class="summary-card">
                <span>Firma</span>
                <strong>${escapeHtml(data.companyName || "-")}</strong>
              </div>
              <div class="summary-card">
                <span>Dekont Turu</span>
                <strong>${escapeHtml(data.movementType || "-")}</strong>
              </div>
              <div class="summary-card">
                <span>Tutar</span>
                <strong>${escapeHtml(data.amount || "-")}</strong>
              </div>
            </div>
            <div class="grid">
              <div class="item"><span>Yetkili Kisi</span><strong>${escapeHtml(data.contactName || "-")}</strong></div>
              <div class="item"><span>Telefon</span><strong>${escapeHtml(data.phone || "-")}</strong></div>
              <div class="item wide"><span>Aciklama</span><strong class="note">${escapeHtml(data.description || "-")}</strong></div>
              <div class="item wide"><span>Ek Not</span><strong class="note">${escapeHtml(data.receiptNote || "-")}</strong></div>
            </div>
            <div class="footer">
              <div class="footer-note">
                Bu belge, cari hareket kaydina istinaden bilgi ve onay amacli duzenlenmistir.
                Gerekli durumlarda firma yetkilisi ile iletisime geciniz.
              </div>
              <div class="signature">
                <div class="signature-line">
                  <strong>${escapeHtml(data.signatureName || "Yetkili Imza")}</strong>
                  <span>${escapeHtml(data.signatureTitle || "Silva Ahsap Yetkilisi")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function fillCariForm(cari) {
  if (!cari || !forms.cari) return;
  setActiveView("cari");
  currentCariSubview = "form";
  applyCariSubview(currentCariSubview);
  selectedCariId = cari.id;
  if (cariEditId) cariEditId.value = String(cari.id);
  setCariFormValue("fullName", cari.fullName || "");
  setCariFormValue("companyName", cari.companyName || "");
  setCariFormValue("phone", cari.phone || "");
  setCariFormValue("taxOffice", cari.taxOffice || "");
  setCariFormValue("taxNumber", cari.taxNumber || "");
  setCariFormValue("discountRate", String(cari.discountRate || 0));
  setCariFormValue("riskLimit", formatMoneyInputValue(cari.riskLimit || 0));
  setCariFormValue("type", normalizeCariType(cari.type));
  setCariFormValue("notes", cari.notes || "");
  if (cariSubmitBtn) cariSubmitBtn.textContent = "Cariyi Guncelle";
  renderCariSticky(cari, cache.movements || [], cache.orders || []);
  renderCariDetail(cari, cache.movements || [], cache.orders || []);
}

function normalizeCariType(value) {
  const validTypes = new Set(["Musteri", "Tedarikci", "Musteri/Tedarikci"]);
  return validTypes.has(value) ? value : "Musteri";
}

function setCariFormValue(name, value) {
  const input = forms.cari?.querySelector(`[name="${name}"]`);
  if (input) input.value = value;
}

function renderCariSticky(cari, movements, orders) {
  if (!cari) {
    if (cariStickyName) cariStickyName.textContent = "Cari secilmedi";
    if (cariStickyMeta) cariStickyMeta.textContent = "Listeden bir cari secin.";
    if (cariStickyBalance) cariStickyBalance.textContent = formatCurrency(0);
    return;
  }

  const balance = calcCariBalance(cari.id, movements, orders);
  const meta = [cari.type || "-", cari.phone || "-", getCariLastMovementText(cari.id, movements)]
    .filter(Boolean)
    .join(" • ");

  if (cariStickyName) cariStickyName.textContent = cari.companyName || cari.fullName || "Cari";
  if (cariStickyMeta) cariStickyMeta.textContent = meta;
  if (cariStickyBalance) cariStickyBalance.textContent = formatCurrency(balance);
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
    if (cariDetailDiscount) cariDetailDiscount.textContent = "0%";
    if (cariDetailNotes) cariDetailNotes.textContent = "-";
    return;
  }

  const balance = calcCariBalance(cari.id, movements, orders);
  const lastMovement = (movements || [])
    .filter((item) => item.cariId === cari.id)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  const exceeded = isCariLimitExceeded(cari.id, movements, orders, cari.balanceLimit);
  const badgeText = balance > 0 ? "Borclu" : balance < 0 ? "Alacakli" : "Bakiye Yok";

  if (cariDetailBadge) {
    cariDetailBadge.textContent = badgeText;
    cariDetailBadge.className = `cari-status-badge ${balance > 0 ? "is-debt" : balance < 0 ? "is-credit" : ""} ${exceeded ? "is-risk" : ""}`.trim();
  }
  if (cariDetailCompany) cariDetailCompany.textContent = cari.companyName || "-";
  if (cariDetailName) cariDetailName.textContent = cari.fullName || "-";
  if (cariDetailPhone) cariDetailPhone.textContent = cari.phone || "-";
  if (cariDetailLastMovement) cariDetailLastMovement.textContent = lastMovement ? formatDate(lastMovement.date) : "Hareket yok";
  if (cariDetailBalance) cariDetailBalance.textContent = formatCurrency(balance);
  if (cariDetailLimit) cariDetailLimit.textContent = formatCurrency(cari.riskLimit || 0);
  if (cariDetailDiscount) cariDetailDiscount.textContent = `%${Number(cari.discountRate || 0)}`;
  if (cariDetailNotes) cariDetailNotes.textContent = (cari.notes || "").trim() || "-";
}

function renderCari(records, movements, orders) {
  const target = document.getElementById("cariList");
  if (!target) return;
  const totalEl = document.getElementById("cariStatTotal");
  const debtEl = document.getElementById("cariStatDebt");
  const riskEl = document.getElementById("cariStatRisk");
  const debtAmountEl = cariStatDebtAmount;
  const creditAmountEl = cariStatCreditAmount;
  const searchTerm = cariSearch?.value?.trim().toLowerCase() || "";
  const typeTerm = cariTypeFilter?.value || "";
  const balanceFilter = cariBalanceFilter?.value || "";
  const sortMode = cariSort?.value || "name-asc";
  const balances = new Map((records || []).map((item) => [item.id, calcCariBalance(item.id, movements, orders)]));
  const debtCount = (records || []).filter((item) => (balances.get(item.id) || 0) > 0).length;
  const riskCount = (records || []).filter((item) => isCariLimitExceeded(item.id, movements, orders, item.balanceLimit)).length;
  const debtAmount = (records || []).reduce((sum, item) => sum + Math.max(0, balances.get(item.id) || 0), 0);
  const creditAmount = (records || []).reduce((sum, item) => sum + Math.abs(Math.min(0, balances.get(item.id) || 0)), 0);
  if (totalEl) totalEl.textContent = String((records || []).length);
  if (debtEl) debtEl.textContent = String(debtCount);
  if (riskEl) riskEl.textContent = String(riskCount);
  if (debtAmountEl) debtAmountEl.textContent = formatCurrency(debtAmount);
  if (creditAmountEl) creditAmountEl.textContent = formatCurrency(creditAmount);
  const filtered = (records || []).filter((item) => {
      const haystack = [item.companyName, item.fullName, item.phone, item.taxNumber].join(" ").toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      const matchesType = !typeTerm || item.type === typeTerm;
      const balance = balances.get(item.id) || 0;
      const exceeds = isCariLimitExceeded(item.id, movements, orders, item.balanceLimit);
      const matchesBalance =
        !balanceFilter ||
        (balanceFilter === "debt" && balance > 0) ||
        (balanceFilter === "credit" && balance <= 0) ||
        (balanceFilter === "risk" && exceeds);
      return matchesSearch && matchesType && matchesBalance;
    });
  const sorted = [...filtered].sort((left, right) => sortCariRecords(left, right, movements, orders, sortMode));
  const selectedCari = (records || []).find((item) => item.id === selectedCariId) || null;

  renderCariSticky(selectedCari, movements, orders);
  target.innerHTML = sorted.length ? sorted.map((item, index) => {
    const orderDebt = calcCariOrderTotal(item.id, orders);
    const movementTotals = calcCariMovementTotals(item.id, movements);
    const movementDebt = movementTotals.debt;
    const creditTotal = movementTotals.credit;
    const debtTotal = orderDebt + movementDebt;
    const balance = balances.get(item.id) || 0;
    const exceeded = isCariLimitExceeded(item.id, movements, orders, item.balanceLimit);
    const statusText = balance > 0 ? "Borclu" : balance < 0 ? "Alacakli" : "Bakiye Yok";
    return `
      <article class="cari-table-row ${selectedCariId === item.id ? "is-selected" : ""} ${exceeded ? "is-risk" : ""}" data-cari-select="${item.id}">
        <span class="cari-cell cell-no">${String(index + 1).padStart(3, "0")}</span>
        <span class="cari-cell cell-name">
          <strong>${escapeHtml(item.companyName || item.fullName || "-")}</strong>
          <small>${escapeHtml(item.fullName || item.type || "-")}</small>
        </span>
        <span class="cari-cell cell-money">${formatCurrency(debtTotal)}</span>
        <span class="cari-cell cell-money">${formatCurrency(creditTotal)}</span>
        <span class="cari-cell cell-money ${balance > 0 ? "is-debt" : balance < 0 ? "is-credit" : ""}">${formatCurrency(balance)}</span>
        <span class="cari-cell cell-status"><b class="cari-row-status ${balance > 0 ? "is-debt" : balance < 0 ? "is-credit" : ""} ${exceeded ? "is-risk" : ""}">${statusText}</b></span>
        <span class="cari-cell cell-actions">
          <button class="ghost-action compact-action" type="button" data-cari-select="${item.id}">Detay</button>
          <button class="ghost-action compact-action edit-cari-btn" type="button" data-id="${item.id}">Duzenle</button>
        </span>
      </article>
    `;
  }).join("") : `<div class="entity-card empty-state">Cari kaydi bulunamadi.</div>`;
}

function renderCariMiniChart(records, balances) {
  if (!cariMiniChart) return;
  const sorted = [...(records || [])]
    .sort((left, right) => Math.abs(balances.get(right.id) || 0) - Math.abs(balances.get(left.id) || 0))
    .slice(0, 6);
  const maxValue = sorted.reduce((max, item) => Math.max(max, Math.abs(balances.get(item.id) || 0)), 0) || 1;

  cariMiniChart.innerHTML = sorted.length ? sorted.map((item) => {
    const value = balances.get(item.id) || 0;
    const width = Math.max(8, Math.round((Math.abs(value) / maxValue) * 100));
    return `
      <div class="cari-mini-row" title="${escapeHtml(item.companyName || item.fullName || "Cari")} - ${formatCurrency(value)}">
        <span>${escapeHtml(shortenText(item.companyName || item.fullName || "Cari", 18))}</span>
        <div class="cari-mini-bar ${value > 0 ? "is-debt" : "is-credit"}">
          <i style="width:${width}%"></i>
        </div>
        <strong>${formatCompactCurrency(value)}</strong>
      </div>
    `;
  }).join("") : `<div class="cari-mini-empty">Grafik icin cari verisi bulunamadi.</div>`;
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
  const currentValue = select.value;
  const sorted = [...(records || [])].sort((left, right) => {
    const leftName = String(left.companyName || left.fullName || "");
    const rightName = String(right.companyName || right.fullName || "");
    return leftName.localeCompare(rightName, "tr");
  });
  select.innerHTML = sorted.length ? sorted.map((item) => `<option value="${item.id}">${escapeHtml(item.companyName || item.fullName)}</option>`).join("") : `<option value="">Once cari ekleyin</option>`;
  if (currentValue && sorted.some((item) => String(item.id) === String(currentValue))) {
    select.value = currentValue;
  }
}

function renderMovements(movements, cariler) {
  const target = document.getElementById("movementsList");
  if (!target) return;
  const cariMap = new Map(cariler.map((item) => [item.id, item]));
  const filteredMovements = selectedCariId ? movements.filter((item) => item.cariId === selectedCariId) : movements;
  const sortedMovements = [...filteredMovements].sort((left, right) => {
    if (left.id === selectedMovementId) return -1;
    if (right.id === selectedMovementId) return 1;
    return new Date(right.date || 0) - new Date(left.date || 0) || (right.id || 0) - (left.id || 0);
  });
  const visibleMovements = movementsFilter?.value === "all" ? sortedMovements : sortedMovements.slice(0, 10);
    target.innerHTML = visibleMovements.length ? visibleMovements.map((item) => {
          const cari = cariMap.get(item.cariId);
          const sign = isCreditMovement(item.movementType) ? "+" : "-";
          const noteText = item.note ? escapeHtml(shortenText(item.note, 42)) : "-";
          return `
            <article class="entity-card ${selectedMovementId === item.id ? "is-selected" : ""}">
              <div class="movement-card-main">
                <strong>${escapeHtml(cari?.companyName || cari?.fullName || "Cari")}</strong>
                <span>${escapeHtml(item.movementType)} | ${formatDate(item.date)}</span>
                <small>${noteText}</small>
              </div>
              <div class="movement-card-side">
                <strong>${sign}${formatCurrency(item.amount)}</strong>
                <div class="entity-actions">
                  <button class="ghost-action edit-movement-btn" data-id="${item.id}">Duzenle</button>
                  <button class="ghost-action delete-btn" data-store="${STORES.movements}" data-id="${item.id}">Sil</button>
                </div>
              </div>
          </article>
        `;
    }).join("") : `<div class="entity-card empty-state">Cari hareketi bulunamadi.</div>`;
  }

function renderCariStatements(cariler, movements, orders) {
  const target = document.getElementById("cariStatementList");
  if (!target) return;
  const searchTerm = cariStatementSearch?.value?.trim().toLowerCase() || "";
  const balanceFilter = cariStatementBalanceFilter?.value || "all";
  const sortValue = cariStatementSort?.value || "name_asc";
  const statementRows = (cariler || []).map((cari) => {
    const orderTotal = calcCariOrderTotal(cari.id, orders);
    const creditTotal = (movements || []).filter((item) => item.cariId === cari.id && isCreditMovement(item.movementType)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const debtTotal = (movements || []).filter((item) => item.cariId === cari.id && !isCreditMovement(item.movementType)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const balance = calcCariBalance(cari.id, movements, orders);
    return { cari, orderTotal, creditTotal, debtTotal, balance };
  }).filter(({ cari, balance }) => {
    const searchText = [cari.companyName, cari.fullName, cari.type].join(" ").toLowerCase();
    if (searchTerm && !searchText.includes(searchTerm)) return false;
    if (balanceFilter === "debt") return balance > 0;
    if (balanceFilter === "credit") return balance < 0;
    if (balanceFilter === "zero") return balance === 0;
    return true;
  });
  statementRows.sort((left, right) => {
    switch (sortValue) {
      case "balance_asc":
        return left.balance - right.balance;
      case "name_asc":
        return String(left.cari.companyName || left.cari.fullName || "").localeCompare(String(right.cari.companyName || right.cari.fullName || ""), "tr");
      case "name_desc":
        return String(right.cari.companyName || right.cari.fullName || "").localeCompare(String(left.cari.companyName || left.cari.fullName || ""), "tr");
      case "credit_desc":
        return right.creditTotal - left.creditTotal;
      case "debt_desc":
        return right.debtTotal - left.debtTotal;
      case "order_desc":
        return right.orderTotal - left.orderTotal;
      case "balance_desc":
      default:
        return right.balance - left.balance;
    }
  });
  target.innerHTML = statementRows.length ? `
    <div class="cari-statement-table-shell">
      <div class="cari-statement-table-head">
        <span class="is-center">No</span>
        <span class="is-left">Cari</span>
        <span class="is-right">Siparis</span>
        <span class="is-right">Alacak</span>
        <span class="is-right">Borc</span>
        <span class="is-right">Bakiye</span>
        <span class="is-center">Detay</span>
      </div>
      <div class="cari-statement-table-body">
        ${statementRows.map(({ cari, orderTotal, creditTotal, debtTotal, balance }, index) => {
    const balanceClass = balance > 0 ? "is-debt" : balance < 0 ? "is-credit" : "";
    return `
      <article class="cari-statement-row">
        <span class="cari-statement-cell">${String(index + 1).padStart(3, "0")}</span>
        <span class="cari-statement-cell cell-name">
          <strong>${escapeHtml(cari.companyName || cari.fullName)}</strong>
          <small>${escapeHtml(cari.type)}</small>
        </span>
        <span class="cari-statement-cell cell-money">${formatCurrency(orderTotal)}</span>
        <span class="cari-statement-cell cell-money is-credit">${formatCurrency(creditTotal)}</span>
        <span class="cari-statement-cell cell-money is-debt">${formatCurrency(debtTotal)}</span>
        <span class="cari-statement-cell cell-money ${balanceClass}">${formatCurrency(balance)}</span>
        <span class="cari-statement-cell cell-detail-action">
          <button class="ghost-action icon-action-btn ${selectedStatementCariId === cari.id ? "is-active" : ""}" type="button" data-cari-statement-detail="${cari.id}" aria-label="Muhasebe kayitlarini goster">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </span>
      </article>
    `;
  }).join("")}
      </div>
    </div>
  ` : `<div class="entity-card empty-state">Cari ekstre verisi bulunamadi.</div>`;
  renderCariStatementDetail(movements, orders, statementRows);
}

function renderCariStatementDetail(movements, orders, statementRows) {
  if (!cariStatementDetailPanel || !cariStatementDetailContent || !cariStatementDetailTitle || !cariStatementDetailMeta) return;
  const activeRow = statementRows.find(({ cari }) => cari.id === selectedStatementCariId);
  if (!activeRow) {
    cariStatementDetailPanel.hidden = true;
    cariStatementDetailContent.innerHTML = "";
    return;
  }
  const { cari, balance, orderTotal, creditTotal, debtTotal } = activeRow;
  const movementRows = (movements || [])
    .filter((item) => item.cariId === cari.id)
    .sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0) || (right.id || 0) - (left.id || 0));
  cariStatementDetailTitle.textContent = `${cari.companyName || cari.fullName} - Muhasebe Kayitlari`;
  cariStatementDetailMeta.textContent = `Siparis ${formatCurrency(orderTotal)} | Alacak ${formatCurrency(creditTotal)} | Borc ${formatCurrency(debtTotal)} | Bakiye ${formatCurrency(balance)}`;
  cariStatementDetailContent.innerHTML = movementRows.length ? `
    <div class="cari-statement-movement-table">
      <div class="cari-statement-movement-head">
        <span>Tarih</span>
        <span>Kayit Turu</span>
        <span>Aciklama</span>
        <span>Tutar</span>
      </div>
      <div class="cari-statement-movement-body">
        ${movementRows.map((item) => {
          const amountClass = isCreditMovement(item.movementType) ? "is-credit" : "is-debt";
          return `
            <article class="cari-statement-movement-row">
              <span>${formatDate(item.date)}</span>
              <span>${escapeHtml(item.movementType || "-")}</span>
              <span>${escapeHtml(item.note || "-")}</span>
              <span class="${amountClass}">${formatCurrency(item.amount)}</span>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  ` : `<div class="entity-card empty-state">Bu cariye ait muhasebe kaydi bulunamadi.</div>`;
  syncCariStatementOutputForm(cari);
  cariStatementDetailPanel.hidden = false;
}

function createDefaultCariStatementDesign(overrides = {}) {
  return {
    id: overrides.id || `cari-extre-${Date.now()}`,
    name: overrides.name || "Ornek Cari Extre",
    config: {
      documentTitle: "CARI HESAP EKSTRESI",
      companyDisplayName: "SILVA AHSAP",
      companyCode: "CR02829",
      statementStatusLabel: "BORCLU",
      logoUrl: "",
      logoDataUrl: "",
      pageSize: "A4",
      pageOrientation: "portrait",
      pageMarginMm: "14",
      fontFamily: "Arial, sans-serif",
      baseFontSize: "10",
      titleFontSize: "20",
      metaFontSize: "10",
      accentColor: "#1f2937",
      headerBgColor: "#f3f4f6",
      headerTextColor: "#374151",
      cardBgColor: "#ffffff",
      borderColor: "#cfd6df",
      tableStyle: "clean",
      tableDensity: "compact",
      taxOffice: "",
      taxNumber: "",
      signatureName: "",
      signatureTitle: "",
      currencyCode: "TRY",
      dateRangeText: "",
      footerText: "SILVA AHSAP",
      footerContact: "0543 632 89 71 | silvaahsap@gmail.com",
      pageNumberText: "1 / 1",
      introText: "",
      extraNote: "",
      customCss: "",
      ...overrides.config,
    },
  };
}

function loadCariStatementDesigns() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CARI_STATEMENT_DESIGNS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.map((item, index) => createDefaultCariStatementDesign({
      id: item?.id || `cari-extre-${Date.now()}-${index}`,
      name: item?.name || `Tasarim ${index + 1}`,
      config: item?.config || {},
    })) : [];
  } catch {
    return [];
  }
}

function saveCariStatementDesignStore() {
  window.localStorage.setItem(CARI_STATEMENT_DESIGNS_STORAGE_KEY, JSON.stringify(cariStatementDesigns));
  window.localStorage.setItem(CARI_STATEMENT_ACTIVE_DESIGN_STORAGE_KEY, activeCariStatementDesignId || "");
}

function getActiveCariStatementDesign() {
  return cariStatementDesigns.find((item) => item.id === activeCariStatementDesignId) || cariStatementDesigns[0] || null;
}

function renderCariStatementDesignList() {
  if (!cariStatementDesignList) return;
  cariStatementDesignList.innerHTML = cariStatementDesigns.map((design) => `
    <article class="settings-form-card ${design.id === activeCariStatementDesignId ? "is-active" : ""}" data-design-id="${design.id}">
      <strong>${escapeHtml(design.name)}</strong>
      <span>Cari Extre Form tasarimi</span>
    </article>
  `).join("");
}

function applyCariStatementDesignToForm(design) {
  if (!cariStatementOutputForm || !design) return;
  Object.entries(design.config || {}).forEach(([name, value]) => setFormFieldValue(cariStatementOutputForm, name, value));
  if (cariStatementDesignName) cariStatementDesignName.value = design.name || "";
  if (cariStatementLogoFile) cariStatementLogoFile.value = "";
}

function readCariStatementDesignConfigFromForm() {
  return cariStatementOutputForm ? formToObject(cariStatementOutputForm) : {};
}

function setCariStatementSaveButtonState() {
  if (!cariStatementDesignSaveBtn) return;
  cariStatementDesignSaveBtn.disabled = !hasPendingCariStatementDesignChanges;
  cariStatementDesignSaveBtn.textContent = hasPendingCariStatementDesignChanges ? "Degisiklikleri Kaydet" : "Kaydedildi";
}

function markCariStatementDesignAsDirty() {
  hasPendingCariStatementDesignChanges = true;
  setCariStatementSaveButtonState();
}

function clearCariStatementDesignDirtyState() {
  hasPendingCariStatementDesignChanges = false;
  setCariStatementSaveButtonState();
}

function updateActiveCariStatementDesignFromForm() {
  const design = getActiveCariStatementDesign();
  if (!design || !cariStatementOutputForm) return;
  design.name = String(cariStatementDesignName?.value || design.name || "").trim() || "Yeni Form Tasarimi";
  design.config = {
    ...design.config,
    ...readCariStatementDesignConfigFromForm(),
  };
  activeCariStatementDesignId = design.id;
  saveCariStatementDesignStore();
  renderCariStatementDesignList();
  clearCariStatementDesignDirtyState();
}

function saveActiveCariStatementDesignChanges() {
  updateActiveCariStatementDesignFromForm();
  refreshCariStatementPreview();
}

function selectCariStatementDesign(designId) {
  const design = cariStatementDesigns.find((item) => item.id === designId);
  if (!design) return;
  activeCariStatementDesignId = design.id;
  applyCariStatementDesignToForm(design);
  const selectedCari = (cache.cari || []).find((item) => item.id === selectedStatementCariId);
  if (selectedCari) {
    setFormFieldValue(cariStatementOutputForm, "taxOffice", selectedCari.taxOffice || design.config.taxOffice || "");
    setFormFieldValue(cariStatementOutputForm, "taxNumber", selectedCari.taxNumber || design.config.taxNumber || "");
    setFormFieldValue(cariStatementOutputForm, "extraNote", (selectedCari.notes || "").trim() || design.config.extraNote || "");
  }
  saveCariStatementDesignStore();
  renderCariStatementDesignList();
  clearCariStatementDesignDirtyState();
  refreshCariStatementPreview();
}

function ensureCariStatementDesignStore() {
  cariStatementDesigns = loadCariStatementDesigns();
  if (!cariStatementDesigns.length) {
    cariStatementDesigns = [createDefaultCariStatementDesign()];
  }
  const storedActiveId = window.localStorage.getItem(CARI_STATEMENT_ACTIVE_DESIGN_STORAGE_KEY) || "";
  activeCariStatementDesignId = cariStatementDesigns.some((item) => item.id === storedActiveId) ? storedActiveId : cariStatementDesigns[0].id;
  const activeDesign = getActiveCariStatementDesign();
  if (activeDesign) {
    applyCariStatementDesignToForm(activeDesign);
  }
  saveCariStatementDesignStore();
  renderCariStatementDesignList();
  clearCariStatementDesignDirtyState();
  refreshCariStatementPreview();
}

function createCariStatementDesign(name = "", sourceConfig = null) {
  const newDesign = createDefaultCariStatementDesign({
    id: `cari-extre-${Date.now()}`,
    name: name || "Yeni Form Tasarimi",
    config: sourceConfig ? { ...sourceConfig } : {},
  });
  cariStatementDesigns.unshift(newDesign);
  activeCariStatementDesignId = newDesign.id;
  applyCariStatementDesignToForm(newDesign);
  saveCariStatementDesignStore();
  renderCariStatementDesignList();
  clearCariStatementDesignDirtyState();
  refreshCariStatementPreview();
}

function duplicateActiveCariStatementDesign() {
  const design = getActiveCariStatementDesign();
  if (!design) return;
  createCariStatementDesign(`${design.name} Kopya`, design.config);
}

function deleteActiveCariStatementDesign() {
  if (cariStatementDesigns.length <= 1) {
    window.alert("En az bir form tasarimi kalmalidir.");
    return;
  }
  const design = getActiveCariStatementDesign();
  if (!design) return;
  if (!window.confirm(`"${design.name}" tasarimini silmek istiyor musunuz?`)) return;
  cariStatementDesigns = cariStatementDesigns.filter((item) => item.id !== design.id);
  activeCariStatementDesignId = cariStatementDesigns[0]?.id || "";
  const nextDesign = getActiveCariStatementDesign();
  if (nextDesign) {
    applyCariStatementDesignToForm(nextDesign);
  }
  saveCariStatementDesignStore();
  renderCariStatementDesignList();
  clearCariStatementDesignDirtyState();
  refreshCariStatementPreview();
}

function handleCariStatementDesignFormChange() {
  markCariStatementDesignAsDirty();
  refreshCariStatementPreview();
}

function syncCariStatementOutputForm(cari) {
  if (!cariStatementOutputForm || !cari) return;
  if (!cariStatementDesigns.length) ensureCariStatementDesignStore();
  setFormFieldValue(cariStatementOutputForm, "taxOffice", cari.taxOffice || "");
  setFormFieldValue(cariStatementOutputForm, "taxNumber", cari.taxNumber || "");
  setFormFieldValue(cariStatementOutputForm, "extraNote", (cari.notes || "").trim());
  const inferredStatus = calcCariBalance(cari.id, cache.movements || [], cache.orders || []) >= 0 ? "BORCLU" : "ALACAKLI";
  setFormFieldValue(cariStatementOutputForm, "statementStatusLabel", inferredStatus);
  refreshCariStatementPreview();
}

function setFormFieldValue(form, name, value) {
  const input = form?.querySelector(`[name="${name}"]`);
  if (input) input.value = value || "";
}

function getSelectedCariStatementSnapshot() {
  const cari = (cache.cari || []).find((item) => item.id === selectedStatementCariId);
  if (!cari) return null;
  const movements = (cache.movements || [])
    .filter((item) => item.cariId === cari.id)
    .sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0) || (right.id || 0) - (left.id || 0));
  const orders = cache.orders || [];
  const orderTotal = calcCariOrderTotal(cari.id, orders);
  const creditTotal = movements.filter((item) => isCreditMovement(item.movementType)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const debtTotal = movements.filter((item) => !isCreditMovement(item.movementType)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = calcCariBalance(cari.id, cache.movements || [], orders);
  return { cari, movements, orderTotal, creditTotal, debtTotal, balance };
}

function printCariStatementDetail() {
  const snapshot = getSelectedCariStatementSnapshot();
  if (!snapshot) {
    window.alert("Detayli cikti almak icin once bir cari secin.");
    return;
  }
  const outputConfig = formToObject(cariStatementOutputForm);
  const printWindow = window.open("", "_blank", "width=980,height=820");
  if (!printWindow) return;
  printWindow.document.write(buildCariStatementPrintHtml(snapshot, outputConfig));
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}

function getCariStatementPreviewSnapshot() {
  return getSelectedCariStatementSnapshot() || buildFallbackCariStatementSnapshot();
}

function buildFallbackCariStatementSnapshot() {
  const sampleCari = (cache.cari || [])[0];
  if (sampleCari) {
    const movements = (cache.movements || []).filter((item) => item.cariId === sampleCari.id);
    const orders = cache.orders || [];
    return {
      cari: sampleCari,
      movements,
      orderTotal: calcCariOrderTotal(sampleCari.id, orders),
      creditTotal: movements.filter((item) => isCreditMovement(item.movementType)).reduce((sum, item) => sum + Number(item.amount || 0), 0),
      debtTotal: movements.filter((item) => !isCreditMovement(item.movementType)).reduce((sum, item) => sum + Number(item.amount || 0), 0),
      balance: calcCariBalance(sampleCari.id, cache.movements || [], orders),
    };
  }
  return {
    cari: {
      companyName: "Ornek Cari Ltd.",
      fullName: "Yetkili Kisi",
      phone: "0555 000 00 00",
      type: "Musteri",
      discountRate: 0,
      notes: "Burada ornek notlar gorunur.",
    },
    movements: [
      { id: 1, date: new Date().toISOString().slice(0, 10), movementType: "Alacak Dekontu", amount: 12500, note: "Pesin odeme" },
      { id: 2, date: new Date().toISOString().slice(0, 10), movementType: "Borc Dekontu", amount: 3200, note: "Sevkiyat farki" },
    ],
    orderTotal: 18500,
    creditTotal: 12500,
    debtTotal: 3200,
    balance: 6000,
  };
}

function refreshCariStatementPreview() {
  if (!cariStatementPreviewFrame || !cariStatementOutputForm) return;
  const snapshot = getCariStatementPreviewSnapshot();
  const outputConfig = formToObject(cariStatementOutputForm);
  cariStatementPreviewFrame.srcdoc = buildCariStatementPrintHtml(snapshot, outputConfig);
}

function formatStatementTimestamp(date = new Date()) {
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).replace(",", "");
}

function inferStatementDateRange(movements = []) {
  if (!movements.length) return formatDate(new Date().toISOString().slice(0, 10));
  const sorted = [...movements].sort((left, right) => new Date(left.date || 0) - new Date(right.date || 0) || (left.id || 0) - (right.id || 0));
  return `${formatDate(sorted[0].date)} - ${formatDate(sorted[sorted.length - 1].date)}`;
}

function buildStatementMovementRows(movements = [], openingBalance = 0) {
  const sorted = [...movements].sort((left, right) => new Date(left.date || 0) - new Date(right.date || 0) || (left.id || 0) - (right.id || 0));
  let runningBalance = Number(openingBalance || 0);
  return sorted.map((item) => {
    const amount = Number(item.amount || 0);
    const isCredit = isCreditMovement(item.movementType);
    runningBalance += isCredit ? -amount : amount;
    return {
      date: formatDate(item.date),
      movementType: item.movementType || "-",
      movementNo: item.receiptNo || item.documentNo || `CD${String(item.id || "").padStart(5, "0")}`,
      description: item.note || "-",
      debt: isCredit ? 0 : amount,
      credit: isCredit ? amount : 0,
      balance: runningBalance,
    };
  });
}

function buildCariStatementPrintHtml(snapshot, outputConfig = {}) {
  const { cari, movements, orderTotal, creditTotal, debtTotal, balance } = snapshot;
  const noteText = String(outputConfig.extraNote || "").trim() || (cari.notes || "").trim() || "";
  const documentTitle = String(outputConfig.documentTitle || "").trim() || "CARI HESAP EKSTRESI";
  const introText = String(outputConfig.introText || "").trim();
  const companyDisplayName = String(outputConfig.companyDisplayName || "").trim() || "SILVA AHSAP";
  const companyCode = String(outputConfig.companyCode || "").trim() || `CR${String(cari.id || "").padStart(5, "0")}`;
  const statementStatusLabel = String(outputConfig.statementStatusLabel || "").trim() || (balance >= 0 ? "BORCLU" : "ALACAKLI");
  const logoUrl = String(outputConfig.logoDataUrl || "").trim() || String(outputConfig.logoUrl || "").trim();
  const taxOffice = String(outputConfig.taxOffice || "").trim() || "-";
  const taxNumber = String(outputConfig.taxNumber || "").trim() || "-";
  const signatureName = String(outputConfig.signatureName || "").trim();
  const signatureTitle = String(outputConfig.signatureTitle || "").trim();
  const currencyCode = String(outputConfig.currencyCode || "").trim() || "TRY";
  const dateRangeText = String(outputConfig.dateRangeText || "").trim() || inferStatementDateRange(movements);
  const footerText = String(outputConfig.footerText || "").trim() || companyDisplayName;
  const footerContact = String(outputConfig.footerContact || "").trim() || "silvaahsap@gmail.com";
  const pageNumberText = String(outputConfig.pageNumberText || "").trim() || "1 / 1";
  const pageSize = String(outputConfig.pageSize || "A4").trim() || "A4";
  const pageOrientation = String(outputConfig.pageOrientation || "portrait").trim() || "portrait";
  const pageMarginMm = Math.max(5, Math.min(30, Number(outputConfig.pageMarginMm || 14) || 14));
  const fontFamily = String(outputConfig.fontFamily || "Arial, sans-serif").trim() || "Arial, sans-serif";
  const baseFontSize = Math.max(8, Math.min(16, Number(outputConfig.baseFontSize || 10) || 10));
  const titleFontSize = Math.max(16, Math.min(34, Number(outputConfig.titleFontSize || 22) || 22));
  const metaFontSize = Math.max(10, Math.min(18, Number(outputConfig.metaFontSize || 12) || 12));
  const accentColor = String(outputConfig.accentColor || "#1f2937").trim() || "#1f2937";
  const headerBgColor = String(outputConfig.headerBgColor || "#f3f4f6").trim() || "#f3f4f6";
  const headerTextColor = String(outputConfig.headerTextColor || "#374151").trim() || "#374151";
  const cardBgColor = String(outputConfig.cardBgColor || "#ffffff").trim() || "#ffffff";
  const borderColor = String(outputConfig.borderColor || "#cfd6df").trim() || "#cfd6df";
  const tableStyle = String(outputConfig.tableStyle || "classic").trim() || "classic";
  const tableDensity = String(outputConfig.tableDensity || "compact").trim() || "compact";
  const customCss = String(outputConfig.customCss || "");
  const logoMarkup = logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="Firma Logosu" class="logo">` : "";
  const densityMap = {
    compact: { cellPadY: 4, cellPadX: 6 },
    comfortable: { cellPadY: 6, cellPadX: 8 },
    spacious: { cellPadY: 8, cellPadX: 10 },
  };
  const tablePaletteMap = {
    classic: { bodyBg: "#ffffff", stripeBg: "#fafafa" },
    clean: { bodyBg: "#ffffff", stripeBg: "#ffffff" },
    soft: { bodyBg: "#fffef8", stripeBg: "#fdfcf7" },
  };
  const density = densityMap[tableDensity] || densityMap.compact;
  const palette = tablePaletteMap[tableStyle] || tablePaletteMap.classic;
  const statementRows = buildStatementMovementRows(movements, Number(orderTotal || 0));
  const rowsMarkup = statementRows.length ? statementRows.map((item, index) => `
    <tr class="${index % 2 === 1 ? "is-striped" : ""}">
      <td>${escapeHtml(item.date)}</td>
      <td>${escapeHtml(item.movementType)}</td>
      <td>${escapeHtml(item.movementNo)}</td>
      <td>${escapeHtml(item.description)}</td>
      <td class="amount">${item.debt ? escapeHtml(formatCurrency(item.debt)) : "0,00"}</td>
      <td class="amount">${item.credit ? escapeHtml(formatCurrency(item.credit)) : "0,00"}</td>
      <td class="amount">${escapeHtml(formatCurrency(item.balance))}</td>
    </tr>
  `).join("") : `
    <tr>
      <td colspan="7" class="empty">Bu cariye ait muhasebe kaydi bulunamadi.</td>
    </tr>
  `;
  const timestampText = formatStatementTimestamp(new Date());
  const totalDebt = Number(orderTotal || 0) + Number(debtTotal || 0);
  const totalCredit = Number(creditTotal || 0);
  const introMarkup = introText ? `<div class="intro">${escapeHtml(introText)}</div>` : "";
  const noteMarkup = noteText ? `<div class="note-block"><strong>Not :</strong> ${escapeHtml(noteText)}</div>` : "";
  const signatureMarkup = signatureName || signatureTitle ? `
    <div class="signature-block">
      <div class="signature-line"></div>
      <strong>${escapeHtml(signatureName || "-")}</strong>
      <span>${escapeHtml(signatureTitle || "")}</span>
    </div>
  ` : "";
  return `
    <!doctype html>
    <html lang="tr">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(cari.companyName || cari.fullName || "Cari")} - ${escapeHtml(documentTitle)}</title>
        <style>
          @page { size: ${escapeHtml(pageSize)} ${escapeHtml(pageOrientation)}; margin: ${pageMarginMm}mm; }
          * { box-sizing: border-box; }
          body { font-family: ${escapeHtml(fontFamily)}; color: #111827; margin: 0; font-size: ${baseFontSize}px; background: #fff; }
          .sheet { min-height: 100vh; padding: 2mm 0 6mm; position: relative; }
          .topline { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
          .company-block { display: flex; gap: 10px; align-items: flex-start; }
          .company-name { font-size: ${metaFontSize + 1}px; font-weight: 700; letter-spacing: 0.02em; color: ${accentColor}; }
          .logo { width: 36px; height: 36px; object-fit: contain; }
          .timestamp { font-size: ${Math.max(9, metaFontSize - 1)}px; color: #4b5563; white-space: nowrap; }
          .headline { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; margin-bottom: 6px; }
          .headline h1 { margin: 0; margin-left: auto; font-size: ${titleFontSize}px; color: ${accentColor}; font-weight: 700; letter-spacing: 0.01em; }
          .status { min-width: 150px; text-align: right; font-size: ${metaFontSize}px; font-weight: 700; }
          .status span { font-weight: 400; margin-right: 5px; }
          .divider { border-top: 1px solid ${borderColor}; margin: 8px 0 10px; }
          .meta-grid { display: grid; gap: 4px; margin-bottom: 12px; }
          .meta-row { display: grid; grid-template-columns: 94px 12px minmax(0, 1fr) 94px 12px minmax(0, 1fr); gap: 0; align-items: start; }
          .meta-label { font-weight: 700; color: #374151; }
          .meta-sep { text-align: center; }
          .meta-value { color: #111827; }
          .intro { margin: 0 0 10px; color: #4b5563; font-size: ${metaFontSize}px; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          col.date { width: 78px; }
          col.type { width: 108px; }
          col.no { width: 94px; }
          col.desc { width: auto; }
          col.money { width: 78px; }
          th, td { border: 1px solid ${borderColor}; padding: ${density.cellPadY}px ${density.cellPadX}px; font-size: ${baseFontSize}px; text-align: left; vertical-align: top; }
          th { background: ${headerBgColor}; color: ${headerTextColor}; font-size: ${Math.max(9, baseFontSize - 0.3)}px; font-weight: 700; }
          tbody tr { background: ${palette.bodyBg}; }
          tbody tr.is-striped { background: ${palette.stripeBg}; }
          td.amount, th.amount { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
          .empty { text-align: center; color: #6b7280; padding: 14px 8px; }
          .summary-line { display: flex; justify-content: space-between; gap: 14px; margin-top: 10px; font-size: ${metaFontSize}px; }
          .summary-line strong { font-weight: 700; }
          .totals { display: flex; justify-content: flex-end; gap: 18px; margin-top: 8px; font-size: ${metaFontSize}px; }
          .totals strong { font-weight: 700; }
          .note-block { margin-top: 12px; font-size: ${metaFontSize}px; color: #374151; white-space: pre-wrap; }
          .signature-wrap { display: flex; justify-content: flex-end; margin-top: 28px; }
          .signature-block { min-width: 180px; text-align: center; }
          .signature-line { border-top: 1px solid #9ca3af; margin-bottom: 6px; }
          .signature-block strong, .signature-block span { display: block; }
          .footer { position: absolute; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; font-size: ${Math.max(8, metaFontSize - 1)}px; color: #4b5563; }
          .footer-center { text-align: center; }
          .footer-page { text-align: right; }
          ${customCss}
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="topline">
            <div class="company-block">
              ${logoMarkup}
              <div class="company-name">${escapeHtml(companyDisplayName)}</div>
            </div>
            <div class="timestamp">${escapeHtml(timestampText)}</div>
          </div>
          <div class="headline">
            <div></div>
            <h1>${escapeHtml(documentTitle)}</h1>
            <div class="status"><span>DURUMU :</span> ${escapeHtml(statementStatusLabel)}</div>
          </div>
          <div class="divider"></div>
          <div class="meta-grid">
            <div class="meta-row">
              <div class="meta-label">Firma Kodu</div>
              <div class="meta-sep">:</div>
              <div class="meta-value">${escapeHtml(companyCode)}</div>
              <div class="meta-label">Vergi Dairesi</div>
              <div class="meta-sep">:</div>
              <div class="meta-value">${escapeHtml(taxOffice)}</div>
            </div>
            <div class="meta-row">
              <div class="meta-label">Cari Unvan</div>
              <div class="meta-sep">:</div>
              <div class="meta-value">${escapeHtml(cari.companyName || cari.fullName || "-")}</div>
              <div class="meta-label">Vergi Numarasi</div>
              <div class="meta-sep">:</div>
              <div class="meta-value">${escapeHtml(taxNumber)}</div>
            </div>
            <div class="meta-row">
              <div class="meta-label">Para Birimi</div>
              <div class="meta-sep">:</div>
              <div class="meta-value">${escapeHtml(currencyCode)}</div>
              <div class="meta-label">Iskonto</div>
              <div class="meta-sep">:</div>
              <div class="meta-value">%${escapeHtml(String(Number(cari.discountRate || 0)))}</div>
            </div>
            <div class="meta-row">
              <div class="meta-label">Tarihler</div>
              <div class="meta-sep">:</div>
              <div class="meta-value">${escapeHtml(dateRangeText)}</div>
              <div class="meta-label">Yetkili</div>
              <div class="meta-sep">:</div>
              <div class="meta-value">${escapeHtml(cari.fullName || "-")}</div>
            </div>
          </div>
          ${introMarkup}
          <table>
            <colgroup>
              <col class="date">
              <col class="type">
              <col class="no">
              <col class="desc">
              <col class="money">
              <col class="money">
              <col class="money">
            </colgroup>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Islem Turu</th>
                <th>Islem No</th>
                <th>Aciklama</th>
                <th class="amount">Borc</th>
                <th class="amount">Alacak</th>
                <th class="amount">Bakiye</th>
              </tr>
            </thead>
            <tbody>${rowsMarkup}</tbody>
          </table>
          <div class="summary-line">
            <div><strong>Kayit Sayisi :</strong> ${statementRows.length}</div>
            <div><strong>Genel Bakiye :</strong> ${escapeHtml(formatCurrency(balance))}</div>
          </div>
          <div class="totals">
            <div><strong>Borc :</strong> ${escapeHtml(formatCurrency(totalDebt))}</div>
            <div><strong>Alacak :</strong> ${escapeHtml(formatCurrency(totalCredit))}</div>
            <div><strong>Bakiye :</strong> ${escapeHtml(formatCurrency(balance))}</div>
          </div>
          ${noteMarkup}
          <div class="signature-wrap">
            ${signatureMarkup}
          </div>
          <div class="footer">
            <div></div>
            <div class="footer-center">
              <div>${escapeHtml(footerText)}</div>
              <div>${escapeHtml(footerContact)}</div>
            </div>
            <div class="footer-page">${escapeHtml(pageNumberText)}</div>
          </div>
        </div>
      </body>
    </html>
  `;
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

function getStoredProductCategories() {
  try {
    return JSON.parse(window.localStorage.getItem(PRODUCT_CATEGORY_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveStoredProductCategories(categories) {
  window.localStorage.setItem(PRODUCT_CATEGORY_STORAGE_KEY, JSON.stringify([...new Set((categories || []).filter(Boolean))]));
}

function collectProductCategories(records) {
  return [...new Set([
    ...getStoredProductCategories(),
    ...(records || []).map((item) => item.category).filter(Boolean),
  ])].sort((left, right) => left.localeCompare(right, "tr"));
}

function syncProductCategorySelect(records, selectedValue = "") {
  if (!productCategorySelect) return;
  const categories = collectProductCategories(records);
  productCategorySelect.innerHTML = [
    `<option value="">Kategori Secin</option>`,
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`),
  ].join("");
  if (selectedValue && categories.includes(selectedValue)) {
    productCategorySelect.value = selectedValue;
  }
}

function getProductTypesByCategory(records, category) {
  if (!category) return [];
  return [...new Set((records || [])
    .filter((item) => item.category === category)
    .map((item) => item.type || item.name)
    .filter(Boolean))]
    .sort((left, right) => left.localeCompare(right, "tr"));
}

function syncProductTypeSelect(records, selectedCategory = "", selectedType = "") {
  if (!productTypeSelect) return;
  const category = selectedCategory || productCategorySelect?.value || "";
  const types = getProductTypesByCategory(records, category);
  const hasTypes = types.length > 0;
  productTypeSelect.innerHTML = [
    `<option value="">${hasTypes ? "Urun Cinsi Secin" : "Bu kategori icin urun cinsi yok"}</option>`,
    ...types.map((typeName) => `<option value="${escapeHtml(typeName)}">${escapeHtml(typeName)}</option>`),
  ].join("");
  productTypeSelect.disabled = !hasTypes;
  if (selectedType && types.includes(selectedType)) {
    productTypeSelect.value = selectedType;
  }
}

function renderProductCategories(records) {
  const categories = collectProductCategories(records);
  const selectedValue = productCategorySelect?.value || "";
  if (!selectedCategoryManager || !categories.includes(selectedCategoryManager)) {
    selectedCategoryManager = categories[0] || "";
  }
  syncProductCategorySelect(records, selectedValue);
  syncProductTypeSelect(records, productCategorySelect?.value || "", productTypeSelect?.value || "");
  const productsMarkup = categories.length ? categories.map((category) => `
    <article class="product-category-item ${category === selectedValue ? "active" : ""}">
      <button class="product-category-pick" type="button" data-category-pick="${escapeHtml(category)}">
        <strong>${escapeHtml(category)}</strong>
        <span>Form secimi</span>
      </button>
      <div class="product-category-actions">
        <button class="ghost-action compact-action" type="button" data-category-edit="${escapeHtml(category)}">Duzenle</button>
        <button class="ghost-action compact-action danger-action" type="button" data-category-delete="${escapeHtml(category)}">Sil</button>
      </div>
    </article>
  `).join("") : `<div class="entity-card empty-state">Henuz kategori eklenmedi.</div>`;
  const managerMarkup = categories.length ? categories.map((category) => `
    <article class="product-category-item ${category === selectedCategoryManager ? "active" : ""}">
      <button class="product-category-pick" type="button" data-category-pick="${escapeHtml(category)}">
        <strong>${escapeHtml(category)}</strong>
        <span>${(records || []).filter((item) => item.category === category).length} cins</span>
      </button>
      <div class="product-category-actions">
        <button class="ghost-action compact-action" type="button" data-category-edit="${escapeHtml(category)}">Duzenle</button>
        <button class="ghost-action compact-action danger-action" type="button" data-category-delete="${escapeHtml(category)}">Sil</button>
      </div>
    </article>
  `).join("") : `<div class="entity-card empty-state">Henuz kategori eklenmedi.</div>`;
  if (productCategoryList) {
    productCategoryList.innerHTML = productsMarkup;
  }
  if (categoryManagerList) {
    categoryManagerList.innerHTML = managerMarkup;
  }
}

function resetCategoryTypeForm() {
  categoryTypeForm?.reset();
  if (categoryTypeEditId) categoryTypeEditId.value = "";
  if (categoryTypeUnit) categoryTypeUnit.value = "M2";
  if (categoryTypeSubmitBtn) categoryTypeSubmitBtn.textContent = "Cinsi Kaydet";
  categoryTypeSubmitBtn?.classList.remove("is-active");
  categoryTypeResetBtn?.classList.remove("is-active");
}

function fillCategoryTypeForm(product) {
  if (!product) return;
  selectedCategoryManager = product.category || selectedCategoryManager;
  if (categoryTypeEditId) categoryTypeEditId.value = String(product.id || "");
  if (categoryTypeInput) categoryTypeInput.value = product.name || "";
  if (categoryTypeUnit) categoryTypeUnit.value = product.unit || "M2";
  if (categoryTypeSubmitBtn) categoryTypeSubmitBtn.textContent = "Cinsi Guncelle";
  categoryTypeSubmitBtn?.classList.add("is-active");
  categoryTypeResetBtn?.classList.add("is-active");
  renderProductCategories(cache.products || []);
  renderCategoryTypeManager(cache.products || []);
  categoryTypeInput?.focus();
}

function renderCategoryTypeManager(records) {
  const categories = collectProductCategories(records);
  if (!selectedCategoryManager || !categories.includes(selectedCategoryManager)) {
    selectedCategoryManager = categories[0] || "";
  }
  if (categoryTypeSelectedName) {
    categoryTypeSelectedName.textContent = selectedCategoryManager || "Kategori secilmedi";
  }
  if (categoryTypeSelectedMeta) {
    categoryTypeSelectedMeta.textContent = selectedCategoryManager
      ? `"${selectedCategoryManager}" kategorisine bagli urun cinsleri`
      : "Urun cinsi eklemek icin once soldan bir kategori secin.";
  }
  if (categoryTypeInput) {
    categoryTypeInput.disabled = !selectedCategoryManager;
  }
  if (categoryTypeSubmitBtn) {
    categoryTypeSubmitBtn.disabled = !selectedCategoryManager;
  }
  if (!categoryTypeList) return;
  if (!selectedCategoryManager) {
    categoryTypeList.innerHTML = `<div class="entity-card empty-state">Once bir kategori secin.</div>`;
    return;
  }
  const items = (records || []).filter((item) => item.category === selectedCategoryManager);
  categoryTypeList.innerHTML = items.length ? items.map((item) => `
    <article class="category-type-item">
      <div class="category-type-content">
        <strong>${escapeHtml(item.name || "-")}</strong>
        <span>${escapeHtml(item.unit || item.costType || "M2")}</span>
      </div>
      <div class="product-category-actions">
        <button class="ghost-action compact-action" type="button" data-category-type-edit="${item.id}">Duzenle</button>
        <button class="ghost-action compact-action danger-action" type="button" data-category-type-delete="${item.id}">Sil</button>
      </div>
    </article>
  `).join("") : `<div class="entity-card empty-state">Bu kategori icin henuz urun cinsi eklenmedi.</div>`;
}

function renderProductCategoryFilter(records) {
  if (!productFilterList) return;
  const categories = collectProductCategories(records);
  const coverCount = (records || []).filter((item) => isCoverCategory(item.category, item.name)).length;
  if (selectedProductCategoryFilter === "__covers__" && coverCount === 0) {
    selectedProductCategoryFilter = "";
  }
  if (selectedProductCategoryFilter && selectedProductCategoryFilter !== "__covers__" && !categories.includes(selectedProductCategoryFilter)) {
    if (selectedProductCategoryFilter !== "__covers__") {
      selectedProductCategoryFilter = "__covers__";
    }
  }
  const items = [
    {
      value: "__covers__",
      label: "Kapak Kategorileri",
      count: (records || []).filter((item) => isCoverCategory(item.category, item.name)).length,
    },
    {
      value: "",
      label: "Tum Kategoriler",
      count: (records || []).length,
    },
    ...categories.map((category) => ({
      value: category,
      label: category,
      count: (records || []).filter((item) => item.category === category).length,
    })),
  ];
  productFilterList.innerHTML = items.length ? items.map((item) => `
    <button class="product-filter-item ${item.value === selectedProductCategoryFilter ? "active" : ""}" type="button" data-product-filter="${escapeHtml(item.value)}">
      <strong>${escapeHtml(item.label)}</strong>
      <span>${item.count} urun</span>
    </button>
  `).join("") : `<div class="entity-card empty-state">Gosterilecek kategori bulunamadi.</div>`;
  syncBulkCategorySelect(records);
}

function matchesSelectedProductCategory(item) {
  return !selectedProductCategoryFilter || item.category === selectedProductCategoryFilter;
}

function getProductTypesForSelectedCategory(records) {
  const scoped = (records || []).filter((item) => matchesSelectedProductCategory(item));
  return [...new Set(scoped.map((item) => item.name).filter(Boolean))].sort((left, right) => left.localeCompare(right, "tr"));
}

function renderProductTypeFilter(records) {
  if (!productTypeFilterList) return;
  const scoped = (records || []).filter((item) => matchesSelectedProductCategory(item));
  const types = getProductTypesForSelectedCategory(records);
  if (selectedProductTypeFilter && !types.includes(selectedProductTypeFilter)) {
    selectedProductTypeFilter = "";
  }
  const items = [
    {
      value: "",
      label: "Tum Urun Cinsleri",
      count: scoped.length,
    },
    ...types.map((typeName) => ({
      value: typeName,
      label: typeName,
      count: scoped.filter((item) => item.name === typeName).length,
    })),
  ];
  productTypeFilterList.innerHTML = items.length ? items.map((item) => `
    <button class="product-filter-item product-type-item ${item.value === selectedProductTypeFilter ? "active" : ""}" type="button" data-product-type-filter="${escapeHtml(item.value)}">
      <strong>${escapeHtml(item.label)}</strong>
      <span>${item.count} kayit</span>
    </button>
  `).join("") : `<div class="entity-card empty-state">Urun cinsi bulunamadi.</div>`;
}

function renderProductHierarchyTree(records) {
  if (!productsHierarchyTree) return;
  const categories = collectProductCategories(records);
  if (selectedProductCategoryFilter && !categories.includes(selectedProductCategoryFilter)) {
    selectedProductCategoryFilter = "";
  }
  if (selectedExpandedProductCategory && !categories.includes(selectedExpandedProductCategory)) {
    selectedExpandedProductCategory = "";
  }
  if (!selectedExpandedProductCategory) {
    selectedExpandedProductCategory = selectedProductCategoryFilter || categories[0] || "";
  }

  productsHierarchyTree.innerHTML = categories.length ? categories.map((category) => {
    const items = (records || []).filter((item) => item.category === category);
    const types = [...new Set(items.map((item) => item.name).filter(Boolean))].sort((left, right) => left.localeCompare(right, "tr"));
    const isExpanded = selectedExpandedProductCategory === category;
    const isActiveCategory = selectedProductCategoryFilter === category && !selectedProductTypeFilter;
    return `
      <article class="products-tree-group ${isExpanded ? "expanded" : ""}">
        <div class="products-tree-category ${isActiveCategory ? "active" : ""}">
          <button class="products-tree-main" type="button" data-hierarchy-category="${escapeHtml(category)}">
            <strong>${escapeHtml(category)}</strong>
            <span>${items.length} kayit</span>
          </button>
          <button class="products-tree-toggle" type="button" data-hierarchy-toggle="${escapeHtml(category)}">${isExpanded ? "−" : "+"}</button>
        </div>
        <div class="products-tree-children" ${isExpanded ? "" : "hidden"}>
          <button class="products-tree-child ${selectedProductCategoryFilter === category && !selectedProductTypeFilter ? "active" : ""}" type="button" data-hierarchy-category="${escapeHtml(category)}" data-hierarchy-product-type="">
            <strong>Tum Cinsler</strong>
            <span>${items.length} kayit</span>
          </button>
          ${types.map((typeName) => `
            <button class="products-tree-child ${selectedProductCategoryFilter === category && selectedProductTypeFilter === typeName ? "active" : ""}" type="button" data-hierarchy-category="${escapeHtml(category)}" data-hierarchy-product-type="${escapeHtml(typeName)}">
              <strong>${escapeHtml(typeName)}</strong>
              <span>${items.filter((item) => item.name === typeName).length} kayit</span>
            </button>
          `).join("")}
        </div>
      </article>
    `;
  }).join("") : `<div class="entity-card empty-state">Kategori bulunamadi.</div>`;
}

function getProductDisplayBasis(item) {
  if (item.costType) return item.costType;
  if (Number(item.m2Price || 0) > 0) return "M2";
  if (item.unit === "Boy Adet") return "Boy Adet";
  return item.unit || "Adet";
}

function getProductDisplayPrice(item) {
  return Number(
    item.costAmount
    || (getProductDisplayBasis(item) === "M2" ? item.m2Price : 0)
    || item.salePrice
    || item.purchasePrice
    || 0
  );
}

async function renameProductCategory(oldName, newName) {
  const records = cache.products || [];
  const updatedCategories = collectProductCategories(records).map((item) => (item === oldName ? newName : item));
  saveStoredProductCategories(updatedCategories);
  const affected = records.filter((item) => item.category === oldName);
  for (const product of affected) {
      await api.products.update(product.id, buildProductApiPayload({
        ...product,
        category: newName,
      }));
  }
  if (selectedProductCategoryFilter === oldName) selectedProductCategoryFilter = newName;
  if (productCategorySelect?.value === oldName) productCategorySelect.value = newName;
  await refreshUI();
}

async function deleteProductCategory(categoryName) {
  const records = cache.products || [];
  const filteredCategories = collectProductCategories(records).filter((item) => item !== categoryName);
  saveStoredProductCategories(filteredCategories);
  const affected = records.filter((item) => item.category === categoryName);
  for (const product of affected) {
      await api.products.update(product.id, buildProductApiPayload({
        ...product,
        category: "Kategorisiz",
      }));
  }
  if (selectedProductCategoryFilter === categoryName) selectedProductCategoryFilter = "";
  if (productCategorySelect?.value === categoryName) productCategorySelect.value = "Kategorisiz";
  await refreshUI();
}

function isCoverCategory(category, name = "") {
  const normalized = `${category || ""} ${name || ""}`.toLowerCase();
  return ["kapak", "panjur", "lake", "ham", "cam", "mdf"].some((token) => normalized.includes(token));
}

function resolveProductImageUrl(value = "") {
  if (!value) return "";
  return api.resolveAssetUrl ? api.resolveAssetUrl(value) : value;
}

function renderProductImagePreview(value = "") {
  if (!productImagePreview) return;
  if (value) {
    productImagePreview.innerHTML = `<img src="${escapeHtml(resolveProductImageUrl(value))}" alt="Urun gorseli onizleme">`;
    productImagePreview.classList.add("has-image");
    return;
  }
  productImagePreview.textContent = "Gorsel secildiginde burada gorunecek.";
  productImagePreview.classList.remove("has-image");
}

function openProductImageModal(value = "") {
  const imageUrl = resolveProductImageUrl(value);
  if (!productImageModal || !productImageModalImg || !imageUrl) return;
  productImageModalImg.src = imageUrl;
  productImageModal.hidden = false;
}

function closeProductImageModal() {
  if (!productImageModal || !productImageModalImg) return;
  productImageModal.hidden = true;
  productImageModalImg.src = "";
}

function syncBulkCategorySelect(records) {
  if (!productBulkCategory) return;
  const categories = collectProductCategories(records).filter(Boolean);
  productBulkCategory.innerHTML = [
    `<option value="">Kategori Secin</option>`,
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`),
  ].join("");
  if (selectedProductCategoryFilter && selectedProductCategoryFilter !== "__covers__" && categories.includes(selectedProductCategoryFilter)) {
    productBulkCategory.value = selectedProductCategoryFilter;
  }
}

function getSortedProducts(records) {
  const direction = productSortState.dir === "asc" ? 1 : -1;
  const key = productSortState.key;
  return [...records].sort((left, right) => {
    const leftValue = key === "name" || key === "category" || key === "costNotes" || key === "unit" || key === "costType"
      ? String(left[key] || "").toLocaleLowerCase("tr")
      : Number(left[key] || 0);
    const rightValue = key === "name" || key === "category" || key === "costNotes" || key === "unit" || key === "costType"
      ? String(right[key] || "").toLocaleLowerCase("tr")
      : Number(right[key] || 0);
    if (leftValue < rightValue) return -1 * direction;
    if (leftValue > rightValue) return 1 * direction;
    return 0;
  });
}

function getProductSortLabel(key) {
  return productSortState.key === key ? (productSortState.dir === "asc" ? "▲" : "▼") : "";
}

function exportProductsToCsv(records) {
  const rows = [
    ["Urun Cinsi", "Kategori", "Birim", "Fiyat Tipi", "Fiyat", "Not"],
    ...records.map((item) => [
      item.name || "",
      item.category || "",
      item.unit || "",
      getProductDisplayBasis(item),
      Number(getProductDisplayPrice(item)),
      item.costNotes || "",
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "urunler.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function resetProductFormEditor() {
  forms.product?.reset();
  if (productEditId) productEditId.value = "";
  if (productSubmitBtn) productSubmitBtn.textContent = "Urunu Kaydet";
  productSubmitBtn?.classList.remove("is-active");
  productResetBtn?.classList.remove("is-active");
  if (productCategorySelect) {
    syncProductCategorySelect(cache.products || []);
  }
  syncProductTypeSelect(cache.products || []);
  renderProductCategories(cache.products || []);
  if (productImageFile) productImageFile.value = "";
  renderProductImagePreview("");
  initializeMoneyInputs();
}

function fillProductForm(product) {
  if (!forms.product || !product) return;
  setActiveView("products");
  currentProductsSubview = "form";
  applyProductsSubview(currentProductsSubview);
  const nameInput = forms.product.querySelector("[name='name']");
  const costTypeInput = forms.product.querySelector("[name='costType']");
  const costAmountInput = forms.product.querySelector("[name='costAmount']");
  const imageInput = forms.product.querySelector("[name='imageUrl']");
  const notesInput = forms.product.querySelector("[name='costNotes']");
  if (nameInput) nameInput.value = product.name || "";
  if (productCategorySelect) {
    syncProductCategorySelect(cache.products || [], product.category || "");
  }
  syncProductTypeSelect(cache.products || [], product.category || "", product.type || product.name || "");
  renderProductCategories(cache.products || []);
  if (costTypeInput) costTypeInput.value = getProductDisplayBasis(product);
  if (costAmountInput) costAmountInput.value = formatMoneyInputValue(getProductDisplayPrice(product));
  if (imageInput) imageInput.value = product.imageUrl || "";
  if (notesInput) notesInput.value = product.costNotes || "";
  if (productEditId) productEditId.value = String(product.id);
  if (productSubmitBtn) productSubmitBtn.textContent = "Urunu Guncelle";
  productSubmitBtn?.classList.add("is-active");
  productResetBtn?.classList.add("is-active");
  if (productImageFile) productImageFile.value = "";
  renderProductImagePreview(product.imageUrl || "");
  forms.product.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderProducts(records) {
  const target = document.getElementById("productsList");
  if (!target) return;
  const searchTerm = productsSearch?.value?.trim().toLowerCase() || "";
  renderProductCategories(records || []);
  renderProductHierarchyTree(records || []);
  const filtered = (records || []).filter((item) => {
    const haystack = [item.name, item.category, item.costNotes].join(" ").toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    const matchesCategory = matchesSelectedProductCategory(item);
    const matchesType = !selectedProductTypeFilter || item.name === selectedProductTypeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });
  const sorted = getSortedProducts(filtered);
  const scopedForCategory = (records || []).filter((item) => matchesSelectedProductCategory(item));
  const categoryLabel = selectedProductCategoryFilter || "Tum Kategoriler";
  const typeCount = getProductTypesForSelectedCategory(records || []).length;
  if (productsSelectionSummary) {
    productsSelectionSummary.innerHTML = `
      <article class="products-summary-card">
        <span>Kategori</span>
        <strong>${escapeHtml(categoryLabel)}</strong>
        <small>${scopedForCategory.length} kayit</small>
      </article>
      <article class="products-summary-card">
        <span>Urun Cinsi</span>
        <strong>${escapeHtml(selectedProductTypeFilter || "Tum Cinsler")}</strong>
        <small>${typeCount} farkli cins</small>
      </article>
      <article class="products-summary-card">
        <span>Liste</span>
        <strong>${sorted.length}</strong>
        <small>gosterilen satir</small>
      </article>
    `;
  }
  target.innerHTML = sorted.length ? `
    <div class="products-grid-toolbar">
      <span class="products-grid-order">Varsayilan siralama: A'dan Z'ye</span>
      <button class="ghost-action compact-action" type="button" id="productsExportBtn">Excel'e Aktar</button>
    </div>
    <div class="products-table products-table-compact">
      <div class="products-table-head products-table-head-simple">
        <span>Urun Cinsi</span>
        <span>Grubu</span>
        <span>Birim</span>
        <span>Fiyat</span>
        <span>Islem</span>
      </div>
      ${sorted.map((item) => `
        <div class="products-table-row products-table-row-simple ${productEditId?.value === String(item.id) ? "is-active" : ""}" data-product-edit="${item.id}">
          <span class="products-cell"><strong>${escapeHtml(item.name)}</strong></span>
          <span class="products-cell">${escapeHtml(item.category || "-")}</span>
          <span class="products-cell">${escapeHtml(item.unit || "-")}</span>
          <span class="products-cell cell-price">${formatCurrency(getProductDisplayPrice(item))}</span>
          <span class="products-cell cell-actions">
            <button class="ghost-action compact-action" type="button">Duzenle</button>
            <button class="ghost-action delete-btn compact-action" data-store="${STORES.products}" data-id="${item.id}">Sil</button>
          </span>
        </div>
      `).join("")}
    </div>
  ` : `<div class="entity-card empty-state">Urun kaydi bulunamadi.</div>`;
  document.getElementById("productsExportBtn")?.addEventListener("click", () => exportProductsToCsv(sorted), { once: true });
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
  const target = document.getElementById("financeList");
  if (!target) return;
  const totalCost = finance.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalSales = orders.reduce((sum, item) => sum + Number(item.netTotal || 0), 0) || products.reduce((sum, item) => sum + Number(item.salePrice || 0), 0);
  const estimatedProfit = totalSales - totalCost;
  const generalExpenses = finance.filter((item) => item.type === "Dukkan" || item.type === "Showroom").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalCollection = (cache.movements || []).filter((item) => isCreditMovement(item.movementType)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalPayment = (cache.movements || []).filter((item) => !isCreditMovement(item.movementType)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const metricTotalCost = document.getElementById("metricTotalCost");
  const metricTotalSales = document.getElementById("metricTotalSales");
  const metricEstimatedProfit = document.getElementById("metricEstimatedProfit");
  const metricGeneralExpenses = document.getElementById("metricGeneralExpenses");
  const metricTotalCollection = document.getElementById("metricTotalCollection");
  const metricTotalPayment = document.getElementById("metricTotalPayment");
  if (metricTotalCost) metricTotalCost.textContent = formatCurrency(totalCost);
  if (metricTotalSales) metricTotalSales.textContent = formatCurrency(totalSales);
  if (metricEstimatedProfit) metricEstimatedProfit.textContent = formatCurrency(estimatedProfit);
  if (metricGeneralExpenses) metricGeneralExpenses.textContent = formatCurrency(generalExpenses);
  if (metricTotalCollection) metricTotalCollection.textContent = formatCurrency(totalCollection);
  if (metricTotalPayment) metricTotalPayment.textContent = formatCurrency(totalPayment);

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
    notes: row.notes || "",
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
    type: row.type || row.name,
    category: row.category,
    purchasePrice: Number(row.purchase_price || 0),
    salePrice: Number(row.sale_price || 0),
    m2Price: Number(row.m2_price || 0),
    rawM2Price: Number(row.raw_m2_price || 0),
    paintedM2Price: Number(row.painted_m2_price || 0),
    costType: row.cost_type || (Number(row.m2_price || 0) > 0 ? "M2" : (row.unit || "Adet")),
    costAmount: Number(row.cost_amount || row.m2_price || row.sale_price || 0),
    unit: row.unit || "M2",
    imageUrl: row.image_url || "",
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
      movementType: normalizeMovementLabel(row.movement_type),
      amount: Number(row.amount || 0),
      date: row.movement_date,
      note: row.note,
      createdAt: row.created_at,
    }));
  }

function normalizeMovementLabel(type) {
    if (type === "Tahsilat") return "Alacak Dekontu";
    if (type === "Borc" || type === "Odeme") return "Borc Dekontu";
    return type;
  }

function calcCariBalance(cariId, movements, orders) {
  const orderTotal = calcCariOrderTotal(cariId, orders);
  const movementDelta = (movements || []).filter((item) => item.cariId === cariId).reduce((sum, item) => {
    if (isCreditMovement(item.movementType)) return sum - Number(item.amount || 0);
    return sum + Number(item.amount || 0);
  }, 0);
  return orderTotal + movementDelta;
}

function calcCariMovementTotals(cariId, movements) {
  return (movements || [])
    .filter((item) => item.cariId === cariId)
    .reduce((totals, item) => {
      if (isCreditMovement(item.movementType)) {
        totals.credit += Number(item.amount || 0);
      } else {
        totals.debt += Number(item.amount || 0);
      }
      return totals;
    }, { debt: 0, credit: 0 });
}

function isCreditMovement(type) {
  return type === "Alacak Dekontu" || type === "Tahsilat";
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

function formatCompactCurrency(value) {
    return `${Number(value || 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL`;
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? escapeHtml(String(value)) : date.toLocaleDateString("tr-TR");
  }

function shortenText(value, limit = 20) {
    const text = String(value || "");
    if (text.length <= limit) return text;
    return `${text.slice(0, Math.max(0, limit - 3))}...`;
  }

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
