const {
  CRM_STATUSES,
  OFFER_STATUSES,
  ORDER_CONVERTIBLE_OFFER_STATUSES,
  ORDER_STATUSES,
  PRODUCT_CALCULATION_LABELS,
  PRODUCT_CALCULATION_TYPES,
  STORES,
  viewMeta,
} = window.erpConstants;
const {
  escapeHtml,
  formToObject,
  formatCompactCurrency,
  formatCurrency,
  formatCurrencyByCode,
  formatDate,
  formatDateTime,
  parseDecimalInput,
  parseMoneyInput,
  shortenText,
} = window.erpHelpers;
const api = window.silvaApi;
const runtime = window.erpRuntime || {
  sortRecordsByCreatedAt(records) {
    return Array.isArray(records) ? [...records] : [];
  },
  async loadStoreEntries(entries, loader) {
    const settledEntries = await Promise.all(entries.map(async ([key, storeName]) => [key, await loader(storeName)]));
    return Object.fromEntries(settledEntries);
  },
  runRenderQueue(steps) {
    steps.forEach(([, render]) => render());
  },
  registerGlobalDiagnostics() {},
};
const appState = window.erpState.createAppState();

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const navLinks = [...document.querySelectorAll(".nav-link")];
const navGroupToggles = [...document.querySelectorAll("[data-nav-group]")];
const navSubgroupToggles = [...document.querySelectorAll("[data-nav-subgroup]")];
const views = [...document.querySelectorAll(".view")];
const quickLinks = [...document.querySelectorAll("[data-action], [data-view-link]")];
const primaryActionBtn = document.getElementById("primaryActionBtn");
const pageTitle = document.getElementById("pageTitle");
const pageDescription = document.getElementById("pageDescription");
const resetDemoBtn = document.getElementById("resetDemoBtn");
const orderSearch = document.getElementById("orderSearch");
const crmSearch = document.getElementById("crmSearch");
const crmKpiGrid = document.getElementById("crmKpiGrid");
const crmLeadForm = document.getElementById("crmLeadForm");
const crmLeadEditId = document.getElementById("crmLeadEditId");
const crmStatusSelect = document.getElementById("crmStatusSelect");
const crmLeadResetBtn = document.getElementById("crmLeadResetBtn");
const crmLeadsTable = document.getElementById("crmLeadsTable");
const crmDetailPanel = document.getElementById("crmDetailPanel");
const crmFlowPanel = document.getElementById("crmFlowPanel");
const crmLegendPanel = document.getElementById("crmLegendPanel");
const crmDashboardPanel = document.getElementById("crmDashboardPanel");
const crmExportBtn = document.getElementById("crmExportBtn");
const quickOrderSection = document.getElementById("quickOrderSection");
const quickOrderForm = document.getElementById("quickOrderForm");
const quickOrderCari = document.getElementById("quickOrderCari");
const quickOrderItemName = document.getElementById("quickOrderItemName");
const quickOrderItemWidth = document.getElementById("quickOrderItemWidth");
const quickOrderItemHeight = document.getElementById("quickOrderItemHeight");
const quickOrderItemLength = document.getElementById("quickOrderItemLength");
const quickOrderItemQty = document.getElementById("quickOrderItemQty");
const quickOrderItemColor = document.getElementById("quickOrderItemColor");
const quickOrderItemMaterial = document.getElementById("quickOrderItemMaterial");
const quickOrderVariantMaterial = document.getElementById("quickOrderVariantMaterial");
const quickOrderVariantCoating = document.getElementById("quickOrderVariantCoating");
const quickOrderVariantThickness = document.getElementById("quickOrderVariantThickness");
const quickOrderVariantWoodType = document.getElementById("quickOrderVariantWoodType");
const quickOrderItemNote = document.getElementById("quickOrderItemNote");
const quickOrderItemPrice = document.getElementById("quickOrderItemPrice");
const quickOrderDiscountRate = document.getElementById("quickOrderDiscountRate");
const quickOrderVatRate = document.getElementById("quickOrderVatRate");
const quickOrderTotalsBox = document.getElementById("quickOrderTotalsBox");
const quickOrderAddItemBtn = document.getElementById("quickOrderAddItemBtn");
const quickOrderItemsTable = document.getElementById("quickOrderItemsTable");
const quickOrderResetBtn = document.getElementById("quickOrderResetBtn");
const quickOrderProductsList = document.getElementById("quickOrderProductsList");
const quickOrderProductSearch = document.getElementById("quickOrderProductSearch");
const quickOrderProductCategorySelect = document.getElementById("quickOrderProductCategorySelect");
const quickOrderSelectedProductLabel = document.getElementById("quickOrderSelectedProductLabel");
const workOrderSearch = document.getElementById("workOrderSearch");
const workOrderStatusFilter = document.getElementById("workOrderStatusFilter");
const workOrderPriorityFilter = document.getElementById("workOrderPriorityFilter");
const workOrderStageFilter = document.getElementById("workOrderStageFilter");
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
const offerNoManualToggle = document.getElementById("offerNoManualToggle");
const offerDiscountRateInput = document.getElementById("offerDiscountRate");
const offerLineCountLabel = document.getElementById("offerLineCountLabel");
const offerProductsList = document.getElementById("offerProductsList");
const offerProductSearch = document.getElementById("offerProductSearch");
const offerOnlyCovers = document.getElementById("offerOnlyCovers");
const offerProductCategorySelect = document.getElementById("offerProductCategorySelect");
const offerSelectedProductLabel = document.getElementById("offerSelectedProductLabel");
const offerCariSelect = document.getElementById("offerCariSelect");
const offerFormSection = document.getElementById("offerFormSection");
const offersListSection = document.getElementById("offersListSection");
const offersPrintSection = document.getElementById("offersPrintSection");
const offersCountBadge = document.getElementById("offersCountBadge");
const offersSearch = document.getElementById("offersSearch");
const offersStatusFilter = document.getElementById("offersStatusFilter");
const offersDateFrom = document.getElementById("offersDateFrom");
const offersDateTo = document.getElementById("offersDateTo");
const offersCariFilter = document.getElementById("offersCariFilter");
const offersSalesRepFilter = document.getElementById("offersSalesRepFilter");
const offersApplyFiltersBtn = document.getElementById("offersApplyFiltersBtn");
const offersClearFiltersBtn = document.getElementById("offersClearFiltersBtn");
const offersDateSort = document.getElementById("offersDateSort");
const offersAmountSort = document.getElementById("offersAmountSort");
const offersKpiGrid = document.getElementById("offersKpiGrid");
const offerStatusFlowPanel = document.getElementById("offerStatusFlowPanel");
const orderStatusFlowPanel = document.getElementById("orderStatusFlowPanel");
const workOrdersTable = document.getElementById("workOrdersTable");
const workOrderDetailPanel = document.getElementById("workOrderDetailPanel");
const productCategoryForm = document.getElementById("productCategoryForm");
const productCategoryInput = document.getElementById("productCategoryInput");
const productCategoryList = document.getElementById("productCategoryList");
const categoryManagerForm = document.getElementById("categoryManagerForm");
const categoryManagerInput = document.getElementById("categoryManagerInput");
const categoryManagerList = document.getElementById("categoryManagerList");
const categoryAddSection = document.getElementById("categoryAddSection");
const categoryListSection = document.getElementById("categoryListSection");
const productCategorySelect = document.getElementById("productCategorySelect");
const productEditId = document.getElementById("productEditId");
const productImageFile = document.getElementById("productImageFile");
const productImagePreview = document.getElementById("productImagePreview");
const productResetBtn = document.getElementById("productResetBtn");
const productSubmitBtn = document.getElementById("productSubmitBtn");
const productHasVariants = document.getElementById("productHasVariants");
const productVariantEditId = document.getElementById("productVariantEditId");
const productVariantMaterial = document.getElementById("productVariantMaterial");
const productVariantCoating = document.getElementById("productVariantCoating");
const productVariantThickness = document.getElementById("productVariantThickness");
const productVariantColor = document.getElementById("productVariantColor");
const productVariantWoodType = document.getElementById("productVariantWoodType");
const productVariantUnitPrice = document.getElementById("productVariantUnitPrice");
const productVariantMultiplier = document.getElementById("productVariantMultiplier");
const productVariantNote = document.getElementById("productVariantNote");
const productVariantResetBtn = document.getElementById("productVariantResetBtn");
const productVariantAddBtn = document.getElementById("productVariantAddBtn");
const productVariantsList = document.getElementById("productVariantsList");
const productFormSection = document.getElementById("productFormSection");
const productsListSection = document.getElementById("productsListSection");
const productsSearch = document.getElementById("productsSearch");
const productsSelectionSummary = document.getElementById("productsSelectionSummary");
const productFilterList = document.getElementById("productFilterList");
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
const cariDraftBtn = document.getElementById("cariDraftBtn");
const cariFormResetBtn = document.getElementById("cariFormResetBtn");
const cariSubmitBtn = document.getElementById("cariSubmitBtn");
const cariFormSection = document.getElementById("cariFormSection");
const cariListSection = document.getElementById("cariListSection");
const cariFormTabs = [...document.querySelectorAll("[data-cari-form-tab]")];
const cariFormPanels = [...document.querySelectorAll("[data-cari-form-panel]")];
const cariAddressList = document.getElementById("cariAddressList");
const cariAddAddressBtn = document.getElementById("cariAddAddressBtn");
const cariDuplicateBox = document.getElementById("cariDuplicateBox");
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
const offerFormDesignList = document.getElementById("offerFormDesignList");
const offerFormDesignName = document.getElementById("offerFormDesignName");
const offerFormDesignCreateBtn = document.getElementById("offerFormDesignCreateBtn");
const offerFormDesignActivateBtn = document.getElementById("offerFormDesignActivateBtn");
const offerFormDesignDuplicateBtn = document.getElementById("offerFormDesignDuplicateBtn");
const offerFormDesignDeleteBtn = document.getElementById("offerFormDesignDeleteBtn");
const offerFormDesignSaveBtn = document.getElementById("offerFormDesignSaveBtn");
const offerFormDesignEditor = document.getElementById("offerFormDesignEditor");
const offerFormDesignPreviewFrame = document.getElementById("offerFormDesignPreviewFrame");
const offerFormPreviewStatusBadge = document.getElementById("offerFormPreviewStatusBadge");
const offerFormSectionsList = document.getElementById("offerFormSectionsList");
const offerFormSectionAddBtn = document.getElementById("offerFormSectionAddBtn");
const offerFormSectionTitle = document.getElementById("offerFormSectionTitle");
const offerFormSectionDescription = document.getElementById("offerFormSectionDescription");
const offerFormSectionKind = document.getElementById("offerFormSectionKind");
const offerFormFieldsList = document.getElementById("offerFormFieldsList");
const offerFormFieldEditorPanel = document.getElementById("offerFormFieldEditorPanel");
const offerFormFieldLabel = document.getElementById("offerFormFieldLabel");
const offerFormFieldSample = document.getElementById("offerFormFieldSample");
const offerFormFieldAppearance = document.getElementById("offerFormFieldAppearance");
const offerFormFieldResetBtn = document.getElementById("offerFormFieldResetBtn");
const settingsCariStatementPage = document.getElementById("settingsCariStatementPage");
const settingsOfferFormPage = document.getElementById("settingsOfferFormPage");
const settingsStylePage = document.getElementById("settingsStylePage");
const uiStylePresetList = document.getElementById("uiStylePresetList");
const uiStyleForm = document.getElementById("uiStyleForm");
const uiStyleFontFamily = document.getElementById("uiStyleFontFamily");
const uiStylePrimaryColor = document.getElementById("uiStylePrimaryColor");
const uiStyleSidebarBg = document.getElementById("uiStyleSidebarBg");
const uiStylePageBg = document.getElementById("uiStylePageBg");
const uiStyleCardBg = document.getElementById("uiStyleCardBg");
const uiStyleRadius = document.getElementById("uiStyleRadius");
const uiStyleResetBtn = document.getElementById("uiStyleResetBtn");
const uiStyleSaveBtn = document.getElementById("uiStyleSaveBtn");
const uiStylePreviewFontLabel = document.getElementById("uiStylePreviewFontLabel");
const uiStylePreviewPaletteLabel = document.getElementById("uiStylePreviewPaletteLabel");
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
const cariCodeInput = document.getElementById("cariCode");
const cariTypeSelect = document.getElementById("cariTypeSelect");
const cariStatusSelect = document.getElementById("cariStatus");
const cariCompanyNameInput = document.getElementById("cariCompanyName");
const cariAuthorizedPersonInput = document.getElementById("cariAuthorizedPerson");
const cariPhoneInput = document.getElementById("cariPhone");
const cariWhatsappInput = document.getElementById("cariWhatsapp");
const cariEmailInput = document.getElementById("cariEmail");
const cariWebsiteInput = document.getElementById("cariWebsite");
const cariPhone2Input = document.getElementById("cariPhone2");
const cariDepartmentInput = document.getElementById("cariDepartment");
const cariSectorInput = document.getElementById("cariSector");
const cariSourceInput = document.getElementById("cariSource");
const cariTagInput = document.getElementById("cariTag");
const cariRiskLimitInput = document.getElementById("cariRiskLimit");
const cariMaturityDayInput = document.getElementById("cariMaturityDay");
const cariCurrencyInput = document.getElementById("cariCurrency");
const cariOpeningBalanceInput = document.getElementById("cariOpeningBalance");
const cariBalanceTypeInput = document.getElementById("cariBalanceType");
const cariEInvoiceStatusInput = document.getElementById("cariEInvoiceStatus");
const cariTaxOfficeInput = document.getElementById("cariTaxOffice");
const cariTaxNumberInput = document.getElementById("cariTaxNumber");
const cariIbanInput = document.getElementById("cariIban");
const cariDiscountRateInput = document.getElementById("cariDiscountRate");
const cariGeneralNoteInput = document.getElementById("cariGeneralNote");
const cariSpecialWarningInput = document.getElementById("cariSpecialWarning");
const cariSummaryLogo = document.getElementById("cariSummaryLogo");
const cariSummaryName = document.getElementById("cariSummaryName");
const cariSummarySubtitle = document.getElementById("cariSummarySubtitle");
const cariSummaryCode = document.getElementById("cariSummaryCode");
const cariSummaryType = document.getElementById("cariSummaryType");
const cariSummaryPhone = document.getElementById("cariSummaryPhone");
const cariSummaryRisk = document.getElementById("cariSummaryRisk");
const cariSummaryMaturity = document.getElementById("cariSummaryMaturity");
const cariSummaryBalance = document.getElementById("cariSummaryBalance");
const cariStatTotalMeta = document.getElementById("cariStatTotalMeta");
const cariStatDebtAmount = document.getElementById("cariStatDebtAmount");
const cariStatCredit = document.getElementById("cariStatCredit");
const cariStatCreditAmount = document.getElementById("cariStatCreditAmount");
const cariStatRiskMeta = document.getElementById("cariStatRiskMeta");
const cariDetailPanel = document.getElementById("cariDetailPanel");
const cariDetailBadge = document.getElementById("cariDetailBadge");
const cariDetailCompany = document.getElementById("cariDetailCompany");
const cariDetailType = document.getElementById("cariDetailType");
const cariDetailName = document.getElementById("cariDetailName");
const cariDetailPhone = document.getElementById("cariDetailPhone");
const cariDetailEmail = document.getElementById("cariDetailEmail");
const cariDetailLastMovement = document.getElementById("cariDetailLastMovement");
const cariDetailBalance = document.getElementById("cariDetailBalance");
const cariDetailLimit = document.getElementById("cariDetailLimit");
const cariDetailTaxNumber = document.getElementById("cariDetailTaxNumber");
const cariDetailDiscount = document.getElementById("cariDetailDiscount");
const cariDetailOfferBtn = document.getElementById("cariDetailOfferBtn");
const cariDetailTabContent = document.getElementById("cariDetailTabContent");
const cariDetailTabs = [...document.querySelectorAll("[data-cari-detail-tab]")];
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
  length: document.getElementById("offerLineLength"),
  quantity: document.getElementById("offerLineQuantity"),
  materialGroup: document.getElementById("offerLineMaterialGroup"),
  variantMaterial: document.getElementById("offerLineVariantMaterial"),
  variantCoating: document.getElementById("offerLineVariantCoating"),
  variantThickness: document.getElementById("offerLineVariantThickness"),
  modelName: document.getElementById("offerLineModelName"),
  color: document.getElementById("offerLineColor"),
  variantWoodType: document.getElementById("offerLineVariantWoodType"),
  unitPrice: document.getElementById("offerLineUnitPrice"),
  note: document.getElementById("offerLineNote"),
};

let currentView = appState.currentView;
let cache = {};
let selectedCariId = null;
let currentCariFormTab = "general";
let currentCariDetailTab = "general";
let selectedMovementId = null;
let selectedProductCategoryFilter = "";
let selectedExpandedProductCategory = "";
let selectedCategoryManager = "";
let currentCariSubview = appState.currentCariSubview;
let currentFinanceSubview = appState.currentFinanceSubview;
let currentProductsSubview = appState.currentProductsSubview;
let currentCategoriesSubview = appState.currentCategoriesSubview;
let currentOffersSubview = appState.currentOffersSubview;
let currentOrdersSubview = appState.currentOrdersSubview;
let currentSettingsSubview = appState.currentSettingsSubview;
const UI_STYLE_STORAGE_KEY = "ui-style-config-v1";
const UI_STYLE_PRESETS = [
  { id: "ocean", name: "Okyanus", fontFamily: "Inter, sans-serif", primaryColor: "#0969da", sidebarBg: "#061a33", pageBg: "#f4f7fb", cardBg: "#ffffff", radius: "16" },
  { id: "forest", name: "Orman", fontFamily: "'Segoe UI', sans-serif", primaryColor: "#0f8a5f", sidebarBg: "#0e2a22", pageBg: "#f3f8f5", cardBg: "#ffffff", radius: "18" },
  { id: "graphite", name: "Grafit", fontFamily: "'Poppins', sans-serif", primaryColor: "#475569", sidebarBg: "#111827", pageBg: "#f5f7fa", cardBg: "#ffffff", radius: "16" },
  { id: "sand", name: "Kum", fontFamily: "'Trebuchet MS', sans-serif", primaryColor: "#b7791f", sidebarBg: "#3f2d1b", pageBg: "#fbf7f1", cardBg: "#fffdfa", radius: "20" },
];
let activeUiStylePresetId = "ocean";
let expandedOfferProductCategories = [];
let editingOfferId = null;
let editingOfferLineElement = null;
let selectedOrderId = null;
let currentOrderDetailTab = "general";
let selectedWorkOrderId = null;
let quickOrderLines = [];
let quickOrderProductCategories = [];
let selectedQuickOrderProduct = null;
let quickOrderSubmitMode = "save";
let selectedStatementCariId = null;
let productSortState = {
  key: "name",
  dir: "asc",
};
const PRODUCT_CATEGORY_STORAGE_KEY = "silva-product-categories";
const CARI_STATEMENT_DESIGNS_STORAGE_KEY = "silva-cari-statement-designs";
const CARI_STATEMENT_ACTIVE_DESIGN_STORAGE_KEY = "silva-cari-statement-active-design-id";
const CARI_FORM_DRAFT_STORAGE_KEY = "silva-cari-form-draft";
const CARI_META_STORAGE_KEY = "silva-cari-meta";
let cariStatementDesigns = [];
let activeCariStatementDesignId = "";
let hasPendingCariStatementDesignChanges = false;
const OFFER_FORM_DESIGNS_STORAGE_KEY = "silva-offer-form-designs";
const OFFER_FORM_ACTIVE_DESIGN_STORAGE_KEY = "silva-offer-form-active-design-id";
let offerFormDesigns = [];
let activeOfferFormDesignId = "";
let hasPendingOfferFormDesignChanges = false;
let offerFormSectionDrafts = [];
let selectedOfferFormSectionId = "";
let offerFormFieldDrafts = [];
let selectedOfferFormFieldId = "";
let draggedOfferFormFieldId = "";
let currentOfferFieldDropPosition = "before";
let selectedOfferProductName = "";
let selectedOfferProductUnit = "M2";
let selectedOfferProductCalculationType = "sqm";
let selectedOfferProductId = null;
let selectedOfferProductCategory = "";
let selectedOfferVariantId = null;
let productVariantsDraft = [];

function setActiveNavLink(activeLink) {
  navLinks.forEach((link) => link.classList.toggle("active", link === activeLink));
}

const cariModule = window.erpCariModule.createCariModule({
  formSection: cariFormSection,
  listSection: cariListSection,
});
const financeModule = window.erpFinanceModule.createFinanceModule({
  movementFormSection,
  cariStatementSection,
});
const productsModule = window.erpProductsModule.createProductsModule({
  categoryAddSection,
  categoryListSection,
  productFormSection,
  productsListSection,
  resetProductSort: () => {
    productSortState = { key: "name", dir: "asc" };
  },
});
const offersModule = window.erpOffersModule.createOffersModule({
  formSection: offerFormSection,
  listSection: offersListSection,
  getProducts: () => cache.products || [],
  renderProductsPicker: (products) => renderOfferProductsPicker(products),
  setExpandedCategories: (value) => {
    expandedOfferProductCategories = value;
  },
});
const ordersModule = window.erpOrdersModule.createOrdersModule({
  quickOrderSection,
});
const crmModule = window.erpCrmModule.createCrmModule({
  renderCrm: (rows) => renderCrm(rows),
  getCrmRecords: () => cache.crm || [],
});
const stockModule = window.erpStockModule.createStockModule();
const router = window.erpRouter.createRouter({
  navLinks,
  pageTitle,
  pageDescription,
  primaryActionBtn,
  sidebar,
  viewMeta,
  views,
  getState: () => appState,
  onViewActivated: (viewName) => {
    currentView = viewName;
    if (viewName === "cari") cariModule.applyCariSubview(currentCariSubview);
    if (viewName === "crm") crmModule.activateCrmView();
    if (viewName === "finance") financeModule.applyFinanceSubview(currentFinanceSubview);
    if (viewName === "products") productsModule.applyProductsSubview(currentProductsSubview);
    if (viewName === "categories") productsModule.applyCategoriesSubview(currentCategoriesSubview);
    if (viewName === "offers") offersModule.applyOffersSubview(currentOffersSubview);
    if (viewName === "orders") ordersModule.applyOrdersSubview(currentOrdersSubview);
    if (viewName === "settings") applySettingsSubview(currentSettingsSubview);
    if (viewName === "panjur") syncPanjurTemplateModule();
  },
});
const routerSetActiveView = router.setActiveView;
const panjurScreenModule = window.erpPanjurScreenModule.createPanjurModule({
  api,
  getOrders: () => cache.orders || [],
  getPanjurJobs: () => cache.panjurJobs || [],
  refreshUI: () => refreshUI(),
  setActiveView: (viewName) => setActiveView(viewName),
});

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
  if (link.dataset.view === "panjur" && window.PanjurTemplateModule?.navigateToSection) {
    window.PanjurTemplateModule.navigateToSection(link.dataset.panjurNav || "projects");
  }
  if (link.dataset.view === "cari") {
    const targetId = link.dataset.sectionTarget || "";
    currentCariSubview = targetId === "cariFormSection" ? "form" : "list";
    cariModule.applyCariSubview(currentCariSubview);
  }
  if (link.dataset.view === "finance") {
    const targetId = link.dataset.sectionTarget || "";
    currentFinanceSubview = targetId === "cariStatementSection" ? "statement" : "movement";
    financeModule.applyFinanceSubview(currentFinanceSubview);
  }
  if (link.dataset.view === "products") {
    const targetId = link.dataset.sectionTarget || "";
    currentProductsSubview = targetId === "productsListSection" ? "list" : "form";
    productsModule.applyProductsSubview(currentProductsSubview);
  }
  if (link.dataset.view === "crm") {
    document.getElementById(link.dataset.sectionTarget || "crmListSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (link.dataset.view === "categories") {
    const targetId = link.dataset.sectionTarget || "";
    currentCategoriesSubview = targetId === "categoryListSection" ? "list" : "add";
    productsModule.applyCategoriesSubview(currentCategoriesSubview);
  }
  if (link.dataset.view === "offers") {
    const targetId = link.dataset.sectionTarget || "";
    currentOffersSubview = targetId === "offersListSection" ? "list" : "form";
    offersModule.applyOffersSubview(currentOffersSubview);
  }
  if (link.dataset.view === "orders") {
    const targetId = link.dataset.sectionTarget || "";
    currentOrdersSubview = targetId === "quickOrderSection" ? "quick" : "list";
    ordersModule.applyOrdersSubview(currentOrdersSubview);
  }
  if (link.dataset.view === "settings") {
    currentSettingsSubview = link.dataset.settingsSubview || "cari-statement";
    applySettingsSubview(currentSettingsSubview);
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
navSubgroupToggles.forEach((toggle) => toggle.addEventListener("click", () => {
  setActiveNavLink(toggle);
  const groupName = toggle.dataset.navSubgroup;
  const wrap = document.querySelector(`[data-nav-subgroup-wrap="${groupName}"]`);
  const nextOpenState = !wrap?.classList.contains("open");
  wrap?.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(nextOpenState));
}));
quickLinks.forEach((link) => link.addEventListener("click", () => {
  const targetView = link.dataset.action || link.dataset.viewLink;
  setActiveView(targetView);
  if (targetView === "offers") {
    currentOffersSubview = "form";
    applyOffersSubview(currentOffersSubview);
  }
  if (targetView === "orders") {
    currentOrdersSubview = "list";
    applyOrdersSubview(currentOrdersSubview);
  }
}));
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
offerFormDesignEditor?.addEventListener("input", handleOfferFormDesignEditorChange);
offerFormDesignEditor?.addEventListener("change", handleOfferFormDesignEditorChange);
offerFormSectionsList?.addEventListener("click", handleOfferFormSectionsListClick);
offerFormSectionAddBtn?.addEventListener("click", createOfferFormSection);
offerFormSectionTitle?.addEventListener("input", handleOfferFormSectionEditorChange);
offerFormSectionDescription?.addEventListener("input", handleOfferFormSectionEditorChange);
offerFormSectionKind?.addEventListener("change", handleOfferFormSectionEditorChange);
offerFormFieldsList?.addEventListener("change", handleOfferFormFieldsListChange);
offerFormFieldsList?.addEventListener("click", handleOfferFormFieldsListClick);
offerFormFieldsList?.addEventListener("dragstart", handleOfferFormFieldsDragStart);
offerFormFieldsList?.addEventListener("dragover", handleOfferFormFieldsDragOver);
offerFormFieldsList?.addEventListener("dragleave", handleOfferFormFieldsDragLeave);
offerFormFieldsList?.addEventListener("drop", handleOfferFormFieldsDrop);
offerFormFieldsList?.addEventListener("dragend", clearOfferFormFieldDragState);
offerFormFieldLabel?.addEventListener("input", handleOfferFormFieldEditorChange);
offerFormFieldSample?.addEventListener("input", handleOfferFormFieldEditorChange);
offerFormFieldAppearance?.addEventListener("change", handleOfferFormFieldEditorChange);
offerFormFieldResetBtn?.addEventListener("click", resetSelectedOfferFormFieldCustomization);
offerFormDesignList?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-offer-design-id]");
  if (!card) return;
  selectOfferFormDesign(card.dataset.offerDesignId || "");
});
offerFormDesignName?.addEventListener("input", () => {
  markOfferFormDesignAsDirty();
  refreshOfferFormDesignPreview();
});
offerFormDesignCreateBtn?.addEventListener("click", () => {
  createOfferFormDesign(String(offerFormDesignName?.value || "").trim());
});
offerFormDesignActivateBtn?.addEventListener("click", () => {
  const design = getActiveOfferFormDesign();
  if (!design) return;
  activeOfferFormDesignId = design.id;
  saveOfferFormDesignStore();
  renderOfferFormDesignList();
  refreshOfferFormDesignPreview();
});
offerFormDesignDuplicateBtn?.addEventListener("click", duplicateActiveOfferFormDesign);
offerFormDesignDeleteBtn?.addEventListener("click", deleteActiveOfferFormDesign);
offerFormDesignSaveBtn?.addEventListener("click", saveActiveOfferFormDesignChanges);

primaryActionBtn?.addEventListener("click", () => {
  const targetMap = {
    dashboard: ["offers", forms.offer],
    crm: ["crm", crmLeadForm],
    cari: ["cari", forms.cari],
    offers: ["offers", forms.offer],
    orders: ["orders", quickOrderForm],
    panjur: ["panjur", document.getElementById("view-panjur")],
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
  if (viewName === "categories") {
    currentCategoriesSubview = "add";
    applyCategoriesSubview(currentCategoriesSubview);
  }
  if (viewName === "offers") {
    currentOffersSubview = "form";
    applyOffersSubview(currentOffersSubview);
  }
  if (viewName === "orders") {
    currentOrdersSubview = "quick";
    applyOrdersSubview(currentOrdersSubview);
  }
  if (viewName === "settings") {
    currentSettingsSubview = "cari-statement";
    applySettingsSubview(currentSettingsSubview);
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
  await submitCariForm();
});

crmLeadResetBtn?.addEventListener("click", () => {
  crmLeadForm?.reset();
  if (crmLeadEditId) crmLeadEditId.value = "";
});

crmLeadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(crmLeadForm).entries());
  const payload = {
    companyName: data.companyName,
    contactName: data.contactName,
    phone: data.phone,
    email: data.email,
    city: data.city,
    district: data.district,
    source: data.source,
    status: data.status,
    priority: data.priority,
    estimatedValue: Number(data.estimatedValue || 0),
    winProbability: Number(data.winProbability || 0),
    nextFollowUpDate: data.nextFollowUpDate || null,
    assignedTo: data.assignedTo,
    note: data.note,
  };
  const id = Number(crmLeadEditId?.value || 0);
  try {
    if (id) await api.crm.update(id, payload);
    else await api.crm.create(payload);
    crmLeadForm.reset();
    if (crmLeadEditId) crmLeadEditId.value = "";
    await refreshUI();
  } catch (error) {
    window.alert(`CRM kaydi kaydedilemedi: ${error?.message || "Bilinmeyen hata"}`);
  }
});

function getSelectedQuickOrderProductRecord() {
  if (!selectedQuickOrderProduct?.productId) return null;
  return (cache.products || []).find((item) => Number(item.id) === Number(selectedQuickOrderProduct.productId)) || null;
}

function getQuickOrderVariantSelectionState() {
  return {
    materialType: String(quickOrderVariantMaterial?.value || "").trim(),
    coatingType: String(quickOrderVariantCoating?.value || "").trim(),
    thicknessMm: String(quickOrderVariantThickness?.value || "").trim(),
    color: String(quickOrderItemColor?.value || "").trim(),
    woodType: String(quickOrderVariantWoodType?.value || "").trim(),
  };
}

function syncQuickOrderVariantDatalist(id, values = []) {
  const target = document.getElementById(id);
  if (!target) return;
  target.innerHTML = [...new Set((values || []).map((value) => String(value || "").trim()).filter(Boolean))]
    .map((value) => `<option value="${escapeHtml(value)}"></option>`)
    .join("");
}

function buildQuickOrderVariantSummary(variant = {}) {
  return [
    variant.materialType || variant.material_type || "",
    variant.coatingType || variant.coating_type || "",
    variant.thicknessMm || variant.thickness_mm || variant.thickness ? `${variant.thicknessMm || variant.thickness_mm || variant.thickness} mm` : "",
    variant.color || "",
    variant.woodType || variant.wood_type || "",
  ].map((item) => String(item || "").trim()).filter(Boolean).join(" / ");
}

function fillQuickOrderVariantInputs(variant = null, keepUserEntries = false) {
  if (!keepUserEntries || !quickOrderVariantMaterial?.value) {
    if (quickOrderVariantMaterial) quickOrderVariantMaterial.value = variant?.materialType || variant?.material_type || "";
  }
  if (!keepUserEntries || !quickOrderVariantCoating?.value) {
    if (quickOrderVariantCoating) quickOrderVariantCoating.value = variant?.coatingType || variant?.coating_type || "";
  }
  if (!keepUserEntries || !quickOrderVariantThickness?.value) {
    if (quickOrderVariantThickness) quickOrderVariantThickness.value = variant?.thicknessMm || variant?.thickness_mm || variant?.thickness || "";
  }
  if (!keepUserEntries || !quickOrderVariantWoodType?.value) {
    if (quickOrderVariantWoodType) quickOrderVariantWoodType.value = variant?.woodType || variant?.wood_type || "";
  }
  if (!keepUserEntries || !quickOrderItemColor?.value) {
    if (quickOrderItemColor) quickOrderItemColor.value = variant?.color || "";
  }
}

function syncQuickOrderVariantFields(forceDefault = false) {
  const product = getSelectedQuickOrderProductRecord();
  const hasVariants = Boolean(product?.hasVariants && Array.isArray(product?.variants) && product.variants.length);
  quickOrderForm?.querySelectorAll("[data-quick-order-variant-field]").forEach((field) => {
    field.hidden = !hasVariants;
  });
  if (!hasVariants) return;

  const currentSelection = forceDefault ? {} : getQuickOrderVariantSelectionState();
  const options = getOfferVariantOptions(product, currentSelection);
  syncQuickOrderVariantDatalist("quickOrderVariantMaterialList", options.materialType);
  syncQuickOrderVariantDatalist("quickOrderVariantCoatingList", options.coatingType);
  syncQuickOrderVariantDatalist("quickOrderVariantColorList", options.color);
  syncQuickOrderVariantDatalist("quickOrderVariantWoodTypeList", options.woodType);

  const exactVariant = resolveSelectedOfferVariant(product, currentSelection);
  const matchingVariant = exactVariant || resolveSelectedOfferVariant(product, {});
  fillQuickOrderVariantInputs(matchingVariant, !forceDefault && Boolean(exactVariant));
  if (matchingVariant) {
    selectedQuickOrderProduct.variantId = matchingVariant.id || null;
    selectedQuickOrderProduct.unitPrice = getResolvedVariantUnitPrice(product, matchingVariant);
    if (quickOrderItemPrice && (!forceDefault || !quickOrderItemPrice.value || Number(quickOrderItemPrice.value || 0) <= 0)) {
      quickOrderItemPrice.value = String(selectedQuickOrderProduct.unitPrice || 0);
    }
    if (quickOrderItemMaterial && !quickOrderItemMaterial.value) {
      quickOrderItemMaterial.value = product?.category || matchingVariant.materialType || product?.materialType || "";
    }
  }
}

function renderQuickOrderItems() {
  if (!quickOrderItemsTable) return;
  const total = quickOrderLines.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const discountRate = Math.max(0, Number(quickOrderDiscountRate?.value || 0));
  const vatRate = Math.max(0, Number(quickOrderVatRate?.value || 0));
  const deposit = Math.max(0, Number(quickOrderForm?.querySelector("[name='depositAmount']")?.value || 0));
  const discountAmount = total * (discountRate / 100);
  const subtotal = Math.max(0, total - discountAmount);
  const vatAmount = subtotal * (vatRate / 100);
  const grandTotal = subtotal + vatAmount;
  const remaining = Math.max(0, grandTotal - deposit);
  quickOrderItemsTable.innerHTML = quickOrderLines.length ? `
    <table class="mini-data-table">
      <thead><tr><th>Kalem</th><th>Hesap</th><th>Adet</th><th>Birim Fiyat</th><th>Tutar</th><th></th></tr></thead>
      <tbody>
        ${quickOrderLines.map((item, index) => `
          <tr>
            <td>
              <strong>${escapeHtml(item.productName)}</strong>
              <small>${escapeHtml(item.variantSummary || item.materialType || item.materialGroup || "-")}</small>
            </td>
            <td>
              <strong>${escapeHtml(getProductCalculationLabel(item.calculationType || "piece"))}</strong>
              <small>${escapeHtml(item.unit || "-")} / ${formatDecimal(item.calculatedQuantity || 0, 3)}</small>
            </td>
            <td>${Number(item.quantity || 0)}</td>
            <td>${formatCurrency(item.unitPrice || 0)}</td>
            <td>${formatCurrency(item.total || 0)}</td>
            <td>
              <span class="order-row-actions order-row-actions-compact">
                <button class="offer-action-icon" type="button" data-quick-order-copy="${index}" title="Kopyala">${getOfferActionIcon("copy")}</button>
                <button class="offer-action-icon" type="button" data-quick-order-edit="${index}" title="Duzenle">${getOfferActionIcon("edit")}</button>
                <button class="offer-action-icon offer-action-icon-delete" type="button" data-quick-order-remove="${index}" title="Sil">${getOfferActionIcon("trash")}</button>
              </span>
            </td>
          </tr>
        `).join("")}
      </tbody>
      <tfoot><tr><th colspan="4">Toplam</th><th>${formatCurrency(total)}</th><th></th></tr></tfoot>
    </table>
  ` : renderOrderEmptyState("Siparis kalemi eklenmedi.", "Urun / varyasyon, olcu ve adet girerek hizli siparis kalemi ekleyin.");
  if (quickOrderTotalsBox) {
    quickOrderTotalsBox.innerHTML = `
      <article><span>Toplam</span><strong>${formatCurrency(total)}</strong></article>
      <article><span>Iskonto</span><strong>${formatCurrency(discountAmount)}</strong></article>
      <article><span>KDV</span><strong>${formatCurrency(vatAmount)}</strong></article>
      <article><span>Genel Toplam</span><strong>${formatCurrency(grandTotal)}</strong></article>
      <article><span>Kapora</span><strong>${formatCurrency(deposit)}</strong></article>
      <article><span>Kalan</span><strong>${formatCurrency(remaining)}</strong></article>
    `;
  }
}

function updateQuickOrderCalcFields() {
  const calculationType = selectedQuickOrderProduct?.calculationType || "piece";
  quickOrderForm?.querySelectorAll("[data-quick-calc-field]").forEach((field) => {
    const supported = String(field.dataset.quickCalcField || "").split(/\s+/);
    field.hidden = !supported.includes(calculationType);
  });
  syncQuickOrderVariantFields();
}

function renderQuickOrderProductsPicker(products) {
  if (!quickOrderProductsList) return;
  const searchTerm = String(quickOrderProductSearch?.value || "").trim().toLowerCase();
  const selectedCategory = quickOrderProductCategorySelect?.value || "";
  const activeProducts = (products || []).filter((item) => item.isActive !== false);
  const categories = collectProductCategories(activeProducts);
  if (quickOrderProductCategorySelect) {
    const currentValue = quickOrderProductCategorySelect.value || "";
    quickOrderProductCategorySelect.innerHTML = `
      <option value="">Tum kategoriler</option>
      ${categories.map((category) => `<option value="${escapeHtml(category)}" ${category === currentValue ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
    `;
  }

  const filtered = activeProducts.filter((item) => {
    const haystack = [
      item.name,
      item.category,
      item.costNotes,
      item.productionType,
      getProductCalculationLabel(item.calculationType),
      (item.variants || []).map((variant) => [variant.materialType, variant.coatingType, variant.color, variant.woodType, variant.thicknessMm].join(" ")).join(" "),
    ].join(" ").toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const groups = filtered.reduce((acc, item) => {
    const key = item.category || "Kategorisiz";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const categoryNames = Object.keys(groups).sort((left, right) => left.localeCompare(right, "tr"));
  quickOrderProductCategories = quickOrderProductCategories.filter((name) => categoryNames.includes(name));

  quickOrderProductsList.innerHTML = categoryNames.length ? categoryNames.map((category) => {
    const items = groups[category] || [];
    const isOpen = selectedCategory === category || quickOrderProductCategories.includes(category);
    const categoryIcon = String(category || "K")
      .split(" ")
      .map((part) => part[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return `
      <section class="offer-product-category ${isOpen ? "is-open" : ""}">
        <button class="offer-product-category-toggle" type="button" data-quick-order-category-toggle="${escapeHtml(category)}">
          <div class="offer-product-category-text">
            <span class="offer-product-category-icon" aria-hidden="true">${escapeHtml(categoryIcon)}</span>
            <span class="offer-product-category-copy">
              <strong>${escapeHtml(category)}</strong>
              <small>${items.length} urun</small>
            </span>
          </div>
          <span class="offer-product-category-arrow" aria-hidden="true">${isOpen ? "−" : "+"}</span>
        </button>
        <div class="offer-product-category-items" ${isOpen ? "" : "hidden"}>
          ${items.map((item) => {
            const defaultVariant = getDefaultProductVariant(item);
            const displayPrice = defaultVariant ? getResolvedVariantUnitPrice(item, defaultVariant) : getProductBaseUnitPrice(item);
            return `
            <button class="offer-product-item" type="button"
              data-quick-order-product-id="${item.id}"
              data-product-name="${escapeHtml(item.name)}"
              data-product-category="${escapeHtml(item.category || "")}"
              data-product-unit="${escapeHtml(item.costType || item.unit || "Adet")}"
              data-product-calculation-type="${escapeHtml(item.calculationType || "piece")}"
              data-product-price="${displayPrice}"
              data-product-default-variant-id="${defaultVariant?.id || ""}">
              <span class="offer-product-item-visual" aria-hidden="true">${escapeHtml(String(item.name || "U").slice(0, 1).toUpperCase())}</span>
              <span class="offer-product-item-copy">
                <strong>${escapeHtml(item.name)}</strong>
                <span>${escapeHtml(item.category || "Urun")}</span>
                <small>${escapeHtml(getProductCalculationLabel(item.calculationType))} | ${escapeHtml(item.costType || item.unit || "Adet")} | ${(item.variants || []).length} varyasyon | Birim ${formatCurrency(displayPrice)}</small>
              </span>
              <span class="offer-product-item-pill">Sec</span>
            </button>
          `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("") : `<div class="entity-card empty-state">Urun bulunamadi. Once Urunler sayfasindan kayit ekleyin.</div>`;
}

function handleQuickOrderProductPick(event) {
  const toggleButton = event.target.closest("[data-quick-order-category-toggle]");
  if (toggleButton) {
    const category = toggleButton.dataset.quickOrderCategoryToggle || "";
    quickOrderProductCategories = quickOrderProductCategories.includes(category) ? [] : [category];
    renderQuickOrderProductsPicker(cache.products || []);
    return;
  }
  const button = event.target.closest("[data-quick-order-product-id]");
  if (!button) return;
  selectedQuickOrderProduct = {
    productId: Number(button.dataset.quickOrderProductId || 0) || null,
    variantId: Number(button.dataset.productDefaultVariantId || 0) || null,
    productName: button.dataset.productName || "",
    category: button.dataset.productCategory || "",
    unit: getOfferCalculationUnit(button.dataset.productCalculationType || "piece"),
    calculationType: normalizeProductCalculationType(button.dataset.productCalculationType || "piece"),
    unitPrice: parseMoneyInput(button.dataset.productPrice || 0),
  };
  if (quickOrderItemName) quickOrderItemName.value = selectedQuickOrderProduct.productName;
  if (quickOrderItemPrice) quickOrderItemPrice.value = String(selectedQuickOrderProduct.unitPrice || 0);
  const product = getSelectedQuickOrderProductRecord();
  const defaultVariant = getDefaultProductVariant(product);
  if (quickOrderItemMaterial) quickOrderItemMaterial.value = product?.category || product?.materialType || "";
  fillQuickOrderVariantInputs(defaultVariant, false);
  updateQuickOrderCalcFields();
  if (quickOrderItemQty) quickOrderItemQty.focus();
  if (quickOrderSelectedProductLabel) {
    quickOrderSelectedProductLabel.textContent = `${selectedQuickOrderProduct.category || "Kategori"} / ${selectedQuickOrderProduct.productName} secildi. Hesap tipi: ${getProductCalculationLabel(selectedQuickOrderProduct.calculationType)}.`;
  }
  quickOrderProductsList.querySelectorAll(".offer-product-item").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
}

function addQuickOrderLine() {
  const product = getSelectedQuickOrderProductRecord();
  const productName = String(quickOrderItemName?.value || selectedQuickOrderProduct?.productName || "").trim();
  const quantity = Math.max(1, Math.trunc(Number(quickOrderItemQty?.value || 1)));
  const unitPrice = Math.max(0, Number(quickOrderItemPrice?.value || selectedQuickOrderProduct?.unitPrice || 0));
  const calculationType = selectedQuickOrderProduct?.calculationType || "piece";
  const width = Number(quickOrderItemWidth?.value || 0);
  const height = Number(quickOrderItemHeight?.value || 0);
  const length = Number(quickOrderItemLength?.value || 0);
  if (!productName) {
    window.alert("Siparis kalemi icin urun / kalem adi yazin.");
    return;
  }

  let variant = null;
  if (product?.hasVariants) {
    variant = resolveSelectedOfferVariant(product, getQuickOrderVariantSelectionState());
    if (!variant) {
      window.alert("Secilen urun icin gecerli bir varyasyon bulunamadi. Malzeme, kaplama, kalinlik ve renk secimlerini kontrol edin.");
      quickOrderVariantMaterial?.focus();
      return;
    }
  }

  const calculatedQuantity = getOfferCalculatedQuantity({ calculationType, width, height, length, quantity });
  const materialType = String(quickOrderVariantMaterial?.value || variant?.materialType || product?.materialType || "").trim();
  const coatingType = String(quickOrderVariantCoating?.value || variant?.coatingType || "").trim();
  const thicknessMm = Number(quickOrderVariantThickness?.value || variant?.thicknessMm || 0) || null;
  const woodType = String(quickOrderVariantWoodType?.value || variant?.woodType || "").trim();
  const color = String(quickOrderItemColor?.value || variant?.color || "").trim();
  const materialGroup = String(quickOrderItemMaterial?.value || selectedQuickOrderProduct?.category || product?.category || "Teklifsiz Siparis").trim();
  const variantSummary = variant
    ? buildQuickOrderVariantSummary(variant)
    : buildQuickOrderVariantSummary({ materialType, coatingType, thicknessMm, woodType, color });
  quickOrderLines.push({
    productId: selectedQuickOrderProduct?.productId || null,
    variantId: variant?.id || selectedQuickOrderProduct?.variantId || null,
    productName,
    materialGroup,
    materialType,
    coatingType,
    thicknessMm,
    woodType,
    color,
    variantSummary,
    width: calculationType === "sqm" ? width : 0,
    height: calculationType === "sqm" ? height : 0,
    widthMm: calculationType === "sqm" ? width : 0,
    heightMm: calculationType === "sqm" ? height : 0,
    length: calculationType === "linear_meter" ? length : 0,
    quantity,
    calculatedQuantity,
    unitPrice,
    total: calculatedQuantity * unitPrice,
    calculationType,
    unit: selectedQuickOrderProduct?.unit || getOfferCalculationUnit(calculationType),
    note: quickOrderItemNote?.value || "",
  });
  if (quickOrderItemName) quickOrderItemName.value = selectedQuickOrderProduct?.productName || productName;
  if (quickOrderItemQty) quickOrderItemQty.value = "1";
  if (quickOrderItemPrice) quickOrderItemPrice.value = String(unitPrice || 0);
  [quickOrderItemWidth, quickOrderItemHeight, quickOrderItemLength, quickOrderItemNote].forEach((input) => {
    if (input) input.value = "";
  });
  renderQuickOrderItems();
  if (quickOrderSelectedProductLabel && selectedQuickOrderProduct) {
    quickOrderSelectedProductLabel.textContent = `${selectedQuickOrderProduct.productName} kaleme eklendi. Ayni urunde devam edebilir veya yeni urun secebilirsiniz.`;
  }
}

function resetQuickOrderForm() {
  quickOrderLines = [];
  selectedQuickOrderProduct = null;
  quickOrderForm?.reset();
  setDefaultDates();
  [quickOrderVariantMaterial, quickOrderVariantCoating, quickOrderVariantThickness, quickOrderVariantWoodType].forEach((input) => {
    if (input) input.value = "";
  });
  if (quickOrderSelectedProductLabel) quickOrderSelectedProductLabel.textContent = "Soldan kategori ve urun secin.";
  quickOrderProductsList?.querySelectorAll(".offer-product-item").forEach((item) => item.classList.remove("active"));
  updateQuickOrderCalcFields();
  renderQuickOrderItems();
}

quickOrderAddItemBtn?.addEventListener("click", addQuickOrderLine);
quickOrderProductsList?.addEventListener("click", handleQuickOrderProductPick);
quickOrderProductSearch?.addEventListener("input", () => renderQuickOrderProductsPicker(cache.products || []));
quickOrderProductCategorySelect?.addEventListener("change", () => renderQuickOrderProductsPicker(cache.products || []));
[quickOrderVariantMaterial, quickOrderVariantCoating, quickOrderVariantThickness, quickOrderVariantWoodType, quickOrderItemColor].forEach((input) => {
  input?.addEventListener("input", () => syncQuickOrderVariantFields());
});
updateQuickOrderCalcFields();
quickOrderResetBtn?.addEventListener("click", resetQuickOrderForm);
quickOrderItemsTable?.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-quick-order-copy]");
  if (copyButton) {
    const source = quickOrderLines[Number(copyButton.dataset.quickOrderCopy)];
    if (source) quickOrderLines.push({ ...source });
    renderQuickOrderItems();
    return;
  }
  const editButton = event.target.closest("[data-quick-order-edit]");
  if (editButton) {
    const index = Number(editButton.dataset.quickOrderEdit);
    const source = quickOrderLines[index];
    if (!source) return;
    selectedQuickOrderProduct = {
      productId: source.productId || null,
      variantId: source.variantId || null,
      productName: source.productName || "",
      category: source.materialGroup || "",
      calculationType: source.calculationType || "piece",
      unit: source.unit || "Adet",
      unitPrice: source.unitPrice || 0,
    };
    if (quickOrderItemName) quickOrderItemName.value = source.productName || "";
    if (quickOrderItemQty) quickOrderItemQty.value = String(source.quantity || 1);
    if (quickOrderItemPrice) quickOrderItemPrice.value = String(source.unitPrice || 0);
    if (quickOrderItemWidth) quickOrderItemWidth.value = String(source.width || "");
    if (quickOrderItemHeight) quickOrderItemHeight.value = String(source.height || "");
    if (quickOrderItemLength) quickOrderItemLength.value = String(source.length || "");
    if (quickOrderItemColor) quickOrderItemColor.value = String(source.color || "");
    if (quickOrderItemMaterial) quickOrderItemMaterial.value = String(source.materialGroup || "");
    if (quickOrderVariantMaterial) quickOrderVariantMaterial.value = String(source.materialType || "");
    if (quickOrderVariantCoating) quickOrderVariantCoating.value = String(source.coatingType || "");
    if (quickOrderVariantThickness) quickOrderVariantThickness.value = String(source.thicknessMm || "");
    if (quickOrderVariantWoodType) quickOrderVariantWoodType.value = String(source.woodType || "");
    if (quickOrderItemNote) quickOrderItemNote.value = String(source.note || "");
    if (quickOrderSelectedProductLabel) quickOrderSelectedProductLabel.textContent = `${source.productName || "Kalem"} duzenleme icin yuklendi.`;
    quickOrderLines.splice(index, 1);
    updateQuickOrderCalcFields();
    renderQuickOrderItems();
    return;
  }
  const button = event.target.closest("[data-quick-order-remove]");
  if (!button) return;
  quickOrderLines.splice(Number(button.dataset.quickOrderRemove), 1);
  renderQuickOrderItems();
});
quickOrderForm?.addEventListener("input", renderQuickOrderItems);
quickOrderForm?.addEventListener("click", (event) => {
  const submitButton = event.target.closest("[data-quick-order-submit]");
  if (submitButton) quickOrderSubmitMode = submitButton.dataset.quickOrderSubmit || "save";
});
quickOrderForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!quickOrderLines.length) {
    window.alert("En az bir siparis kalemi ekleyin.");
    return;
  }
  const formData = new FormData(quickOrderForm);
  const submitter = event.submitter?.dataset?.quickOrderSubmit || quickOrderSubmitMode || "save";
  const submitButtons = quickOrderForm.querySelectorAll("[data-quick-order-submit]");
  submitButtons.forEach((button) => { button.disabled = true; });
  try {
    const result = await api.orders.createQuick({
      cariId: Number(formData.get("cariId")),
      orderDate: formData.get("orderDate"),
      deliveryDate: formData.get("deliveryDate"),
      productionNote: formData.get("productionNote"),
      shippingNote: formData.get("shippingNote"),
      collectionNote: formData.get("collectionNote"),
      depositAmount: Number(formData.get("depositAmount") || 0),
      discountRate: Number(formData.get("discountRate") || 0),
      vatRate: Number(formData.get("vatRate") || 20),
      priority: formData.get("priority") || "normal",
      approve: submitter === "approve",
      items: quickOrderLines.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        materialGroup: item.materialGroup,
        materialType: item.materialType,
        coatingType: item.coatingType,
        thicknessMm: item.thicknessMm,
        woodType: item.woodType,
        color: item.color,
        variantSummary: item.variantSummary,
        width: item.width,
        height: item.height,
        width_mm: item.widthMm ?? item.width,
        height_mm: item.heightMm ?? item.height,
        length: item.length,
        quantity: item.quantity,
        calculatedQuantity: item.calculatedQuantity,
        unitPrice: item.unitPrice,
        total: item.total,
        calculationType: item.calculationType,
        unit: item.unit,
        note: item.note,
      })),
    });
    resetQuickOrderForm();
    currentOrdersSubview = "list";
    applyOrdersSubview(currentOrdersSubview);
    await refreshUI();
    selectedOrderId = Number(result?.order?.id || 0);
    if (selectedOrderId) {
      renderOrderDetail((cache.orders || []).find((item) => item.id === selectedOrderId) || null);
      document.getElementById("orderDetailPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    window.alert(`Teklifsiz hizli siparis olusturulamadi: ${error?.message || "Bilinmeyen hata"}`);
  } finally {
    submitButtons.forEach((button) => { button.disabled = false; });
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
  try {
  const submitAction = event.submitter?.dataset?.offerSubmitAction || "save";
  const data = formToObject(forms.offer);
  const currentEditingOfferId = editingOfferId;
  const existingOffer = currentEditingOfferId
    ? (cache.offers || []).find((item) => Number(item.id) === Number(currentEditingOfferId))
    : null;
  const enteredRows = collectOfferRows();
  const fallbackRows = currentEditingOfferId && existingOffer
    ? (existingOffer.items?.length ? existingOffer.items : existingOffer.meta?.rows || [])
    : [];
  const rows = (enteredRows.length ? enteredRows : fallbackRows)
    .map((row) => sanitizeOfferRowForPersistence(row));
  if (!rows.length) {
    window.alert("En az bir kapak siparis satiri girmeniz gerekiyor.");
    return;
  }
  if (!data.cariId) {
    window.alert("Lutfen once bir cari secin.");
    offerCariSelect?.focus();
    return;
  }
  const cari = (cache.cari || []).find((item) => String(item.id) === String(data.cariId));
  const summary = calculateOfferSummary(rows, Number(data.discountRate || cari?.discountRate || 0), Number(data.vatRate || 0));
  const firstRow = sanitizeOfferRowForPersistence(rows[0] || {});
  const offerNo = String(data.offerNoDisplay || "").trim()
    || (offerNoManualToggle?.checked ? generateManualOfferNo() : generateOfferNo());
  const contractText = serializeOfferContract({
    notes: data.contractText || "",
    formType: data.formType,
    vatRate: Number(data.vatRate || 0),
    discountRate: Number(data.discountRate || 0),
    summary,
  });

  const payload = {
    offerNo,
    cariId: Number(data.cariId),
    coverType: firstRow.modelName || firstRow.materialGroup || `${rows.length} Kalem`,
    color: firstRow.color || "Karışık",
    width: Math.max(0, Number(firstRow.width || 0) || 0),
    height: Math.max(0, Number(firstRow.height || 0) || 0),
    quantity: Math.max(1, Math.round(Number(summary.totalQuantity || 0) || 0)),
    shipment: data.shipment || "",
    orderDate: data.orderDate,
    termDays: Math.max(0, Number(data.termDays || 0) || 0),
    deliveryDate: data.deliveryDate,
    unitPrice: Math.max(0, Number(firstRow.unitPrice || 0) || 0),
    grossTotal: Math.max(0, Number(summary.grossTotal || 0) || 0),
    discountRate: Math.max(0, Number(data.discountRate || cari?.discountRate || 0) || 0),
    netTotal: Math.max(0, Number(summary.grandTotal || 0) || 0),
    contractText,
    items: rows,
    status: "draft",
  };

  let savedOfferId = currentEditingOfferId;
  if (currentEditingOfferId) {
    const result = await api.offers.update(currentEditingOfferId, buildOfferApiPayload(payload));
    savedOfferId = result?.id || currentEditingOfferId;
  } else {
    const result = await addRecord(STORES.offers, payload);
    savedOfferId = result?.id || savedOfferId;
  }
  if (submitAction === "send" && savedOfferId) {
    try {
      await api.offers.updateStatus(savedOfferId, "sent");
    } catch {
      // Mevcut durum gecisi uygun degilse kayit basarili kalir.
    }
  }
  forms.offer.reset();
  resetOfferEditMode();
  if (offerNoManualToggle) offerNoManualToggle.checked = false;
  if (offerNoDisplay) offerNoDisplay.readOnly = true;
  setDefaultDates();
  syncOfferDefaults();
  initializeOfferLines(createDefaultOfferRows());
  await refreshUI();
  if (currentEditingOfferId) {
    currentOffersSubview = "list";
    applyOffersSubview(currentOffersSubview);
    offersListSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (submitAction === "pdf" && savedOfferId) {
    const savedOffer = (cache.offers || []).find((item) => Number(item.id) === Number(savedOfferId));
    const savedCari = (cache.cari || []).find((item) => item.id === savedOffer?.cariId);
    if (savedOffer) {
      const printWindow = window.open("", "_blank", "width=960,height=800");
      if (printWindow) {
        printWindow.document.write(buildOfferPrintHtml(savedOffer, savedCari));
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
      }
    }
  }
  } catch (error) {
    window.alert(`Teklif kaydedilemedi: ${error?.message || "Bilinmeyen hata"}`);
  }
});

forms.product?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = formToObject(forms.product);
  const isEditingProduct = Boolean(productEditId?.value);
  const payload = {
    name: data.name || "Panjur Kapak",
    type: data.type || data.name,
    category: data.category || "Panjur Sistemleri",
    costType: data.costType || "M2",
    unit: data.costType || "M2",
    costAmount: parseMoneyInput(data.costAmount),
    calculationType: data.calculationType || "sqm",
    defaultWasteRate: Number(data.defaultWasteRate || 0),
    materialType: data.materialType || "",
    thickness: data.thickness === "" ? null : Number(data.thickness || 0),
    edgeBandDefault: data.edgeBandDefault || "",
    stockItemId: data.stockItemId === "" ? null : Number(data.stockItemId || 0),
    imageUrl: data.imageUrl || "",
    costNotes: data.costNotes,
    hasVariants: productHasVariants?.checked !== false,
    isActive: true,
    variants: collectProductVariantsForPayload(),
  };
  if (!payload.variants.length) {
    window.alert("En az bir varyasyon ekleyin. Panjur Kapak urunu varyasyon mantigiyla calisacak.");
    productVariantMaterial?.focus();
    return;
  }
  if (productEditId?.value) {
    await api.products.update(Number(productEditId.value), buildProductApiPayload(payload));
  } else {
    await addRecord(STORES.products, payload);
  }
  resetProductFormEditor();
  if (isEditingProduct) {
    currentProductsSubview = "list";
    applyProductsSubview(currentProductsSubview);
  }
  await refreshUI();
  if (isEditingProduct) {
    productsListSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
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

function normalizeProductCalculationType(value = "") {
  const normalized = String(value || "").trim();
  return PRODUCT_CALCULATION_TYPES.includes(normalized) ? normalized : "piece";
}

function getProductCalculationLabel(value = "") {
  return PRODUCT_CALCULATION_LABELS[normalizeProductCalculationType(value)] || "Adet";
}

function createDefaultProductVariantName(variant = {}) {
  const parts = [
    "Panjur Kapak",
    variant.materialType || variant.material_type || "",
    variant.woodType || variant.wood_type || "",
    variant.coatingType || variant.coating_type || "",
    variant.thicknessMm || variant.thickness_mm || variant.thickness ? `${variant.thicknessMm || variant.thickness_mm || variant.thickness} mm` : "",
    variant.color || "",
  ].map((item) => String(item || "").trim()).filter(Boolean);
  return parts.join(" | ");
}

function normalizeProductVariantDraft(variant = {}, index = 0) {
  const thicknessValue = variant.thicknessMm ?? variant.thickness_mm ?? variant.thickness;
  return {
    id: variant.id || `draft-${Date.now()}-${index}`,
    materialType: String(variant.materialType ?? variant.material_type ?? "").trim(),
    coatingType: String(variant.coatingType ?? variant.coating_type ?? "").trim(),
    thicknessMm: thicknessValue === "" || thicknessValue === null || thicknessValue === undefined ? "" : String(Number(thicknessValue) || ""),
    color: String(variant.color || "").trim(),
    woodType: String(variant.woodType ?? variant.wood_type ?? "").trim(),
    unitPrice: Number(variant.unitPrice ?? variant.unit_price ?? 0) || 0,
    priceMultiplier: Number(variant.priceMultiplier ?? variant.price_multiplier ?? 1) || 1,
    note: String(variant.note || "").trim(),
    isDefault: Boolean(variant.isDefault ?? variant.is_default ?? index === 0),
  };
}

function getDefaultProductVariant(product = null) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  return variants.find((variant) => variant.isDefault) || variants[0] || null;
}

function getProductBaseUnitPrice(product = null) {
  return Number(product?.costAmount || product?.m2Price || product?.salePrice || 0) || 0;
}

function getResolvedVariantUnitPrice(product = null, variant = null) {
  const explicit = Number(variant?.unitPrice ?? variant?.unit_price ?? 0) || 0;
  if (explicit > 0) return explicit;
  const multiplier = Number(variant?.priceMultiplier ?? variant?.price_multiplier ?? 1) || 1;
  return getProductBaseUnitPrice(product) * multiplier;
}

function resetProductVariantEditor() {
  if (productVariantEditId) productVariantEditId.value = "";
  if (productVariantMaterial) productVariantMaterial.value = "";
  if (productVariantCoating) productVariantCoating.value = "";
  if (productVariantThickness) productVariantThickness.value = "";
  if (productVariantColor) productVariantColor.value = "";
  if (productVariantWoodType) productVariantWoodType.value = "";
  if (productVariantUnitPrice) productVariantUnitPrice.value = "0";
  if (productVariantMultiplier) productVariantMultiplier.value = "1";
  if (productVariantNote) productVariantNote.value = "";
  if (productVariantAddBtn) productVariantAddBtn.textContent = "Varyasyon Ekle";
}

function renderProductVariantsEditor() {
  if (!productVariantsList) return;
  productVariantsList.innerHTML = productVariantsDraft.length ? `
    <div class="product-variant-table">
      <div class="product-variant-table-head">
        <span>Varyasyon</span>
        <span>Malzeme</span>
        <span>Kaplama</span>
        <span>Kal.</span>
        <span>Renk</span>
        <span>Agac</span>
        <span>Birim Fiyat</span>
        <span>Carpan</span>
        <span>Islem</span>
      </div>
      ${productVariantsDraft.map((variant, index) => `
        <div class="product-variant-table-row ${variant.isDefault ? "is-default" : ""}">
          <span><strong>${escapeHtml(createDefaultProductVariantName(variant))}</strong>${variant.isDefault ? '<small>Varsayilan</small>' : ""}</span>
          <span>${escapeHtml(variant.materialType || "-")}</span>
          <span>${escapeHtml(variant.coatingType || "-")}</span>
          <span>${escapeHtml(variant.thicknessMm ? `${variant.thicknessMm} mm` : "-")}</span>
          <span>${escapeHtml(variant.color || "-")}</span>
          <span>${escapeHtml(variant.woodType || "-")}</span>
          <span>${formatCurrency(variant.unitPrice || 0)}</span>
          <span>${Number(variant.priceMultiplier || 1).toFixed(4)}</span>
          <span class="product-variant-row-actions">
            <button class="ghost-action compact-action" type="button" data-product-variant-edit="${index}">Duzenle</button>
            <button class="ghost-action compact-action ${variant.isDefault ? "" : "danger-action"}" type="button" data-product-variant-default="${index}">${variant.isDefault ? "Varsayilan" : "Varsayilan Yap"}</button>
            <button class="ghost-action compact-action danger-action" type="button" data-product-variant-delete="${index}">Sil</button>
          </span>
        </div>
      `).join("")}
    </div>
  ` : `<div class="entity-card empty-state">Henuz varyasyon eklenmedi. Panjur Kapak icin malzeme, kaplama ve kalinlik secip varyasyon ekleyin.</div>`;
}

function collectProductVariantsForPayload() {
  return productVariantsDraft.map((variant, index) => ({
    variant_name: createDefaultProductVariantName(variant),
    material_type: variant.materialType || "",
    coating_type: variant.coatingType || "",
    thickness_mm: variant.thicknessMm === "" ? null : Number(variant.thicknessMm || 0),
    thickness: variant.thicknessMm === "" ? null : Number(variant.thicknessMm || 0),
    color: variant.color || "",
    wood_type: variant.woodType || "",
    unit_price: Number(variant.unitPrice || 0) || 0,
    price_multiplier: Number(variant.priceMultiplier || 1) || 1,
    price_delta: 0,
    is_default: variant.isDefault || index === 0,
    note: variant.note || "",
  }));
}

function buildProductApiPayload(payload = {}) {
  const costType = payload.costType || payload.cost_type || "M2";
  const costAmount = Number(payload.costAmount ?? payload.cost_amount ?? payload.salePrice ?? payload.sale_price ?? 0) || 0;
  const unit = payload.unit || payload.productTypeUnit || costType || "M2";
  const thicknessValue = payload.thickness ?? payload.thickness_mm;
  const stockItemValue = payload.stockItemId ?? payload.stock_item_id;
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
    calculation_type: normalizeProductCalculationType(payload.calculationType ?? payload.calculation_type),
    default_waste_rate: Math.max(0, Number(payload.defaultWasteRate ?? payload.default_waste_rate ?? 0) || 0),
    material_type: payload.materialType ?? payload.material_type ?? "",
    thickness: thicknessValue === "" || thicknessValue === null || thicknessValue === undefined ? null : Number(thicknessValue) || 0,
    edge_band_default: payload.edgeBandDefault ?? payload.edge_band_default ?? "",
    stock_item_id: stockItemValue === "" || stockItemValue === null || stockItemValue === undefined ? null : Number(stockItemValue) || null,
    has_variants: payload.hasVariants ?? payload.has_variants ?? true,
    is_active: payload.isActive ?? payload.is_active ?? true,
    production_type: payload.productionType ?? payload.production_type ?? (String(payload.name || "").toLocaleLowerCase("tr-TR").includes("panjur") ? "panjur" : "standard"),
    image_url: payload.imageUrl ?? payload.image_url ?? "",
    cost_notes: payload.costNotes ?? payload.cost_notes ?? "",
    variants: payload.variants || [],
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

productResetBtn?.addEventListener("click", resetProductFormEditor);
productVariantResetBtn?.addEventListener("click", resetProductVariantEditor);
productVariantAddBtn?.addEventListener("click", () => {
  const draft = normalizeProductVariantDraft({
    id: productVariantEditId?.value || "",
    materialType: productVariantMaterial?.value || "",
    coatingType: productVariantCoating?.value || "",
    thicknessMm: productVariantThickness?.value || "",
    color: productVariantColor?.value || "",
    woodType: productVariantWoodType?.value || "",
    unitPrice: parseMoneyInput(productVariantUnitPrice?.value || 0),
    priceMultiplier: Number(productVariantMultiplier?.value || 1) || 1,
    note: productVariantNote?.value || "",
  });
  if (!draft.materialType || !draft.coatingType || !draft.thicknessMm || !draft.color) {
    window.alert("Malzeme, kaplama, kalinlik ve renk alanlarini doldurun.");
    productVariantMaterial?.focus();
    return;
  }
  const editingIndex = productVariantEditId?.value === "" ? -1 : Number(productVariantEditId.value);
  if (editingIndex >= 0 && productVariantsDraft[editingIndex]) {
    productVariantsDraft[editingIndex] = {
      ...productVariantsDraft[editingIndex],
      ...draft,
      isDefault: productVariantsDraft[editingIndex].isDefault,
    };
  } else {
    productVariantsDraft.push({
      ...draft,
      isDefault: productVariantsDraft.length === 0,
    });
  }
  renderProductVariantsEditor();
  resetProductVariantEditor();
});
productVariantsList?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-product-variant-edit]");
  if (editButton) {
    const index = Number(editButton.dataset.productVariantEdit || -1);
    const variant = productVariantsDraft[index];
    if (!variant) return;
    if (productVariantEditId) productVariantEditId.value = String(index);
    if (productVariantMaterial) productVariantMaterial.value = variant.materialType || "";
    if (productVariantCoating) productVariantCoating.value = variant.coatingType || "";
    if (productVariantThickness) productVariantThickness.value = variant.thicknessMm || "";
    if (productVariantColor) productVariantColor.value = variant.color || "";
    if (productVariantWoodType) productVariantWoodType.value = variant.woodType || "";
    if (productVariantUnitPrice) productVariantUnitPrice.value = formatMoneyInputValue(variant.unitPrice || 0);
    if (productVariantMultiplier) productVariantMultiplier.value = String(variant.priceMultiplier || 1);
    if (productVariantNote) productVariantNote.value = variant.note || "";
    if (productVariantAddBtn) productVariantAddBtn.textContent = "Varyasyonu Guncelle";
    productVariantMaterial?.focus();
    return;
  }
  const defaultButton = event.target.closest("[data-product-variant-default]");
  if (defaultButton) {
    const index = Number(defaultButton.dataset.productVariantDefault || -1);
    productVariantsDraft = productVariantsDraft.map((variant, variantIndex) => ({
      ...variant,
      isDefault: variantIndex === index,
    }));
    renderProductVariantsEditor();
    return;
  }
  const deleteButton = event.target.closest("[data-product-variant-delete]");
  if (deleteButton) {
    const index = Number(deleteButton.dataset.productVariantDelete || -1);
    productVariantsDraft = productVariantsDraft.filter((_, variantIndex) => variantIndex !== index);
    if (productVariantsDraft.length && !productVariantsDraft.some((variant) => variant.isDefault)) {
      productVariantsDraft[0].isDefault = true;
    }
    renderProductVariantsEditor();
    resetProductVariantEditor();
  }
});

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
crmSearch?.addEventListener("input", () => renderCrm(cache.crm || []));
crmExportBtn?.addEventListener("click", exportCrmCsv);
workOrderSearch?.addEventListener("input", () => renderWorkOrdersTable(cache.workOrders || []));
workOrderStatusFilter?.addEventListener("change", () => renderWorkOrdersTable(cache.workOrders || []));
workOrderPriorityFilter?.addEventListener("change", () => renderWorkOrdersTable(cache.workOrders || []));
workOrderStageFilter?.addEventListener("change", () => renderWorkOrdersTable(cache.workOrders || []));
offersSearch?.addEventListener("input", () => renderOffers(cache.offers || []));
offersStatusFilter?.addEventListener("change", () => renderOffers(cache.offers || []));
offersDateFrom?.addEventListener("change", () => renderOffers(cache.offers || []));
offersDateTo?.addEventListener("change", () => renderOffers(cache.offers || []));
offersCariFilter?.addEventListener("change", () => renderOffers(cache.offers || []));
offersSalesRepFilter?.addEventListener("change", () => renderOffers(cache.offers || []));
offersApplyFiltersBtn?.addEventListener("click", () => renderOffers(cache.offers || []));
offersClearFiltersBtn?.addEventListener("click", () => {
  if (offersSearch) offersSearch.value = "";
  if (offersStatusFilter) offersStatusFilter.value = "";
  if (offersDateFrom) offersDateFrom.value = "";
  if (offersDateTo) offersDateTo.value = "";
  if (offersCariFilter) offersCariFilter.value = "";
  if (offersSalesRepFilter) offersSalesRepFilter.value = "";
  if (offersAmountSort) offersAmountSort.value = "none";
  if (offersDateSort) offersDateSort.value = "date-desc";
  renderOffers(cache.offers || []);
});
offersDateSort?.addEventListener("change", () => renderOffers(cache.offers || []));
offersAmountSort?.addEventListener("change", () => renderOffers(cache.offers || []));
document.addEventListener("click", (event) => {
  if (
    event.target.closest("[data-offer-status-toggle]")
    || event.target.closest(".offer-status-floating-menu")
    || event.target.closest("[data-offer-actions-toggle]")
    || event.target.closest("[data-order-actions-toggle]")
    || event.target.closest("[data-crm-actions-toggle]")
    || event.target.closest(".offer-actions-floating-menu")
  ) return;
  closeOfferStatusDropdown();
  closeOfferActionsDropdown();
  closeCrmActionsDropdown();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeOfferStatusDropdown();
  closeOfferActionsDropdown();
  closeOfferStatusNoteModal();
});
cariSearch?.addEventListener("input", () => renderCari(cache.cari || [], cache.movements || [], cache.orders || []));
cariTypeFilter?.addEventListener("change", () => renderCari(cache.cari || [], cache.movements || [], cache.orders || []));
cariBalanceFilter?.addEventListener("change", () => renderCari(cache.cari || [], cache.movements || [], cache.orders || []));
cariSort?.addEventListener("change", () => renderCari(cache.cari || [], cache.movements || [], cache.orders || []));
cariFormTabs.forEach((button) => button.addEventListener("click", () => activateCariFormTab(button.dataset.cariFormTab || "general")));
cariDraftBtn?.addEventListener("click", saveCariFormDraft);
cariFormResetBtn?.addEventListener("click", clearCariFormForNewRecord);
cariAddAddressBtn?.addEventListener("click", () => addCariAddressCard());
cariAddressList?.addEventListener("click", handleCariAddressListClick);
forms.cari?.addEventListener("input", handleCariFormLiveUpdate);
forms.cari?.addEventListener("change", handleCariFormLiveUpdate);
cariDetailPanel?.addEventListener("click", (event) => {
  const tabButton = event.target.closest("[data-cari-detail-tab]");
  if (!tabButton) return;
  currentCariDetailTab = tabButton.dataset.cariDetailTab || "general";
  renderCariDetail((cache.cari || []).find((item) => item.id === selectedCariId) || null, cache.movements || [], cache.orders || []);
});
cariDetailOfferBtn?.addEventListener("click", () => {
  if (!selectedCariId) return;
  openOfferFormForCari(Number(selectedCariId));
});
clearCariSelectionBtn?.addEventListener("click", () => clearCariSelection({ showForm: true }));
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
  const viewCariButton = event.target.closest(".cari-view-btn");
  if (viewCariButton) {
    event.preventDefault();
    event.stopPropagation();
    selectCariById(Number(viewCariButton.dataset.id), { detailTab: "general" });
    return;
  }
  const movementsCariButton = event.target.closest(".cari-movements-btn");
  if (movementsCariButton) {
    event.preventDefault();
    event.stopPropagation();
    selectCariById(Number(movementsCariButton.dataset.id), { detailTab: "movements" });
    return;
  }
  const offerCariButton = event.target.closest(".cari-offer-btn");
  if (offerCariButton) {
    event.preventDefault();
    event.stopPropagation();
    openOfferFormForCari(Number(offerCariButton.dataset.id));
    return;
  }
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
  if (event.target.closest(".cari-row-action")) return;
  const card = event.target.closest("[data-cari-select]");
  if (!card) return;
  selectCariById(Number(card.dataset.cariSelect));
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
offerLinesContainer?.addEventListener("click", handleOfferLineEdit);
Object.values(offerLineInputs).forEach((input) => {
  input?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    appendOfferLine();
  });
});
[
  offerLineInputs.variantMaterial,
  offerLineInputs.variantCoating,
  offerLineInputs.variantThickness,
  offerLineInputs.color,
  offerLineInputs.variantWoodType,
].forEach((input) => {
  input?.addEventListener("input", () => syncOfferVariantFields());
  input?.addEventListener("change", () => syncOfferVariantFields());
});
forms.offer?.querySelector("[name='discountRate']")?.addEventListener("input", () => recalcOfferSummary());
forms.offer?.querySelector("[name='vatRate']")?.addEventListener("input", () => recalcOfferSummary());
forms.offer?.querySelector("[name='cariId']")?.addEventListener("change", handleOfferCariChange);
forms.offer?.querySelector("[name='orderDate']")?.addEventListener("change", syncOfferDeliveryDate);
forms.offer?.querySelector("[name='termDays']")?.addEventListener("input", syncOfferDeliveryDate);
offerProductsList?.addEventListener("click", handleOfferProductPick);
offerProductsList?.addEventListener("dblclick", handleOfferProductDoublePick);
offerProductSearch?.addEventListener("input", () => renderOfferProductsPicker(cache.products || []));
offerOnlyCovers?.addEventListener("change", () => renderOfferProductsPicker(cache.products || []));
offerProductCategorySelect?.addEventListener("change", () => renderOfferProductsPicker(cache.products || []));
offerNoManualToggle?.addEventListener("change", () => {
  const allowManual = Boolean(offerNoManualToggle.checked);
  if (offerNoDisplay) {
    offerNoDisplay.readOnly = !allowManual;
    if (!allowManual) {
      offerNoDisplay.value = generateOfferNo();
    } else {
      if (!offerNoDisplay.value.trim() || offerNoDisplay.value.startsWith("SLV-TKF-") || offerNoDisplay.value.startsWith("MNL-TKF-")) {
        offerNoDisplay.value = generateManualOfferNo();
      }
      offerNoDisplay.focus();
      offerNoDisplay.select();
    }
  }
});
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
    renderProductCategories(cache.products || []);
    categoryManagerInput?.focus();
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
productCategorySelect?.addEventListener("change", () => renderProductCategories(cache.products || []));
productFilterList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-filter]");
  if (!button) return;
  selectedProductCategoryFilter = button.dataset.productFilter || "";
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
  try {
    setDefaultDates();
    syncOfferDefaults();
    initializeOfferLines(createDefaultOfferRows());
    ensureCariStatementDesignStore();
    ensureOfferFormDesignStore();
    initializeUiStyleSettings();
    runtime.registerGlobalDiagnostics(reportRuntimeProblem);
    await ensureAutoLogin();
    await applyAuthState();
    if (getSession()) {
      await refreshUI();
    }
  } catch (error) {
    reportRuntimeProblem("bootstrap", error);
    authError.textContent = `Program baslatilamadi: ${error?.message || "Bilinmeyen hata"}`;
  }
});

function setActiveView(viewName) {
  return routerSetActiveView(viewName);
}

function syncPanjurTemplateModule() {
  return panjurScreenModule.syncPanjurTemplateModule();
}

function applyCariSubview(mode) {
  return cariModule.applyCariSubview(mode);
}

function applyFinanceSubview(mode) {
  return financeModule.applyFinanceSubview(mode);
}

function applyProductsSubview(mode) {
  return productsModule.applyProductsSubview(mode);
}

function applyCategoriesSubview(mode) {
  return productsModule.applyCategoriesSubview(mode);
}

function applyOffersSubview(mode) {
  return offersModule.applyOffersSubview(mode);
}

function applyOrdersSubview(mode) {
  return ordersModule.applyOrdersSubview(mode);
}

function applySettingsSubview(mode) {
  if (settingsCariStatementPage) settingsCariStatementPage.hidden = mode !== "cari-statement";
  if (settingsStylePage) settingsStylePage.hidden = mode !== "style";
  if (settingsOfferFormPage) settingsOfferFormPage.hidden = true;
}

function normalizeHexColor(value, fallback) {
  const text = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(text)) return text;
  return fallback;
}

function hexToRgb(hex) {
  const normalized = normalizeHexColor(hex, "#000000").slice(1);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function toRgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getDefaultUiStyleConfig() {
  return { ...UI_STYLE_PRESETS[0] };
}

function getUiStyleConfigFromForm() {
  return {
    fontFamily: String(uiStyleFontFamily?.value || getDefaultUiStyleConfig().fontFamily),
    primaryColor: normalizeHexColor(uiStylePrimaryColor?.value, "#0969da"),
    sidebarBg: normalizeHexColor(uiStyleSidebarBg?.value, "#061a33"),
    pageBg: normalizeHexColor(uiStylePageBg?.value, "#f4f7fb"),
    cardBg: normalizeHexColor(uiStyleCardBg?.value, "#ffffff"),
    radius: String(uiStyleRadius?.value || "16"),
  };
}

function setUiStyleFormValues(config = {}) {
  if (uiStyleFontFamily) uiStyleFontFamily.value = String(config.fontFamily || getDefaultUiStyleConfig().fontFamily);
  if (uiStylePrimaryColor) uiStylePrimaryColor.value = normalizeHexColor(config.primaryColor, "#0969da");
  if (uiStyleSidebarBg) uiStyleSidebarBg.value = normalizeHexColor(config.sidebarBg, "#061a33");
  if (uiStylePageBg) uiStylePageBg.value = normalizeHexColor(config.pageBg, "#f4f7fb");
  if (uiStyleCardBg) uiStyleCardBg.value = normalizeHexColor(config.cardBg, "#ffffff");
  if (uiStyleRadius) uiStyleRadius.value = String(config.radius || "16");
}

function detectUiStylePreset(config = {}) {
  const matched = UI_STYLE_PRESETS.find((preset) =>
    preset.fontFamily === String(config.fontFamily || "")
    && preset.primaryColor.toLowerCase() === String(config.primaryColor || "").toLowerCase()
    && preset.sidebarBg.toLowerCase() === String(config.sidebarBg || "").toLowerCase()
    && preset.pageBg.toLowerCase() === String(config.pageBg || "").toLowerCase()
    && preset.cardBg.toLowerCase() === String(config.cardBg || "").toLowerCase()
  );
  return matched?.id || "custom";
}

function applyUiStyleConfig(config = {}) {
  const root = document.documentElement;
  const merged = {
    ...getDefaultUiStyleConfig(),
    ...config,
    primaryColor: normalizeHexColor(config.primaryColor, "#0969da"),
    sidebarBg: normalizeHexColor(config.sidebarBg, "#061a33"),
    pageBg: normalizeHexColor(config.pageBg, "#f4f7fb"),
    cardBg: normalizeHexColor(config.cardBg, "#ffffff"),
    radius: String(config.radius || "16"),
  };
  root.style.setProperty("--blue", merged.primaryColor);
  root.style.setProperty("--blue-soft", toRgba(merged.primaryColor, 0.11));
  root.style.setProperty("--nav-active", toRgba(merged.primaryColor, 0.16));
  root.style.setProperty("--nav-hover", toRgba(merged.primaryColor, 0.08));
  root.style.setProperty("--sidebar-bg", merged.sidebarBg);
  root.style.setProperty("--page-bg", merged.pageBg);
  root.style.setProperty("--card-bg", merged.cardBg);
  root.style.setProperty("--shadow", `0 14px 34px ${toRgba(merged.primaryColor, 0.14)}`);
  root.style.setProperty("--ui-radius", `${Math.max(10, Math.min(24, Number(merged.radius) || 16))}px`);
  if (document.body) document.body.style.fontFamily = merged.fontFamily;
  activeUiStylePresetId = detectUiStylePreset(merged);
  if (uiStylePreviewFontLabel) {
    uiStylePreviewFontLabel.textContent = String(merged.fontFamily).split(",")[0].replace(/['"]/g, "");
  }
  if (uiStylePreviewPaletteLabel) {
    const preset = UI_STYLE_PRESETS.find((item) => item.id === activeUiStylePresetId);
    uiStylePreviewPaletteLabel.textContent = preset?.name || "Ozel";
  }
  renderUiStylePresets();
}

function saveUiStyleConfig(config = {}) {
  try {
    localStorage.setItem(UI_STYLE_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error("UI style config kaydedilemedi", error);
  }
}

function loadUiStyleConfig() {
  try {
    const raw = localStorage.getItem(UI_STYLE_STORAGE_KEY);
    if (!raw) return getDefaultUiStyleConfig();
    return { ...getDefaultUiStyleConfig(), ...JSON.parse(raw) };
  } catch (error) {
    console.error("UI style config okunamadi", error);
    return getDefaultUiStyleConfig();
  }
}

function renderUiStylePresets() {
  if (!uiStylePresetList) return;
  uiStylePresetList.innerHTML = UI_STYLE_PRESETS.map((preset) => `
    <button class="settings-style-preset ${preset.id === activeUiStylePresetId ? "is-active" : ""}" type="button" data-ui-style-preset="${preset.id}">
      <div class="settings-style-preset-swatches">
        <span style="background:${escapeHtml(preset.primaryColor)}"></span>
        <span style="background:${escapeHtml(preset.sidebarBg)}"></span>
        <span style="background:${escapeHtml(preset.pageBg)}"></span>
        <span style="background:${escapeHtml(preset.cardBg)}"></span>
      </div>
      <div>
        <strong>${escapeHtml(preset.name)}</strong>
        <small>${escapeHtml(String(preset.fontFamily).split(",")[0].replace(/['"]/g, ""))}</small>
      </div>
    </button>
  `).join("");
}

function initializeUiStyleSettings() {
  const saved = loadUiStyleConfig();
  setUiStyleFormValues(saved);
  applyUiStyleConfig(saved);
  uiStylePresetList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ui-style-preset]");
    if (!button) return;
    const preset = UI_STYLE_PRESETS.find((item) => item.id === button.dataset.uiStylePreset);
    if (!preset) return;
    setUiStyleFormValues(preset);
    applyUiStyleConfig(preset);
  });
  uiStyleForm?.addEventListener("input", () => {
    applyUiStyleConfig(getUiStyleConfigFromForm());
  });
  uiStyleResetBtn?.addEventListener("click", () => {
    const defaults = getDefaultUiStyleConfig();
    setUiStyleFormValues(defaults);
    applyUiStyleConfig(defaults);
    saveUiStyleConfig(defaults);
  });
  uiStyleSaveBtn?.addEventListener("click", () => {
    const config = getUiStyleConfigFromForm();
    applyUiStyleConfig(config);
    saveUiStyleConfig(config);
    window.alert("Arayuz stili kaydedildi.");
  });
}

function setDefaultDates() {
  const today = new Date().toISOString().slice(0, 10);
  forms.offer?.querySelectorAll("input[type='date']").forEach((input) => {
    if (!input.value) input.value = today;
  });
  quickOrderForm?.querySelectorAll("input[type='date']").forEach((input) => {
    if (!input.value) input.value = today;
  });
  syncOfferDeliveryDate();
  forms.movement?.querySelectorAll("input[type='date']").forEach((input) => {
    if (!input.value) input.value = today;
  });
}

function syncOfferDeliveryDate() {
  const orderDateInput = forms.offer?.querySelector("[name='orderDate']");
  const termDaysInput = forms.offer?.querySelector("[name='termDays']");
  const deliveryDateInput = forms.offer?.querySelector("[name='deliveryDate']");
  if (!orderDateInput || !termDaysInput || !deliveryDateInput) return;
  const orderDate = String(orderDateInput.value || "").trim();
  if (!orderDate) return;
  const termDays = Math.max(0, Number(termDaysInput.value || 0) || 0);
  const baseDate = new Date(`${orderDate}T00:00:00`);
  if (Number.isNaN(baseDate.getTime())) return;
  baseDate.setDate(baseDate.getDate() + termDays + 1);
  deliveryDateInput.value = baseDate.toISOString().slice(0, 10);
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

function parseMoneyInputLegacy(value) {
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

function parseDecimalInputLegacy(value) {
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
    const isManualMode = Boolean(offerNoManualToggle?.checked);
    offerNoDisplay.readOnly = !isManualMode;
    if (isManualMode) {
      const currentValue = String(offerNoDisplay.value || "").trim();
      if (!currentValue || currentValue.startsWith("SLV-TKF-") || currentValue.startsWith("MNL-TKF-")) {
        offerNoDisplay.value = generateManualOfferNo();
      }
    } else {
      offerNoDisplay.value = generateOfferNo();
    }
  }
  const defaultCari = (cache.cari || [])[0];
  if (defaultCari && offerDiscountRateInput && !offerDiscountRateInput.value) {
    offerDiscountRateInput.value = String(defaultCari.discountRate || 0);
  }
  syncOfferDeliveryDate();
  recalcOfferSummary();
}

function createDefaultOfferRows() {
  return [];
}

function initializeOfferLines(rows) {
  if (!offerLinesContainer) return;
  clearOfferLineEditMode();
  offerLinesContainer.innerHTML = "";
  rows.forEach((row) => appendOfferLine(row));
  renumberOfferLineRows();
  resetOfferLineInputs();
  recalcOfferSummary();
}

function setOfferLineButtonMode(isEditing = false) {
  if (!addOfferLineBtn) return;
  addOfferLineBtn.textContent = isEditing ? "Guncelle" : "Ekle";
  addOfferLineBtn.classList.toggle("is-update-mode", Boolean(isEditing));
}

function clearOfferLineEditMode() {
  editingOfferLineElement?.classList.remove("is-editing");
  editingOfferLineElement = null;
  setOfferLineButtonMode(false);
}

function resetOfferEditMode() {
  editingOfferId = null;
  clearOfferLineEditMode();
  const title = document.querySelector("#offerFormSection h2");
  const submitBtn = forms.offer?.querySelector(".form-submit");
  if (title) title.textContent = "Yeni Teklif Ekle";
  if (submitBtn) submitBtn.textContent = "Teklifi Kaydet";
}

function openOfferForEdit(offerId) {
  const offer = (cache.offers || []).find((item) => Number(item.id) === Number(offerId));
  if (!offer) {
    window.alert("Duzenlenecek teklif bulunamadi.");
    return;
  }
  if (["converted", "cancelled", "rejected"].includes(normalizeOfferStatusKey(offer.status))) {
    window.alert("Bu durumdaki teklifler duzenlenemez.");
    return;
  }

  editingOfferId = offer.id;
  setActiveView("offers");
  currentOffersSubview = "form";
  applyOffersSubview(currentOffersSubview);

  if (offerCariSelect) offerCariSelect.value = String(offer.cariId || "");
  const formType = forms.offer?.querySelector("[name='formType']");
  const orderDate = forms.offer?.querySelector("[name='orderDate']");
  const termDays = forms.offer?.querySelector("[name='termDays']");
  const deliveryDate = forms.offer?.querySelector("[name='deliveryDate']");
  const shipment = forms.offer?.querySelector("[name='shipment']");
  const discountRate = forms.offer?.querySelector("[name='discountRate']");
  const vatRate = forms.offer?.querySelector("[name='vatRate']");
  const contractText = forms.offer?.querySelector("[name='contractText']");
  if (formType) formType.value = offer.meta?.formType || "Teklif Formu";
  if (orderDate) orderDate.value = String(offer.orderDate || "").slice(0, 10);
  if (termDays) termDays.value = String(offer.termDays || 0);
  if (deliveryDate) deliveryDate.value = String(offer.deliveryDate || "").slice(0, 10);
  if (shipment) shipment.value = offer.shipment || "";
  if (discountRate) discountRate.value = String(offer.discountRate ?? offer.meta?.discountRate ?? 0);
  if (vatRate) vatRate.value = String(offer.meta?.vatRate ?? 20);
  if (contractText) contractText.value = offer.contractText || offer.meta?.notes || "";
  if (offerNoDisplay) {
    offerNoDisplay.value = offer.offerNo || "";
    offerNoDisplay.readOnly = true;
  }
  if (offerNoManualToggle) offerNoManualToggle.checked = false;

  initializeOfferLines((offer.items?.length ? offer.items : offer.meta?.rows || []).map((row) => ({
    productId: row.productId || row.product_id || null,
    variantId: row.variantId || row.variant_id || null,
    materialGroup: row.materialGroup || row.material_group || "",
    materialType: row.materialType || row.material_type || "",
    coatingType: row.coatingType || row.coating_type || "",
    thicknessMm: row.thicknessMm || row.thickness_mm || null,
    modelName: row.modelName || row.model_name || row.coverType || "",
    coverType: row.coverType || row.cover_type || row.modelName || "",
    color: row.color || "",
    woodType: row.woodType || row.wood_type || "",
    width: Number(row.widthMm ?? row.width_mm ?? row.width ?? 0),
    height: Number(row.heightMm ?? row.height_mm ?? row.height ?? 0),
    widthMm: Number(row.widthMm ?? row.width_mm ?? row.width ?? 0),
    heightMm: Number(row.heightMm ?? row.height_mm ?? row.height ?? 0),
    length: Number(row.length || 0),
    quantity: Number(row.quantity || 1),
    calculatedQuantity: Number(row.calculatedQuantity ?? row.calculated_quantity ?? row.m2 ?? row.quantity ?? 0),
    calculationType: normalizeProductCalculationType(row.calculationType || row.calculation_type || (isPieceUnit(row.unit) ? "piece" : "sqm")),
    m2: Number(row.m2 || 0),
    unit: row.unit || "M2",
    unitPrice: Number(row.unitPrice ?? row.unit_price ?? 0),
    total: Number(row.total || 0),
    variantSummary: row.variantSummary || row.variant_summary || "",
    note: row.note || "",
  })));

  const title = document.querySelector("#offerFormSection h2");
  const submitBtn = forms.offer?.querySelector(".form-submit");
  if (title) title.textContent = `Teklifi Duzenle: ${offer.offerNo || `#${offer.id}`}`;
  if (submitBtn) submitBtn.textContent = "Teklifi Guncelle";
  forms.offer?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function appendOfferLine(row = null) {
  if (!offerLinesContainer) return;
  const payload = row || getOfferLineInputValues();
  if (!payload) {
    window.alert("Kategoriler bolumunden once bir urun secin; sonra olcu, adet ve model ismini girip ekleyin.");
    return;
  }
  if (!row && editingOfferLineElement?.isConnected) {
    editingOfferLineElement.dataset.row = JSON.stringify(payload);
    const rowIndex = [...offerLinesContainer.querySelectorAll(".offer-line-row")].indexOf(editingOfferLineElement) + 1;
    editingOfferLineElement.innerHTML = createOfferLineMarkup(payload, rowIndex);
    clearOfferLineEditMode();
    resetOfferLineInputs();
    renumberOfferLineRows();
    recalcOfferSummary();
    offerLineInputs.height?.focus();
    offerLineInputs.height?.select?.();
    return;
  }
  const wrapper = document.createElement("div");
  wrapper.className = "offer-line-row";
  wrapper.dataset.row = JSON.stringify(payload);
  wrapper.innerHTML = createOfferLineMarkup(payload);
  offerLinesContainer.appendChild(wrapper);
  renumberOfferLineRows();
  resetOfferLineInputs();
  recalcOfferSummary();
  offerLineInputs.height?.focus();
  offerLineInputs.height?.select?.();
}

function createOfferLineMarkup(row = {}, rowIndexOverride = null) {
  const rowIndex = rowIndexOverride || (offerLinesContainer?.querySelectorAll(".offer-line-row").length || 0) + 1;
  const total = Number(row.total || 0);
  const widthMm = Number(row.widthMm ?? row.width_mm ?? row.width ?? 0);
  const heightMm = Number(row.heightMm ?? row.height_mm ?? row.height ?? 0);
  const materialGroup = String(row.materialGroup || "").trim();
  const modelName = String(row.modelName || row.coverType || "").trim();
  const calculationType = normalizeProductCalculationType(row.calculationType || row.calculation_type || (isPieceUnit(row.unit) ? "piece" : "sqm"));
  const calculatedQuantity = Number(row.calculatedQuantity ?? row.calculated_quantity ?? row.m2 ?? 0);
  const measurementLabel = calculationType === "linear_meter" ? `${Number(row.length || 0)} mtul` : "-";
  const variantSummary = String(
    row.variantSummary
    || [row.materialType, row.coatingType, row.thicknessMm ? `${row.thicknessMm} mm` : "", row.woodType].filter(Boolean).join(" / ")
  ).trim();
  return `
    <span class="is-index">${rowIndex}</span>
    <span>${calculationType === "sqm" ? heightMm : measurementLabel}</span>
    <span>${calculationType === "sqm" ? widthMm : "-"}</span>
    <span>${Number(row.quantity || 0)}</span>
    <span>${calculationType === "sqm" ? Number(row.m2 || 0).toFixed(3) : `${calculatedQuantity.toFixed(2)} ${escapeHtml(row.unit || getOfferCalculationUnit(calculationType))}`}</span>
    <span class="is-type">${escapeHtml(modelName || "-")}</span>
    <span class="is-model">${escapeHtml(materialGroup || "-")}</span>
    <span class="is-note">${escapeHtml(variantSummary || "-")}</span>
    <span class="is-color">${escapeHtml(row.color || "-")}</span>
    <span class="is-money">${formatCurrency(row.unitPrice || 0)}</span>
    <span class="is-money">${formatCurrency(total)}</span>
    <span class="is-note">${escapeHtml(row.note || "-")}</span>
    <span class="offer-line-actions">
      <button class="offer-line-action offer-line-edit" type="button" data-line-edit="1" title="Duzenle" aria-label="Duzenle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"></path>
        </svg>
      </button>
      <button class="offer-line-action offer-line-delete" type="button" data-line-delete="1" title="Sil" aria-label="Sil">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 6h18"></path>
          <path d="M8 6V4h8v2"></path>
          <path d="M19 6l-1 14H6L5 6"></path>
          <path d="M10 11v6"></path>
          <path d="M14 11v6"></path>
        </svg>
      </button>
    </span>
  `;
}

function createOfferMaterialOptions(selectedValue) {
  const value = String(selectedValue || "").trim();
  if (!value) {
    return `<option value="">Soldan urun secin</option>`;
  }
  return `<option value="${escapeHtml(value)}" selected>${escapeHtml(value)}</option>`;
}

function getOfferSelectedProduct() {
  return (cache.products || []).find((item) => Number(item.id) === Number(selectedOfferProductId)) || null;
}

function syncOfferVariantDatalist(id, values = []) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))]
    .map((value) => `<option value="${escapeHtml(value)}"></option>`)
    .join("");
}

function getOfferVariantSelectionState() {
  return {
    materialType: String(offerLineInputs.variantMaterial?.value || "").trim(),
    coatingType: String(offerLineInputs.variantCoating?.value || "").trim(),
    thicknessMm: String(offerLineInputs.variantThickness?.value || "").trim(),
    color: String(offerLineInputs.color?.value || "").trim(),
    woodType: String(offerLineInputs.variantWoodType?.value || "").trim(),
  };
}

function filterOfferVariants(product, selection = {}) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  return variants.filter((variant) => {
    if (selection.materialType && variant.materialType !== selection.materialType) return false;
    if (selection.coatingType && variant.coatingType !== selection.coatingType) return false;
    if (selection.thicknessMm && String(variant.thicknessMm || "") !== String(selection.thicknessMm)) return false;
    if (selection.color && variant.color !== selection.color) return false;
    if (selection.woodType && variant.woodType !== selection.woodType) return false;
    return true;
  });
}

function getOfferVariantOptions(product, selection = {}) {
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const makeOptions = (field, dependsOn = {}) => [...new Set(
    filterOfferVariants(product, dependsOn)
      .map((variant) => {
        if (field === "thicknessMm") return variant.thicknessMm;
        return variant[field];
      })
      .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
      .map((value) => String(value))
  )];

  return {
    materialType: makeOptions("materialType"),
    coatingType: makeOptions("coatingType", { materialType: selection.materialType }),
    thicknessMm: makeOptions("thicknessMm", { materialType: selection.materialType, coatingType: selection.coatingType }),
    color: makeOptions("color", { materialType: selection.materialType, coatingType: selection.coatingType, thicknessMm: selection.thicknessMm }),
    woodType: makeOptions("woodType", {
      materialType: selection.materialType,
      coatingType: selection.coatingType,
      thicknessMm: selection.thicknessMm,
      color: selection.color,
    }),
  };
}

function resolveSelectedOfferVariant(product, selection = {}) {
  const variants = filterOfferVariants(product, selection);
  if (!variants.length) return null;
  if (variants.length === 1) return variants[0];
  return variants.find((variant) => variant.isDefault) || variants[0];
}

function fillOfferVariantInputs(variant = null, keepUserEntries = false) {
  if (!variant) return;
  if (offerLineInputs.variantMaterial && (!keepUserEntries || !offerLineInputs.variantMaterial.value)) {
    offerLineInputs.variantMaterial.value = variant.materialType || "";
  }
  if (offerLineInputs.variantCoating && (!keepUserEntries || !offerLineInputs.variantCoating.value)) {
    offerLineInputs.variantCoating.value = variant.coatingType || "";
  }
  if (offerLineInputs.variantThickness && (!keepUserEntries || !offerLineInputs.variantThickness.value)) {
    offerLineInputs.variantThickness.value = variant.thicknessMm || "";
  }
  if (offerLineInputs.color && (!keepUserEntries || !offerLineInputs.color.value)) {
    offerLineInputs.color.value = variant.color || "";
  }
  if (offerLineInputs.variantWoodType && (!keepUserEntries || !offerLineInputs.variantWoodType.value)) {
    offerLineInputs.variantWoodType.value = variant.woodType || "";
  }
}

function syncOfferVariantFields(forceDefault = false) {
  const product = getOfferSelectedProduct();
  const variantFields = [...document.querySelectorAll("[data-offer-variant-field]")];
  if (!product?.hasVariants || !(product.variants || []).length) {
    selectedOfferVariantId = null;
    variantFields.forEach((field) => {
      field.hidden = true;
      const input = field.querySelector("input, select");
      if (input) input.value = "";
    });
    return;
  }

  variantFields.forEach((field) => { field.hidden = false; });
  const currentSelection = forceDefault ? {} : getOfferVariantSelectionState();
  const options = getOfferVariantOptions(product, currentSelection);
  syncOfferVariantDatalist("offerVariantMaterialList", options.materialType);
  syncOfferVariantDatalist("offerVariantCoatingList", options.coatingType);
  syncOfferVariantDatalist("offerVariantColorList", options.color);
  syncOfferVariantDatalist("offerVariantWoodTypeList", options.woodType);

  const exactVariant = resolveSelectedOfferVariant(product, currentSelection);
  const matchingVariant = exactVariant || resolveSelectedOfferVariant(product, {});
  fillOfferVariantInputs(matchingVariant, !forceDefault && Boolean(exactVariant));
  selectedOfferVariantId = matchingVariant?.id || null;
  if (offerLineInputs.unitPrice && matchingVariant) {
    offerLineInputs.unitPrice.value = formatMoneyInputValue(getResolvedVariantUnitPrice(product, matchingVariant));
  }
}

function renderOfferProductsPicker(products) {
  if (!offerProductsList) return;
  const searchTerm = offerProductSearch?.value?.trim().toLowerCase() || "";
  const onlyCovers = Boolean(offerOnlyCovers?.checked);
  const selectedCategory = offerProductCategorySelect?.value || "";
  const activeProducts = (products || []).filter((item) => item.isActive !== false);
  if (offerProductCategorySelect) {
    const categories = collectProductCategories(activeProducts || []);
    const currentValue = offerProductCategorySelect.value || "";
    offerProductCategorySelect.innerHTML = `
      <option value="">Tum kategoriler</option>
      ${categories.map((category) => `<option value="${escapeHtml(category)}" ${category === currentValue ? "selected" : ""}>${escapeHtml(category)}</option>`).join("")}
    `;
  }
  const filtered = (activeProducts || []).filter((item) => {
    if (item.isActive === false) return false;
    const haystack = [item.name, item.category, item.costNotes, getProductCalculationLabel(item.calculationType)].join(" ").toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    const matchesCoverFilter = !onlyCovers || haystack.includes("kapak") || haystack.includes("panjur");
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCoverFilter && matchesCategory;
  });
  const groups = filtered.reduce((acc, item) => {
    const key = item.category || "Kategorisiz";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const categoryNames = Object.keys(groups).sort((left, right) => left.localeCompare(right, "tr"));
  if (searchTerm) {
    expandedOfferProductCategories = expandedOfferProductCategories.filter((name) => categoryNames.includes(name));
  } else {
    expandedOfferProductCategories = expandedOfferProductCategories.filter((name) => categoryNames.includes(name));
  }

  offerProductsList.innerHTML = categoryNames.length ? categoryNames.map((category) => {
    const items = groups[category] || [];
    const isOpen = selectedCategory === category || expandedOfferProductCategories.includes(category);
    const categoryIcon = String(category || "K")
      .split(" ")
      .map((part) => part[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
    return `
      <section class="offer-product-category ${isOpen ? "is-open" : ""}">
        <button class="offer-product-category-toggle" type="button" data-offer-category-toggle="${escapeHtml(category)}">
          <div class="offer-product-category-text">
            <span class="offer-product-category-icon" aria-hidden="true">${escapeHtml(categoryIcon)}</span>
            <span class="offer-product-category-copy">
              <strong>${escapeHtml(category)}</strong>
              <small>${items.length} urun</small>
            </span>
          </div>
          <span class="offer-product-category-arrow" aria-hidden="true">${isOpen ? "−" : "+"}</span>
        </button>
        <div class="offer-product-category-items" ${isOpen ? "" : "hidden"}>
          ${items.map((item) => {
            const defaultVariant = getDefaultProductVariant(item);
            const displayPrice = defaultVariant ? getResolvedVariantUnitPrice(item, defaultVariant) : getProductBaseUnitPrice(item);
            return `
            <button class="offer-product-item" type="button"
              data-product-id="${item.id}"
              data-product-name="${escapeHtml(item.name)}"
              data-product-category="${escapeHtml(item.category || "")}"
              data-product-unit="${escapeHtml(item.costType || item.unit || "M2")}"
              data-product-calculation-type="${escapeHtml(item.calculationType || "piece")}"
              data-product-price="${displayPrice}"
              data-product-default-variant-id="${defaultVariant?.id || ""}">
              <span class="offer-product-item-visual" aria-hidden="true">${escapeHtml(String(item.name || "U").slice(0, 1).toUpperCase())}</span>
              <span class="offer-product-item-copy">
                <strong>${escapeHtml(item.name)}</strong>
                <span>${escapeHtml(item.category || "Urun")}</span>
                <small>${escapeHtml(getProductCalculationLabel(item.calculationType))} | ${escapeHtml(item.costType || item.unit || "M2")} | ${(item.variants || []).length} varyasyon | Birim ${formatCurrency(displayPrice)}</small>
              </span>
              <span class="offer-product-item-pill">Sec</span>
            </button>
          `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("") : `<div class="entity-card empty-state">Urun bulunamadi. Once Urunler sayfasindan kayit ekleyin.</div>`;
}

function handleOfferProductPick(event) {
  const toggleButton = event.target.closest("[data-offer-category-toggle]");
  if (toggleButton) {
    const category = toggleButton.dataset.offerCategoryToggle || "";
    expandedOfferProductCategories = expandedOfferProductCategories.includes(category) ? [] : [category];
    renderOfferProductsPicker(cache.products || []);
    return;
  }
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  selectedOfferProductId = Number(button.dataset.productId || 0) || null;
  selectedOfferProductName = button.dataset.productName || "";
  selectedOfferProductCategory = button.dataset.productCategory || "";
  selectedOfferProductUnit = button.dataset.productUnit || "M2";
  selectedOfferProductCalculationType = PRODUCT_CALCULATION_TYPES.includes(button.dataset.productCalculationType || "")
    ? button.dataset.productCalculationType
    : (isPieceUnit(selectedOfferProductUnit) ? "piece" : "sqm");
  if (offerLineInputs.materialGroup) {
    const materialValue = selectedOfferProductCalculationType === "piece" ? (button.dataset.productCategory || selectedOfferProductName) : selectedOfferProductName;
    offerLineInputs.materialGroup.innerHTML = createOfferMaterialOptions(materialValue);
  }
  if (offerLineInputs.modelName) {
    offerLineInputs.modelName.value = selectedOfferProductCalculationType === "piece" ? selectedOfferProductName : "";
  }
  if (offerLineInputs.unitPrice) offerLineInputs.unitPrice.value = formatMoneyInputValue(button.dataset.productPrice || 0);
  if (offerSelectedProductLabel) {
    const unitHint = {
      sqm: "En, boy, adet, cins ve renk girerek hesaplanir.",
      piece: "Sadece adet girerek listeye ekleyebilirsiniz.",
      linear_meter: "Uzunluk ve adet girerek metretul hesaplanir.",
      fixed: "Aciklama ve adet girerek sabit kalem eklenir.",
      labor: "Saat/adet ve aciklama girerek iscilik kalemi eklenir.",
    }[selectedOfferProductCalculationType] || "Bilgileri girip listeye ekleyin.";
    offerSelectedProductLabel.textContent = `${button.dataset.productCategory || "Kategori"} / ${button.dataset.productName || "Urun"} secildi. ${unitHint}`;
  }
  selectedOfferProductUnit = getOfferCalculationUnit(selectedOfferProductCalculationType);
  selectedOfferVariantId = Number(button.dataset.productDefaultVariantId || 0) || null;
  setOfferMeasurementInputsForUnit(selectedOfferProductUnit);
  syncOfferVariantFields(true);
  offerProductsList.querySelectorAll(".offer-product-item").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
}

function handleOfferProductDoublePick(event) {
  const button = event.target.closest("[data-product-id]");
  if (!button) return;
  handleOfferProductPick(event);
  appendOfferLine();
}

function handleOfferLineDelete(event) {
  const button = event.target.closest("[data-line-delete]");
  if (!button) return;
  const rowElement = button.closest(".offer-line-row");
  if (rowElement && rowElement === editingOfferLineElement) {
    clearOfferLineEditMode();
    resetOfferLineInputs();
  }
  rowElement?.remove();
  renumberOfferLineRows();
  recalcOfferSummary();
}

function handleOfferLineEdit(event) {
  const button = event.target.closest("[data-line-edit]");
  if (!button) return;
  const rowElement = button.closest(".offer-line-row");
  if (!rowElement) return;
  let row = null;
  try {
    row = JSON.parse(rowElement.dataset.row || "{}");
  } catch {
    row = null;
  }
  if (!row) return;

  clearOfferLineEditMode();
  editingOfferLineElement = rowElement;
  editingOfferLineElement.classList.add("is-editing");
  setOfferLineButtonMode(true);
  selectedOfferProductName = String(row.materialGroup || "").trim() || selectedOfferProductName;
  selectedOfferProductUnit = String(row.unit || selectedOfferProductUnit || "M2");
  selectedOfferProductCalculationType = normalizeProductCalculationType(row.calculationType || row.calculation_type || (isPieceUnit(selectedOfferProductUnit) ? "piece" : "sqm"));
  selectedOfferProductId = Number(row.productId || row.product_id || 0) || null;
  selectedOfferVariantId = Number(row.variantId || row.variant_id || 0) || null;
  if (offerLineInputs.height) offerLineInputs.height.value = String(row.heightMm ?? row.height_mm ?? row.height ?? "");
  if (offerLineInputs.width) offerLineInputs.width.value = String(row.widthMm ?? row.width_mm ?? row.width ?? "");
  if (offerLineInputs.length) offerLineInputs.length.value = String(row.length || "");
  if (offerLineInputs.quantity) offerLineInputs.quantity.value = String(row.quantity || 1);
  if (offerLineInputs.materialGroup) {
    offerLineInputs.materialGroup.innerHTML = createOfferMaterialOptions(selectedOfferProductName);
  }
  if (offerLineInputs.variantMaterial) offerLineInputs.variantMaterial.value = String(row.materialType || row.material_type || "");
  if (offerLineInputs.variantCoating) offerLineInputs.variantCoating.value = String(row.coatingType || row.coating_type || "");
  if (offerLineInputs.variantThickness) offerLineInputs.variantThickness.value = row.thicknessMm || row.thickness_mm || "";
  if (offerLineInputs.modelName) offerLineInputs.modelName.value = String(row.modelName || row.coverType || "");
  if (offerLineInputs.color) offerLineInputs.color.value = String(row.color || "");
  if (offerLineInputs.variantWoodType) offerLineInputs.variantWoodType.value = String(row.woodType || row.wood_type || "");
  if (offerLineInputs.length) offerLineInputs.length.value = String(row.length || "");
  if (offerLineInputs.unitPrice) offerLineInputs.unitPrice.value = formatMoneyInputValue(row.unitPrice || 0);
  if (offerLineInputs.note) offerLineInputs.note.value = String(row.note || "");
  if (offerSelectedProductLabel && selectedOfferProductName) {
    offerSelectedProductLabel.textContent = `${selectedOfferProductName} satiri duzenleme icin yuklendi. Degisikligi yapip tekrar ekleyin.`;
  }
  setOfferMeasurementInputsForUnit(selectedOfferProductUnit);
  syncOfferVariantFields();
  offerProductsList?.querySelectorAll(".offer-product-item").forEach((item) => {
    item.classList.toggle("active", Number(item.dataset.productId || 0) === Number(selectedOfferProductId || 0));
  });
  offerLineInputs.height?.focus();
  offerLineInputs.height?.select?.();
}

function renumberOfferLineRows() {
  offerLinesContainer?.querySelectorAll(".offer-line-row").forEach((row, index) => {
    const cell = row.querySelector(".is-index");
    if (cell) cell.textContent = String(index + 1);
  });
}

function isPieceUnit(unit = "") {
  const normalized = String(unit || "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, " ");
  return normalized === "adet" || normalized.includes("adet");
}

function getOfferCalculationUnit(calculationType = "sqm") {
  const type = normalizeProductCalculationType(calculationType);
  if (type === "sqm") return "M2";
  if (type === "linear_meter") return "Metretul";
  if (type === "labor") return "Saat";
  return "Adet";
}

function getOfferCalculatedQuantity({ calculationType = "sqm", width = 0, height = 0, length = 0, quantity = 1 }) {
  const type = normalizeProductCalculationType(calculationType);
  const safeQuantity = Math.max(1, Number(quantity || 0) || 1);
  if (type === "sqm") return Math.max(0, Number(width || 0) * Number(height || 0) * safeQuantity / 1000000);
  if (type === "linear_meter") return Math.max(0, Number(length || 0) * safeQuantity / 1000);
  return safeQuantity;
}

function setOfferCalcFieldVisibility(calculationType = "sqm") {
  const type = normalizeProductCalculationType(calculationType);
  const visibleFields = {
    sqm: ["width", "height", "quantity", "color"],
    piece: ["quantity"],
    linear_meter: ["length", "quantity"],
    fixed: ["quantity", "note"],
    labor: ["quantity", "note"],
  }[type] || ["width", "height", "quantity", "color"];

  document.querySelectorAll("[data-offer-calc-field]").forEach((field) => {
    const key = field.dataset.offerCalcField || "";
    const isVisible = visibleFields.includes(key);
    field.hidden = !isVisible;
    const input = field.querySelector("input, select, textarea");
    if (!input) return;
    input.disabled = !isVisible;
    input.required = false;
    if (!isVisible && key !== "color") input.value = "";
  });

  if (offerLineInputs.quantity) {
    offerLineInputs.quantity.min = "1";
    offerLineInputs.quantity.placeholder = type === "labor" ? "Saat / adet" : "Adet";
  }
}

function setOfferMeasurementInputsForUnit(unit = "") {
  const pieceUnit = isPieceUnit(unit);
  [offerLineInputs.height, offerLineInputs.width].forEach((input) => {
    if (!input) return;
    input.required = false;
    input.disabled = pieceUnit;
    input.placeholder = pieceUnit ? "Gerekmez" : (input === offerLineInputs.height ? "Boy" : "En");
    if (pieceUnit) input.value = "";
  });
  setOfferCalcFieldVisibility(selectedOfferProductCalculationType);
}

function getOfferLineInputValues() {
  const width = Number(offerLineInputs.width?.value || 0);
  const height = Number(offerLineInputs.height?.value || 0);
  const length = Number(offerLineInputs.length?.value || 0);
  const quantity = Number(offerLineInputs.quantity?.value || 0);
  const materialGroup = offerLineInputs.materialGroup?.value || "";
  const materialType = offerLineInputs.variantMaterial?.value?.trim() || "";
  const coatingType = offerLineInputs.variantCoating?.value?.trim() || "";
  const thicknessMm = offerLineInputs.variantThickness?.value?.trim() || "";
  const modelName = offerLineInputs.modelName?.value?.trim() || "";
  const color = offerLineInputs.color?.value?.trim() || "";
  const woodType = offerLineInputs.variantWoodType?.value?.trim() || "";
  const unitPrice = parseMoneyInput(offerLineInputs.unitPrice?.value || 0);
  const note = offerLineInputs.note?.value?.trim() || "";
  const calculationType = normalizeProductCalculationType(selectedOfferProductCalculationType);
  const unit = getOfferCalculationUnit(calculationType);
  const product = getOfferSelectedProduct();

  const needsArea = calculationType === "sqm";
  const needsLength = calculationType === "linear_meter";
  const needsNote = calculationType === "fixed" || calculationType === "labor";
  if (!selectedOfferProductName || !materialGroup || !quantity || !modelName || (needsArea && (!width || !height)) || (needsLength && !length) || (needsNote && !note)) {
    return null;
  }

  let variant = null;
  if (product?.hasVariants) {
    variant = resolveSelectedOfferVariant(product, { materialType, coatingType, thicknessMm, color, woodType });
    if (!variant) {
      window.alert("Secilen varyasyon kombinasyonu tanimli degil. Malzeme, kaplama, kalinlik ve renk secimlerini kontrol edin.");
      return null;
    }
  }

  const calculatedQuantity = getOfferCalculatedQuantity({ calculationType, width, height, length, quantity });
  const m2 = calculationType === "sqm" ? calculatedQuantity : 0;
  return {
    productId: selectedOfferProductId,
    variantId: variant?.id || selectedOfferVariantId || null,
    calculationType,
    width: calculationType === "sqm" ? width : 0,
    height: calculationType === "sqm" ? height : 0,
    widthMm: calculationType === "sqm" ? width : 0,
    heightMm: calculationType === "sqm" ? height : 0,
    length: calculationType === "linear_meter" ? length : 0,
    quantity,
    calculatedQuantity,
    m2,
    materialGroup,
    materialType,
    coatingType,
    thicknessMm: thicknessMm === "" ? null : Number(thicknessMm || 0),
    modelName,
    coverType: modelName,
    color,
    woodType,
    variantSummary: variant ? [variant.materialType, variant.coatingType, variant.thicknessMm ? `${variant.thicknessMm} mm` : "", variant.color, variant.woodType].filter(Boolean).join(" / ") : "",
    unitPrice,
    unit,
    total: calculatedQuantity * unitPrice,
    note,
  };
}

function resetOfferLineInputs() {
  setOfferMeasurementInputsForUnit(selectedOfferProductUnit);
  if (offerLineInputs.height) offerLineInputs.height.value = "";
  if (offerLineInputs.width) offerLineInputs.width.value = "";
  if (offerLineInputs.length) offerLineInputs.length.value = "";
  if (offerLineInputs.quantity) offerLineInputs.quantity.value = "1";
  if (offerLineInputs.materialGroup) {
    offerLineInputs.materialGroup.innerHTML = createOfferMaterialOptions(selectedOfferProductName);
  }
  if (offerLineInputs.variantMaterial) offerLineInputs.variantMaterial.value = "";
  if (offerLineInputs.variantCoating) offerLineInputs.variantCoating.value = "";
  if (offerLineInputs.variantThickness) offerLineInputs.variantThickness.value = "";
  if (offerLineInputs.color) offerLineInputs.color.value = "";
  if (offerLineInputs.variantWoodType) offerLineInputs.variantWoodType.value = "";
  selectedOfferVariantId = null;
  if (offerLineInputs.note) offerLineInputs.note.value = "";
  syncOfferVariantFields(true);
  if (offerSelectedProductLabel && !selectedOfferProductName) {
    offerSelectedProductLabel.textContent = "Sol listeden bir urun secin. Secilen urun bilgileri burada dolacaktir.";
  }
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

function sanitizeOfferRowForPersistence(row = {}) {
  const calculationType = normalizeProductCalculationType(row.calculationType || row.calculation_type || (isPieceUnit(row.unit || "") ? "piece" : "sqm"));
  const width = calculationType === "sqm" ? Math.max(0, Number(row.widthMm ?? row.width_mm ?? row.width ?? 0)) : 0;
  const height = calculationType === "sqm" ? Math.max(0, Number(row.heightMm ?? row.height_mm ?? row.height ?? 0)) : 0;
  const length = calculationType === "linear_meter" ? Math.max(0, Number(row.length || 0)) : 0;
  const quantity = Math.max(1, Math.round(Number(row.quantity || 0) || 0));
  const unitPrice = Math.max(0, Number(row.unitPrice || 0) || 0);
  const materialGroup = String(row.materialGroup || "").trim();
  const materialType = String(row.materialType || row.material_type || "").trim();
  const coatingType = String(row.coatingType || row.coating_type || "").trim();
  const thicknessMm = row.thicknessMm ?? row.thickness_mm ?? null;
  const modelName = String(row.modelName || row.coverType || "").trim();
  const color = String(row.color || "").trim();
  const woodType = String(row.woodType || row.wood_type || "").trim();
  const note = String(row.note || "").trim();
  const calculatedQuantity = Math.max(0, Number(row.calculatedQuantity ?? row.calculated_quantity ?? getOfferCalculatedQuantity({ calculationType, width, height, length, quantity })) || 0);
  const m2 = calculationType === "sqm" ? calculatedQuantity : 0;
  const total = calculatedQuantity * unitPrice;

  return {
    productId: row.productId || row.product_id || null,
    variantId: row.variantId || row.variant_id || null,
    calculationType,
    width,
    height,
    widthMm: width,
    heightMm: height,
    length,
    quantity,
    calculatedQuantity,
    m2,
    materialGroup,
    materialType,
    coatingType,
    thicknessMm: thicknessMm === null || thicknessMm === "" ? null : Number(thicknessMm || 0),
    modelName,
    coverType: modelName,
    color,
    woodType,
    variantSummary: String(row.variantSummary || row.variant_summary || "").trim(),
    unitPrice,
    unit: row.unit || getOfferCalculationUnit(calculationType),
    total,
    note,
  };
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
      case STORES.crm:
        return normalizeCrmLeads(await api.crm.leads());
      case STORES.offers:
        return normalizeOffers(await api.offers.list());
      case STORES.orders:
        return normalizeOrders(await api.orders.list());
      case STORES.workOrders:
        return normalizeWorkOrders(await api.workOrders.list());
      case STORES.panjurJobs:
        return normalizePanjurJobs(await api.panjurJobs.list());
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
  } catch (error) {
    console.error(`[data-load] ${storeName} yuklenemedi`, error);
    return [];
  }
}

function buildOfferApiPayload(payload = {}) {
  return {
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
    items: (payload.items || []).map((item) => ({
      ...item,
      variant_id: item.variantId ?? item.variant_id ?? null,
      width_mm: item.widthMm ?? item.width_mm ?? item.width ?? 0,
      height_mm: item.heightMm ?? item.height_mm ?? item.height ?? 0,
      unit_price: item.unitPrice ?? item.unit_price ?? 0,
      variant_summary: item.variantSummary ?? item.variant_summary ?? "",
    })),
    status: payload.status,
  };
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
      return api.offers.create(buildOfferApiPayload(payload));
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
    case STORES.panjurJobs:
      return api.panjurJobs.delete(id);
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
  return runtime.loadStoreEntries(
    Object.entries(STORES),
    getAllRecords,
    (key, storeName, error) => {
      console.error(`[store-load] ${key}/${storeName} okunamadi`, error);
    },
  );
}

function sortCacheCollections(data = {}) {
  Object.keys(data).forEach((key) => {
    data[key] = runtime.sortRecordsByCreatedAt(data[key]);
  });
}

async function refreshUI() {
  cache = await loadAllStores();
  sortCacheCollections(cache);
  await ensureDemoFlow();
  sortCacheCollections(cache);
  runtime.runRenderQueue([
    ["dashboard", () => renderDashboard(cache)],
    ["crm", () => renderCrm(cache.crm || [])],
    ["cari", () => renderCari(cache.cari, cache.movements, cache.orders)],
    ["cari-select", () => renderCariSelect(cache.cari)],
    ["movement-cari-select", () => renderMovementCariSelect(cache.cari)],
    ["movements", () => renderMovements(cache.movements, cache.cari)],
    ["offers", () => renderOffers(cache.offers)],
    ["offers-shell", () => renderOfferDashboardShell(cache.offers)],
    ["offer-print-select", () => renderOfferPrintSelect(cache.offers)],
  ], reportRuntimeProblem);
  expandedOfferProductCategories = [];
  runtime.runRenderQueue([
    ["offer-products-picker", () => renderOfferProductsPicker(cache.products)],
    ["quick-order-products-picker", () => renderQuickOrderProductsPicker(cache.products)],
    ["orders", () => renderOrdersTable(cache.orders)],
    ["work-orders", () => renderWorkOrdersTable(cache.workOrders || [])],
    ["panjur-bridge", () => syncPanjurTemplateModule()],
    ["products", () => renderProducts(cache.products)],
    ["stocks", () => renderStocks(cache.stocks)],
    ["finance", () => renderFinance(cache.finance, cache.products, cache.orders)],
    ["reports", () => renderReports(cache)],
    ["personnel", () => renderPersonnel(cache.personnel)],
    ["cari-statements", () => renderCariStatements(cache.cari, cache.movements, cache.orders)],
    ["actions", () => bindActions()],
    ["cari-form-state", () => initializeCariFormFromStoredState()],
  ], reportRuntimeProblem);
}

function reportRuntimeProblem(scope, error) {
  const message = error?.message || String(error || "Bilinmeyen hata");
  console.error(`[ui-runtime] ${scope}`, error);
  if (authError && !getSession()) {
    authError.textContent = `Arayuz hatasi: ${message}`;
  }
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

function normalizeCrmLeads(rows = []) {
  return (rows || []).map((row) => ({
    id: row.id,
    leadNo: row.lead_no || row.leadNo || "",
    type: row.type || "lead",
    companyName: row.company_name || row.companyName || "",
    contactName: row.contact_name || row.contactName || "",
    phone: row.phone || "",
    email: row.email || "",
    city: row.city || "",
    district: row.district || "",
    address: row.address || "",
    source: row.source || "",
    status: row.status || "new",
    priority: row.priority || "normal",
    estimatedValue: Number(row.estimated_value ?? row.estimatedValue ?? 0),
    winProbability: Number(row.win_probability ?? row.winProbability ?? 0),
    nextFollowUpDate: row.next_follow_up_date || row.nextFollowUpDate || "",
    assignedTo: row.assigned_to || row.assignedTo || "",
    convertedCariId: row.converted_cari_id || row.convertedCariId || null,
    convertedOfferId: row.converted_offer_id || row.convertedOfferId || null,
    lostReason: row.lost_reason || row.lostReason || "",
    note: row.note || "",
    createdAt: row.created_at || row.createdAt || "",
    updatedAt: row.updated_at || row.updatedAt || "",
  }));
}

function getCrmStatusLabel(status = "") {
  return CRM_STATUSES[status]?.label || status || "-";
}

function getCrmFollowClass(dateValue = "") {
  if (!dateValue) return "";
  const todayValue = new Date().toISOString().slice(0, 10);
  if (dateValue < todayValue) return "is-overdue";
  if (dateValue === todayValue) return "is-today";
  return "";
}

function getCrmKpiModel(records = []) {
  const todayValue = new Date().toISOString().slice(0, 10);
  return [
    {
      key: "new",
      label: "Yeni Potansiyel",
      value: records.filter((item) => item.status === "new").length,
      icon: "user",
      tone: "blue",
    },
    {
      key: "follow",
      label: "Takip Bekleyen",
      value: records.filter((item) => item.nextFollowUpDate && item.nextFollowUpDate <= todayValue && !["won", "lost"].includes(item.status)).length,
      icon: "time",
      tone: "amber",
    },
    {
      key: "quote",
      label: "Teklif Asamasinda",
      value: records.filter((item) => ["quote_required", "quote_sent"].includes(item.status)).length,
      icon: "doc",
      tone: "indigo",
    },
    {
      key: "won",
      label: "Kazanilan",
      value: records.filter((item) => item.status === "won").length,
      icon: "win",
      tone: "green",
    },
    {
      key: "lost",
      label: "Kaybedilen",
      value: records.filter((item) => item.status === "lost").length,
      icon: "lost",
      tone: "red",
    },
  ];
}

function getCrmFilteredRecords(records = []) {
  const term = String(crmSearch?.value || "").trim().toLowerCase();
  if (!term) return records;
  return records.filter((item) => [item.companyName, item.contactName, item.phone, item.source, getCrmStatusLabel(item.status)]
    .join(" ")
    .toLowerCase()
    .includes(term));
}

function renderCrmWorkflowPanels(records = []) {
  if (crmFlowPanel) {
    const steps = [
      ["1. Potansiyel Musteriler", "Yeni musteri adaylari bu bolumde kaydedilir.", "people", "blue"],
      ["2. Satis Firsatlari", "Musteri adaylari firsat asamalarina takip edilir.", "target", "green"],
      ["3. Gorusmeler / Aktiviteler", "Aramalar, notlar ve takip tarihleri tutulur.", "phone", "amber"],
      ["4. Takip Hatirlatmalari", "Geciken ve bugun yapilacak isler one cikar.", "bell", "purple"],
      ["5. CRM Raporlari", "Firsat, donusum ve performans izlenir.", "chart", "teal"],
    ];
    crmFlowPanel.innerHTML = `
      <div class="crm-side-head">
        <h3>CRM Modulu Ic Yapisi</h3>
        <p>Potansiyelden teklife uzanan satis akis haritasi.</p>
      </div>
      <div class="crm-flow-list">
        ${steps.map(([title, text, icon, tone]) => `
          <article class="crm-flow-step crm-flow-${tone}">
            <span class="crm-flow-icon">${escapeHtml(icon)}</span>
            <div>
              <strong>${escapeHtml(title)}</strong>
              <small>${escapeHtml(text)}</small>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  if (crmLegendPanel) {
    crmLegendPanel.innerHTML = `
      <div class="crm-side-head compact">
        <h3>Durum Renkleri</h3>
      </div>
      <div class="crm-legend-grid">
        ${Object.entries(CRM_STATUSES).map(([key, config]) => `
          <span><i style="background:${escapeHtml(config.color)}"></i>${escapeHtml(config.label)}</span>
        `).join("")}
      </div>
      <p class="crm-side-note">${records.length} CRM kaydi izleniyor. Geciken takipler kirmizi, bugunku takipler turuncu vurgulanir.</p>
    `;
  }
}

function renderCrmDashboard(records = []) {
  if (!crmDashboardPanel) return;
  const todayValue = new Date().toISOString().slice(0, 10);
  const active = records.filter((item) => !["won", "lost"].includes(item.status));
  const won = records.filter((item) => item.status === "won").length;
  const lost = records.filter((item) => item.status === "lost").length;
  const overdue = active.filter((item) => item.nextFollowUpDate && item.nextFollowUpDate < todayValue);
  const today = active.filter((item) => item.nextFollowUpDate === todayValue);
  const quoteStage = records.filter((item) => ["quote_required", "quote_sent"].includes(item.status));
  const conversionRate = won + lost ? Math.round((won / (won + lost)) * 100) : 0;
  const upcoming = active
    .filter((item) => item.nextFollowUpDate)
    .sort((a, b) => String(a.nextFollowUpDate).localeCompare(String(b.nextFollowUpDate)))
    .slice(0, 5);

  crmDashboardPanel.innerHTML = `
    <div class="panel-header-row compact">
      <div>
        <h2>CRM Dashboard</h2>
        <p>Bugunku takipler, geciken firsatlar ve donusum ozeti.</p>
      </div>
    </div>
    <div class="crm-dashboard-grid">
      <article class="crm-metric-card tone-green"><span>Bugun Aranacak</span><strong>${today.length}</strong></article>
      <article class="crm-metric-card tone-red"><span>Takip Gecmis</span><strong>${overdue.length}</strong></article>
      <article class="crm-metric-card tone-blue"><span>Teklif Asamasinda</span><strong>${quoteStage.length}</strong></article>
      <article class="crm-conversion-card">
        <span>Donusum Orani</span>
        <strong>%${conversionRate}</strong>
        <small>Kazanilan / sonuclanan firsat orani</small>
      </article>
      <article class="crm-upcoming-card">
        <strong>Yaklasan Takipler</strong>
        ${upcoming.length ? upcoming.map((item) => `
          <span>
            <b>${escapeHtml(item.companyName || item.contactName || "-")}</b>
            <small>${escapeHtml(getCrmStatusLabel(item.status))} - ${formatDate(item.nextFollowUpDate)}</small>
          </span>
        `).join("") : `<em>Planli takip bulunmuyor.</em>`}
      </article>
    </div>
  `;
}

function exportCrmCsv() {
  const rows = getCrmFilteredRecords(cache.crm || []);
  const header = ["Firma", "Kisi", "Telefon", "Kaynak", "Durum", "Tahmini Tutar", "Kazanma", "Sonraki Takip", "Sorumlu"];
  const body = rows.map((item) => [
    item.companyName,
    item.contactName,
    item.phone,
    item.source,
    getCrmStatusLabel(item.status),
    item.estimatedValue,
    item.winProbability,
    item.nextFollowUpDate,
    item.assignedTo,
  ]);
  const csv = [header, ...body]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `crm-firsatlar-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderCrm(records = []) {
  if (crmStatusSelect) {
    const current = crmStatusSelect.value || "new";
    crmStatusSelect.innerHTML = Object.entries(CRM_STATUSES).map(([key, config]) => `<option value="${key}" ${key === current ? "selected" : ""}>${escapeHtml(config.label)}</option>`).join("");
  }
  const kpis = getCrmKpiModel(records);
  if (crmKpiGrid) {
    crmKpiGrid.innerHTML = kpis.map((item) => `
      <article class="summary-card crm-summary-card crm-summary-${item.tone}">
        <div><span>${escapeHtml(item.label)}</span><strong>${item.value}</strong></div>
        <div class="summary-icon ${escapeHtml(item.tone)}">${escapeHtml(item.icon)}</div>
      </article>
    `).join("");
  }
  renderCrmWorkflowPanels(records);
  renderCrmDashboard(records);
  if (!crmLeadsTable) return;
  const filtered = getCrmFilteredRecords(records);
  crmLeadsTable.innerHTML = filtered.length ? `
    <table class="orders-data-table erp-modern-table crm-data-table">
      <thead><tr><th>FIRMA / KISI</th><th>TELEFON</th><th>KAYNAK</th><th>DURUM</th><th>TAHMINI TUTAR</th><th>KAZANMA</th><th>SONRAKI TAKIP</th><th>SORUMLU</th><th>ISLEMLER</th></tr></thead>
      <tbody>
        ${filtered.map((item) => `
          <tr>
            <td><strong>${escapeHtml(item.companyName || "-")}</strong><small>${escapeHtml(item.contactName || item.leadNo || "")}</small></td>
            <td>${escapeHtml(item.phone || "-")}</td>
            <td>${escapeHtml(item.source || "-")}</td>
            <td><span class="status-pill status-crm-${escapeHtml(item.status)}">${escapeHtml(getCrmStatusLabel(item.status))}</span></td>
            <td class="offers-col-money">${formatCurrency(item.estimatedValue || 0)}</td>
            <td>${Number(item.winProbability || 0)}%</td>
            <td><span class="crm-follow-date ${getCrmFollowClass(item.nextFollowUpDate)}">${formatDate(item.nextFollowUpDate)}</span></td>
            <td>${escapeHtml(item.assignedTo || "-")}</td>
            <td class="order-actions-cell">
              <div class="order-row-actions order-row-actions-compact">
                <button class="offer-action-icon crm-detail-btn" type="button" data-id="${item.id}" title="Goruntule">${getOfferActionIcon("eye")}</button>
                <button class="offer-action-icon offer-actions-more-btn" type="button" data-crm-actions-toggle="${item.id}" title="Diger islemler">${getOfferActionIcon("more")}</button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : `<div class="orders-row empty">CRM kaydi bulunamadi.</div>`;
  bindCrmActions();
}

function renderCrmDetail(lead, bundle = {}) {
  if (!crmDetailPanel) return;
  if (!lead) {
    crmDetailPanel.hidden = true;
    crmDetailPanel.innerHTML = "";
    return;
  }
  const activities = bundle.activities || [];
  const history = bundle.status_history || [];
  crmDetailPanel.hidden = false;
  crmDetailPanel.innerHTML = `
    <div class="panel-header-row compact">
      <div>
        <h2>${escapeHtml(lead.companyName || lead.contactName || "CRM Detay")}</h2>
        <p>${escapeHtml(lead.phone || "-")} | ${escapeHtml(getCrmStatusLabel(lead.status))} | ${formatCurrency(lead.estimatedValue)}</p>
      </div>
      <button class="ghost-action close-crm-detail-btn" type="button">Kapat</button>
    </div>
    <div class="order-detail-summary-grid">
      <article class="order-summary-card"><span>Durum</span><strong>${escapeHtml(getCrmStatusLabel(lead.status))}</strong></article>
      <article class="order-summary-card"><span>Kazanma</span><strong>${Number(lead.winProbability || 0)}%</strong></article>
      <article class="order-summary-card"><span>Takip</span><strong>${formatDate(lead.nextFollowUpDate)}</strong></article>
      <article class="order-summary-card"><span>Sorumlu</span><strong>${escapeHtml(lead.assignedTo || "-")}</strong></article>
    </div>
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head"><div><h3>Genel Bilgiler</h3><p>${escapeHtml(lead.note || "Not girilmedi.")}</p></div></div>
      <div class="order-detail-info-grid">
        <article><span>Firma</span><strong>${escapeHtml(lead.companyName || "-")}</strong></article>
        <article><span>Kisi</span><strong>${escapeHtml(lead.contactName || "-")}</strong></article>
        <article><span>E-posta</span><strong>${escapeHtml(lead.email || "-")}</strong></article>
        <article><span>Adres</span><strong>${escapeHtml([lead.city, lead.district].filter(Boolean).join(" / ") || "-")}</strong></article>
      </div>
      <h4 class="order-detail-subtitle">Gorusmeler</h4>
      ${activities.length ? `<table class="mini-data-table"><thead><tr><th>Tarih</th><th>Tip</th><th>Konu</th><th>Sonraki Takip</th></tr></thead><tbody>${activities.map((item) => `<tr><td>${formatDate(item.activity_date)}</td><td>${escapeHtml(item.activity_type || "-")}</td><td><strong>${escapeHtml(item.subject || "-")}</strong><small>${escapeHtml(item.description || "")}</small></td><td>${formatDate(item.next_follow_up_date)}</td></tr>`).join("")}</tbody></table>` : renderOrderEmptyState("Gorusme yok.", "Gorusme Ekle islemiyle aktivite olusturun.")}
      <h4 class="order-detail-subtitle">Durum Gecmisi</h4>
      ${history.length ? `<div class="status-history-list">${history.map((item) => `<article><strong>${escapeHtml(getCrmStatusLabel(item.old_status) || "Baslangic")} -> ${escapeHtml(getCrmStatusLabel(item.new_status))}</strong><span>${formatDate(item.created_at)} ${item.note ? `| ${escapeHtml(item.note)}` : ""}</span></article>`).join("")}</div>` : renderOrderEmptyState("Durum gecmisi yok.", "")}
    </section>
  `;
  crmDetailPanel.querySelector(".close-crm-detail-btn")?.addEventListener("click", () => renderCrmDetail(null));
}

function formatCurrencyByCodeLegacy(value, currencyCode = "TRY") {
  const safeCurrency = ["TRY", "USD", "EUR"].includes(currencyCode) ? currencyCode : "TRY";
  return Number(value || 0).toLocaleString("tr-TR", {
    style: "currency",
    currency: safeCurrency,
    maximumFractionDigits: 2,
  });
}

function formatCariTypeLabel(value) {
  if (value === "Musteri") return "Musteri";
  if (value === "Tedarikci") return "Tedarikci";
  if (value === "Musteri/Tedarikci") return "Musteri + Tedarikci";
  return "-";
}

function formatBalanceTypeLabel(value) {
  if (value === "Borc") return "Borc";
  if (value === "Alacak") return "Alacak";
  if (value === "Sifir") return "Sifir";
  return "Sifir";
}

function normalizeText(value) {
  return String(value || "")
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, " ")
    .trim();
}

function getCariMetaStore() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CARI_META_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveCariMetaStore(store) {
  window.localStorage.setItem(CARI_META_STORAGE_KEY, JSON.stringify(store || {}));
}

function getCariMetaById(cariId) {
  const store = getCariMetaStore();
  return store[String(cariId)] || {};
}

function setCariMetaById(cariId, meta) {
  if (!cariId) return;
  const store = getCariMetaStore();
  store[String(cariId)] = {
    ...(store[String(cariId)] || {}),
    ...(meta || {}),
  };
  saveCariMetaStore(store);
}

function getNextCariCode() {
  const nextId = (cache.cari || []).reduce((max, item) => Math.max(max, Number(item.id || 0)), 0) + 1;
  return buildCariCode(nextId);
}

function getCurrentCariCode() {
  if (cariEditId?.value) {
    const currentCari = (cache.cari || []).find((item) => Number(item.id || 0) === Number(cariEditId.value));
    return buildCariCode(Number(cariEditId.value), currentCari?.createdAt);
  }
  return cariCodeInput?.value || getNextCariCode();
}

function activateCariFormTab(tabName = "general") {
  currentCariFormTab = tabName;
  cariFormTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.cariFormTab === tabName);
  });
  cariFormPanels.forEach((panel) => {
    const isActive = panel.dataset.cariFormPanel === tabName;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function setCariFieldError(fieldName, hasError) {
  const field = forms.cari?.querySelector(`[data-field="${fieldName}"]`);
  if (field) field.classList.toggle("has-error", Boolean(hasError));
}

function formatCariPhoneValue(value = "") {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  if (digits.length <= 9) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
}

function createCariAddressCardMarkup(address = {}, index = 1) {
  return `
    <article class="cari-address-card">
      <div class="cari-address-card-head">
        <strong>${index}. Adres</strong>
        <button class="ghost-action danger-action" type="button" data-cari-address-remove>Sil</button>
      </div>
      <div class="cari-form-grid cari-form-grid-3">
        <label class="cari-field">
          <span>Adres Tipi</span>
          <select class="cari-address-type">
            <option value="Fatura Adresi" ${address.type === "Fatura Adresi" ? "selected" : ""}>Fatura Adresi</option>
            <option value="Teslimat Adresi" ${address.type === "Teslimat Adresi" ? "selected" : ""}>Teslimat Adresi</option>
            <option value="Merkez" ${address.type === "Merkez" ? "selected" : ""}>Merkez</option>
            <option value="Sube" ${address.type === "Sube" ? "selected" : ""}>Sube</option>
          </select>
        </label>
        <label class="cari-field">
          <span>Il</span>
          <input class="cari-address-city" type="text" value="${escapeHtml(address.city || "")}" placeholder="Izmir">
        </label>
        <label class="cari-field">
          <span>Ilce</span>
          <input class="cari-address-district" type="text" value="${escapeHtml(address.district || "")}" placeholder="Bornova">
        </label>
      </div>
      <label class="cari-field">
        <span>Acik Adres</span>
        <textarea class="cari-address-full" rows="4" placeholder="Mahalle, cadde, sokak, bina no...">${escapeHtml(address.fullAddress || "")}</textarea>
      </label>
    </article>
  `;
}

function reindexCariAddressCards() {
  [...(cariAddressList?.querySelectorAll(".cari-address-card") || [])].forEach((card, index) => {
    const title = card.querySelector(".cari-address-card-head strong");
    if (title) title.textContent = `${index + 1}. Adres`;
  });
}

function addCariAddressCard(address = {}) {
  if (!cariAddressList) return;
  cariAddressList.insertAdjacentHTML("beforeend", createCariAddressCardMarkup(address, (cariAddressList.children.length || 0) + 1));
}

function resetCariAddressCards(addresses = [{}]) {
  if (!cariAddressList) return;
  cariAddressList.innerHTML = "";
  const safeAddresses = Array.isArray(addresses) && addresses.length ? addresses : [{}];
  safeAddresses.forEach((address) => addCariAddressCard(address));
  reindexCariAddressCards();
}

function collectCariAddresses() {
  return [...(cariAddressList?.querySelectorAll(".cari-address-card") || [])].map((card) => ({
    type: card.querySelector(".cari-address-type")?.value || "Fatura Adresi",
    city: card.querySelector(".cari-address-city")?.value?.trim() || "",
    district: card.querySelector(".cari-address-district")?.value?.trim() || "",
    fullAddress: card.querySelector(".cari-address-full")?.value?.trim() || "",
  }));
}

function handleCariAddressListClick(event) {
  const removeButton = event.target.closest("[data-cari-address-remove]");
  if (!removeButton) return;
  const cards = cariAddressList?.querySelectorAll(".cari-address-card") || [];
  if (cards.length <= 1) {
    resetCariAddressCards([{}]);
    return;
  }
  removeButton.closest(".cari-address-card")?.remove();
  reindexCariAddressCards();
}

function collectCariFormSnapshot() {
  return {
    currentTab: currentCariFormTab,
    values: {
      type: cariTypeSelect?.value || "",
      companyName: cariCompanyNameInput?.value || "",
      fullName: cariAuthorizedPersonInput?.value || "",
      accountStatus: cariStatusSelect?.value || "Aktif",
      cariCode: getCurrentCariCode(),
      sector: cariSectorInput?.value || "",
      source: cariSourceInput?.value || "Manuel Kayit",
      tag: cariTagInput?.value || "",
      phone: cariPhoneInput?.value || "",
      whatsapp: cariWhatsappInput?.value || "",
      email: cariEmailInput?.value || "",
      website: cariWebsiteInput?.value || "",
      phone2: cariPhone2Input?.value || "",
      department: cariDepartmentInput?.value || "",
      riskLimit: cariRiskLimitInput?.value || "0",
      maturityDay: cariMaturityDayInput?.value || "30",
      currency: cariCurrencyInput?.value || "TRY",
      openingBalance: cariOpeningBalanceInput?.value || "0",
      balanceType: cariBalanceTypeInput?.value || "Borc",
      eInvoiceStatus: cariEInvoiceStatusInput?.value || "Bilinmiyor",
      taxOffice: cariTaxOfficeInput?.value || "",
      taxNumber: cariTaxNumberInput?.value || "",
      iban: cariIbanInput?.value || "",
      discountRate: cariDiscountRateInput?.value || "0",
      notes: cariGeneralNoteInput?.value || "",
      specialWarning: cariSpecialWarningInput?.value || "",
    },
    addresses: collectCariAddresses(),
  };
}

function applyCariFormSnapshot(snapshot = {}, options = {}) {
  const values = snapshot.values || {};
  if (cariEditId && !options.keepEditId) cariEditId.value = "";
  if (cariCodeInput) cariCodeInput.value = values.cariCode || getNextCariCode();
  if (cariTypeSelect) cariTypeSelect.value = values.type || "";
  if (cariStatusSelect) cariStatusSelect.value = values.accountStatus || "Aktif";
  if (cariCompanyNameInput) cariCompanyNameInput.value = values.companyName || "";
  if (cariAuthorizedPersonInput) cariAuthorizedPersonInput.value = values.fullName || "";
  if (cariSectorInput) cariSectorInput.value = values.sector || "";
  if (cariSourceInput) cariSourceInput.value = values.source || "Manuel Kayit";
  if (cariTagInput) cariTagInput.value = values.tag || "";
  if (cariPhoneInput) cariPhoneInput.value = values.phone || "";
  if (cariWhatsappInput) cariWhatsappInput.value = values.whatsapp || "";
  if (cariEmailInput) cariEmailInput.value = values.email || "";
  if (cariWebsiteInput) cariWebsiteInput.value = values.website || "";
  if (cariPhone2Input) cariPhone2Input.value = values.phone2 || "";
  if (cariDepartmentInput) cariDepartmentInput.value = values.department || "";
  if (cariRiskLimitInput) cariRiskLimitInput.value = formatMoneyInputValue(values.riskLimit || 0);
  if (cariMaturityDayInput) cariMaturityDayInput.value = values.maturityDay || "30";
  if (cariCurrencyInput) cariCurrencyInput.value = values.currency || "TRY";
  if (cariOpeningBalanceInput) cariOpeningBalanceInput.value = formatMoneyInputValue(values.openingBalance || 0);
  if (cariBalanceTypeInput) cariBalanceTypeInput.value = values.balanceType || "Borc";
  if (cariEInvoiceStatusInput) cariEInvoiceStatusInput.value = values.eInvoiceStatus || "Bilinmiyor";
  if (cariTaxOfficeInput) cariTaxOfficeInput.value = values.taxOffice || "";
  if (cariTaxNumberInput) cariTaxNumberInput.value = values.taxNumber || "";
  if (cariIbanInput) cariIbanInput.value = values.iban || "";
  if (cariDiscountRateInput) cariDiscountRateInput.value = values.discountRate || "0";
  if (cariGeneralNoteInput) cariGeneralNoteInput.value = values.notes || "";
  if (cariSpecialWarningInput) cariSpecialWarningInput.value = values.specialWarning || "";
  resetCariAddressCards(snapshot.addresses || [{}]);
  activateCariFormTab(snapshot.currentTab || "general");
  initializeMoneyInputs();
  updateCariDuplicateWarning();
  updateCariFormSummary();
}

function saveCariFormDraft() {
  if (!forms.cari) return;
  const snapshot = collectCariFormSnapshot();
  window.localStorage.setItem(CARI_FORM_DRAFT_STORAGE_KEY, JSON.stringify({
    ...snapshot,
    savedAt: Date.now(),
  }));
  window.alert("Cari form taslagi kaydedildi.");
}

function loadCariFormDraft() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CARI_FORM_DRAFT_STORAGE_KEY) || "null");
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function clearCariFormDraft() {
  window.localStorage.removeItem(CARI_FORM_DRAFT_STORAGE_KEY);
}

function validateCariForm(options = {}) {
  const minimumOnly = Boolean(options.minimumOnly);
  const typeValue = String(cariTypeSelect?.value || "").trim();
  const companyValue = String(cariCompanyNameInput?.value || "").trim();
  const emailValue = String(cariEmailInput?.value || "").trim();

  setCariFieldError("type", !typeValue);
  setCariFieldError("companyName", !companyValue);
  setCariFieldError("email", false);

  if (!typeValue || !companyValue) {
    activateCariFormTab("general");
    window.alert("Lutfen cari tipi ve firma adini doldurun.");
    return false;
  }

  if (!minimumOnly && emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    setCariFieldError("email", true);
    activateCariFormTab("contact");
    window.alert("E-posta formati gecersiz.");
    return false;
  }

  return true;
}

function getCariDuplicateAnalysis() {
  const companyValue = normalizeText(cariCompanyNameInput?.value || "");
  const phoneValue = String(cariPhoneInput?.value || "").replace(/\D/g, "");
  const emailValue = normalizeText(cariEmailInput?.value || "");
  const currentId = Number(cariEditId?.value || 0);
  const duplicateMatches = (cache.cari || []).filter((item) => {
    if (Number(item.id || 0) === currentId) return false;
    const sameCompany = companyValue.length > 2 && normalizeText(item.companyName || item.fullName) === companyValue;
    const samePhone = phoneValue.length >= 10 && String(item.phone || "").replace(/\D/g, "") === phoneValue;
    const sameEmail = emailValue && normalizeText(item.email || "") === emailValue;
    return sameCompany || samePhone || sameEmail;
  });

  const reasons = [];
  const exactNameMatches = duplicateMatches.filter((item) => normalizeText(item.companyName || item.fullName) === companyValue);
  if (exactNameMatches.length) {
    const matchedNames = exactNameMatches
      .map((item) => item.companyName || item.fullName || "Kayitli cari")
      .slice(0, 2)
      .join(", ");
    reasons.push(`Ayni cari adi ile kayitli bilgi bulundu: ${matchedNames}.`);
  }
  if (phoneValue.length >= 10 && duplicateMatches.some((item) => String(item.phone || "").replace(/\D/g, "") === phoneValue)) {
    reasons.push("Bu telefon numarasi baska bir cari kaydinda kullaniliyor.");
  }
  if (emailValue && duplicateMatches.some((item) => normalizeText(item.email || "") === emailValue)) {
    reasons.push("Bu e-posta adresi baska bir cari kaydinda kullaniliyor.");
  }

  return {
    hasDuplicate: duplicateMatches.length > 0,
    duplicateMatches,
    exactNameMatches,
    message: reasons.join(" ") || "Benzer cari kaydi olabilir. Kaydetmeden once cari listesinden kontrol edilmesi onerilir.",
  };
}

function updateCariDuplicateWarning() {
  if (!cariDuplicateBox) return;
  const duplicateInfo = getCariDuplicateAnalysis();
  if (!duplicateInfo.hasDuplicate) {
    cariDuplicateBox.hidden = true;
    cariDuplicateBox.textContent = "Benzer cari kaydi olabilir. Kaydetmeden once cari listesinden kontrol edilmesi onerilir.";
    return;
  }

  cariDuplicateBox.textContent = duplicateInfo.message;
  cariDuplicateBox.hidden = false;
}

function updateCariFormSummary() {
  const companyName = String(cariCompanyNameInput?.value || "").trim();
  const contactName = String(cariAuthorizedPersonInput?.value || "").trim();
  const typeValue = String(cariTypeSelect?.value || "").trim();
  const phoneValue = String(cariPhoneInput?.value || "").trim();
  const riskLimitValue = parseMoneyInput(cariRiskLimitInput?.value || 0);
  const maturityDayValue = Number(cariMaturityDayInput?.value || 0) || 0;
  const openingBalanceValue = parseMoneyInput(cariOpeningBalanceInput?.value || 0);
  const balanceTypeValue = String(cariBalanceTypeInput?.value || "Borc");
  const currencyValue = String(cariCurrencyInput?.value || "TRY");
  const codeValue = getCurrentCariCode();

  if (cariCodeInput) cariCodeInput.value = codeValue;
  if (cariSummaryLogo) cariSummaryLogo.textContent = (companyName || "C").slice(0, 1).toLocaleUpperCase("tr-TR");
  if (cariSummaryName) cariSummaryName.textContent = companyName || "Yeni Cari";
  if (cariSummarySubtitle) {
    cariSummarySubtitle.textContent = contactName
      ? `${contactName} | ${formatCariTypeLabel(typeValue)}`
      : `${formatCariTypeLabel(typeValue)} kaydi olusturuluyor.`;
  }
  if (cariSummaryCode) cariSummaryCode.textContent = codeValue;
  if (cariSummaryType) cariSummaryType.textContent = formatCariTypeLabel(typeValue);
  if (cariSummaryPhone) cariSummaryPhone.textContent = phoneValue || "-";
  if (cariSummaryRisk) cariSummaryRisk.textContent = formatCurrencyByCode(riskLimitValue, currencyValue);
  if (cariSummaryMaturity) cariSummaryMaturity.textContent = `${maturityDayValue} gun`;
  if (cariSummaryBalance) {
    cariSummaryBalance.textContent = balanceTypeValue === "Sifir"
      ? formatCurrencyByCode(0, currencyValue)
      : `${formatBalanceTypeLabel(balanceTypeValue)} ${formatCurrencyByCode(openingBalanceValue, currencyValue)}`;
  }
}

function handleCariFormLiveUpdate(event) {
  const target = event.target;
  if (!target) return;
  if (target === cariPhoneInput || target === cariWhatsappInput || target === cariPhone2Input) {
    target.value = formatCariPhoneValue(target.value);
  }
  if (target === cariTaxNumberInput) {
    target.value = String(target.value || "").replace(/\D/g, "").slice(0, 11);
  }
  updateCariDuplicateWarning();
  updateCariFormSummary();
}

function collectCariFormSubmission(options = {}) {
  const snapshot = collectCariFormSnapshot();
  return {
    apiPayload: {
      fullName: String(snapshot.values.fullName || "").trim(),
      companyName: String(snapshot.values.companyName || "").trim(),
      phone: String(snapshot.values.phone || "").trim(),
      taxOffice: String(snapshot.values.taxOffice || "").trim(),
      taxNumber: String(snapshot.values.taxNumber || "").trim(),
      discountRate: Math.max(0, Math.min(100, parseDecimalInput(snapshot.values.discountRate || 0))),
      balanceLimit: 0,
      riskLimit: parseMoneyInput(snapshot.values.riskLimit || 0),
      type: normalizeCariType(snapshot.values.type || ""),
      notes: String(snapshot.values.notes || "").trim(),
    },
    meta: {
      accountStatus: snapshot.values.accountStatus || "Aktif",
      cariCode: snapshot.values.cariCode || getCurrentCariCode(),
      sector: snapshot.values.sector || "",
      source: snapshot.values.source || "Manuel Kayit",
      tag: snapshot.values.tag || "",
      whatsapp: snapshot.values.whatsapp || "",
      email: snapshot.values.email || "",
      website: snapshot.values.website || "",
      phone2: snapshot.values.phone2 || "",
      department: snapshot.values.department || "",
      maturityDay: Number(snapshot.values.maturityDay || 0) || 0,
      currency: snapshot.values.currency || "TRY",
      openingBalance: parseMoneyInput(snapshot.values.openingBalance || 0),
      balanceType: snapshot.values.balanceType || "Borc",
      eInvoiceStatus: snapshot.values.eInvoiceStatus || "Bilinmiyor",
      iban: snapshot.values.iban || "",
      specialWarning: snapshot.values.specialWarning || "",
      addresses: snapshot.addresses || [],
      updatedAt: Date.now(),
      saveMode: options.minimumOnly ? "quick" : "full",
    },
  };
}

async function submitCariForm(options = {}) {
  try {
    if (!validateCariForm(options)) return;
    const duplicateInfo = getCariDuplicateAnalysis();
    if (duplicateInfo.hasDuplicate) {
      const confirmMessage = `${duplicateInfo.message}\n\nYine de bu cari kaydini kaydetmek istiyor musunuz?`;
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    const submission = collectCariFormSubmission(options);
    let savedCariId = Number(cariEditId?.value || 0);

    if (savedCariId) {
      await api.cari.update(savedCariId, {
        full_name: submission.apiPayload.fullName,
        company_name: submission.apiPayload.companyName,
        phone: submission.apiPayload.phone,
        tax_office: submission.apiPayload.taxOffice,
        tax_number: submission.apiPayload.taxNumber,
        discount_rate: submission.apiPayload.discountRate,
        balance_limit: submission.apiPayload.balanceLimit,
        risk_limit: submission.apiPayload.riskLimit,
        type: submission.apiPayload.type,
        notes: submission.apiPayload.notes,
      });
    } else {
      const response = await addRecord(STORES.cari, submission.apiPayload);
      savedCariId = Number(response?.id || 0);
    }

    if (savedCariId) {
      setCariMetaById(savedCariId, submission.meta);
    }
    clearCariFormDraft();
    clearCariSelection();
    await refreshUI();
  } catch (error) {
    console.error("Cari kaydi guncellenemedi:", error);
    window.alert(`Cari kaydi guncellenemedi: ${error?.message || "Bilinmeyen hata"}`);
  }
}

function clearCariFormForNewRecord() {
  clearCariFormDraft();
  clearCariSelection({ showForm: true });
}

function initializeCariFormFromStoredState() {
  const draft = loadCariFormDraft();
  if (draft && !cariEditId?.value) {
    applyCariFormSnapshot(draft);
    return;
  }
  if (!cariAddressList?.children.length) {
    resetCariAddressCards([{}]);
  }
  updateCariFormSummary();
  updateCariDuplicateWarning();
}

function clearCariSelection(options = {}) {
  selectedCariId = null;
  currentCariDetailTab = "general";
  resetCariFormEditor();
  currentCariSubview = options.showForm ? "form" : "list";
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
  if (cariCodeInput) cariCodeInput.value = getNextCariCode();
  if (cariStatusSelect) cariStatusSelect.value = "Aktif";
  if (cariSourceInput) cariSourceInput.value = "Manuel Kayit";
  if (cariMaturityDayInput) cariMaturityDayInput.value = "30";
  if (cariCurrencyInput) cariCurrencyInput.value = "TRY";
  if (cariBalanceTypeInput) cariBalanceTypeInput.value = "Borc";
  if (cariEInvoiceStatusInput) cariEInvoiceStatusInput.value = "Bilinmiyor";
  if (cariRiskLimitInput) cariRiskLimitInput.value = formatMoneyInputValue(0);
  if (cariOpeningBalanceInput) cariOpeningBalanceInput.value = formatMoneyInputValue(0);
  if (cariDiscountRateInput) cariDiscountRateInput.value = "0";
  resetCariAddressCards([{}]);
  ["type", "companyName", "email"].forEach((fieldName) => setCariFieldError(fieldName, false));
  if (cariDuplicateBox) cariDuplicateBox.hidden = true;
  activateCariFormTab("general");
  initializeMoneyInputs();
  updateCariFormSummary();
}

function selectCariById(cariId, options = {}) {
  const cari = (cache.cari || []).find((item) => item.id === Number(cariId));
  if (!cari) return;
  resetCariFormEditor();
  selectedCariId = cari.id;
  if (options.detailTab) {
    currentCariDetailTab = options.detailTab;
  }
  renderCariSticky(cari, cache.movements || [], cache.orders || []);
  renderCariDetail(cari, cache.movements || [], cache.orders || []);
  renderCari(cache.cari || [], cache.movements || [], cache.orders || []);
  renderMovements(cache.movements || [], cache.cari || []);
  renderCariStatements(cache.cari || [], cache.movements || [], cache.orders || []);
}

function openOfferFormForCari(cariId) {
  const cari = (cache.cari || []).find((item) => item.id === Number(cariId));
  if (!cari) return;
  selectedCariId = cari.id;
  currentCariDetailTab = "offers";
  setActiveView("offers");
  currentOffersSubview = "form";
  applyOffersSubview(currentOffersSubview);
  if (offerCariSelect) {
    offerCariSelect.value = String(cari.id);
  }
  handleOfferCariChange();
  if (offerDiscountRateInput) {
    offerDiscountRateInput.value = String(cari.discountRate || 0);
  }
  if (offerNoDisplay && !offerNoManualToggle?.checked) {
    offerNoDisplay.value = generateOfferNo();
  }
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
  applyCariFormSnapshot({
    currentTab: "general",
    values: {
      type: normalizeCariType(cari.type),
      companyName: cari.companyName || "",
      fullName: cari.fullName || "",
      accountStatus: cari.accountStatus || "Aktif",
      cariCode: buildCariCode(cari.id, cari.createdAt),
      sector: cari.sector || "",
      source: cari.source || "Manuel Kayit",
      tag: cari.tag || "",
      phone: cari.phone || "",
      whatsapp: cari.whatsapp || "",
      email: cari.email || "",
      website: cari.website || "",
      phone2: cari.phone2 || "",
      department: cari.department || "",
      riskLimit: cari.riskLimit || 0,
      maturityDay: cari.maturityDay || 30,
      currency: cari.currency || "TRY",
      openingBalance: cari.openingBalance || 0,
      balanceType: cari.balanceType || "Borc",
      eInvoiceStatus: cari.eInvoiceStatus || "Bilinmiyor",
      taxOffice: cari.taxOffice || "",
      taxNumber: cari.taxNumber || "",
      iban: cari.iban || "",
      discountRate: cari.discountRate || 0,
      notes: cari.notes || "",
      specialWarning: cari.specialWarning || "",
    },
    addresses: cari.addresses || [{}],
  }, { keepEditId: true });
  if (cariSubmitBtn) cariSubmitBtn.textContent = "Cariyi Guncelle";
  renderCariSticky(cari, cache.movements || [], cache.orders || []);
  renderCariDetail(cari, cache.movements || [], cache.orders || []);
  renderCari(cache.cari || [], cache.movements || [], cache.orders || []);
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
    .join(" | ");

  if (cariStickyName) cariStickyName.textContent = cari.companyName || cari.fullName || "Cari";
  if (cariStickyMeta) cariStickyMeta.textContent = meta;
  if (cariStickyBalance) cariStickyBalance.textContent = formatCurrency(balance);
}

function renderCariDetail(cari, movements, orders) {
  const activeTabs = cariDetailTabs || [];
  activeTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.cariDetailTab === currentCariDetailTab);
  });

  if (!cari) {
    if (cariDetailOfferBtn) cariDetailOfferBtn.disabled = true;
    if (cariDetailBadge) {
      cariDetailBadge.textContent = "Secim Yok";
      cariDetailBadge.className = "cari-status-badge";
    }
    if (cariDetailCompany) cariDetailCompany.textContent = "Cari Ozeti";
    if (cariDetailType) cariDetailType.textContent = "Listeden bir cari secin.";
    if (cariDetailName) cariDetailName.textContent = "-";
    if (cariDetailPhone) cariDetailPhone.textContent = "-";
    if (cariDetailEmail) cariDetailEmail.textContent = "-";
    if (cariDetailLastMovement) cariDetailLastMovement.textContent = "-";
    if (cariDetailBalance) cariDetailBalance.textContent = "0 TL";
    if (cariDetailLimit) cariDetailLimit.textContent = "0 TL";
    if (cariDetailTaxNumber) cariDetailTaxNumber.textContent = "-";
    if (cariDetailDiscount) cariDetailDiscount.textContent = "0%";
    if (cariDetailTabContent) {
      cariDetailTabContent.innerHTML = `<div class="cari-detail-empty">Detaylari gormek icin soldaki listeden bir cari secin.</div>`;
    }
    return;
  }

  const balance = calcCariBalance(cari.id, movements, orders);
  const detailData = buildCariDetailData(cari, movements, orders);
  const { lastMovement, exceeded, offers, relatedOrders, relatedMovements, summary } = detailData;
  const badgeText = getCariBalanceStateLabel(balance);
  const statusLabel = getCariAccountStatusLabel(cari, exceeded);
  if (cariDetailOfferBtn) cariDetailOfferBtn.disabled = false;

  if (cariDetailBadge) {
    cariDetailBadge.textContent = badgeText;
    cariDetailBadge.className = `cari-status-badge ${balance > 0 ? "is-debt" : balance < 0 ? "is-credit" : ""} ${exceeded ? "is-risk" : ""}`.trim();
  }
  if (cariDetailCompany) cariDetailCompany.textContent = cari.companyName || cari.fullName || "Cari";
  if (cariDetailType) cariDetailType.textContent = `${buildCariCode(cari.id, cari.createdAt)} | ${formatCariTypeLabel(cari.type)} | ${statusLabel} | ${summary}`;
  if (cariDetailName) cariDetailName.textContent = cari.fullName || "-";
  if (cariDetailPhone) cariDetailPhone.textContent = cari.phone || "-";
  if (cariDetailEmail) cariDetailEmail.textContent = cari.email || "-";
  if (cariDetailLastMovement) cariDetailLastMovement.textContent = lastMovement ? formatDate(lastMovement.date) : "Hareket yok";
  if (cariDetailBalance) cariDetailBalance.textContent = formatCurrency(balance);
  if (cariDetailLimit) cariDetailLimit.textContent = formatCurrency(cari.riskLimit || 0);
  if (cariDetailTaxNumber) cariDetailTaxNumber.textContent = cari.taxNumber || "-";
  if (cariDetailDiscount) cariDetailDiscount.textContent = `%${Number(cari.discountRate || 0)}`;
  if (!cariDetailTabContent) return;

  if (currentCariDetailTab === "contact") {
    cariDetailTabContent.innerHTML = renderCariDetailContactMarkup(cari);
    return;
  }

  if (currentCariDetailTab === "address") {
    cariDetailTabContent.innerHTML = renderCariDetailAddressMarkup(cari);
    return;
  }

  if (currentCariDetailTab === "finance") {
    cariDetailTabContent.innerHTML = renderCariDetailFinanceMarkup(cari, detailData);
    return;
  }

  if (currentCariDetailTab === "offers") {
    cariDetailTabContent.innerHTML = offers.length ? `
      <div class="cari-detail-list">
        ${offers.map((offer) => `
          <article class="cari-detail-list-item">
            <div>
              <strong>${escapeHtml(offer.offerNo || `TK-${offer.id}`)}</strong>
              <span>${escapeHtml(offer.coverType || "-")} | ${formatDate(offer.orderDate)}</span>
            </div>
            <div>
              <small>${escapeHtml(offer.status || "-")}</small>
              <strong>${formatCurrency(offer.netTotal || 0)}</strong>
            </div>
          </article>
        `).join("")}
      </div>
    ` : `<div class="cari-detail-empty">Bu cariye ait teklif kaydi bulunamadi.</div>`;
    return;
  }

  if (currentCariDetailTab === "orders") {
    cariDetailTabContent.innerHTML = relatedOrders.length ? `
      <div class="cari-detail-list">
        ${relatedOrders.map((order) => `
          <article class="cari-detail-list-item">
            <div>
              <strong>${escapeHtml(order.trackingNo || `SP-${order.id}`)}</strong>
              <span>${formatDate(order.orderDate)} | ${escapeHtml(normalizeStatus(order.status))}</span>
            </div>
            <div>
              <small>Teslim ${formatDate(order.deliveryDate)}</small>
              <strong>${formatCurrency(order.netTotal || 0)}</strong>
            </div>
          </article>
        `).join("")}
      </div>
    ` : `<div class="cari-detail-empty">Bu cariye bagli siparis bulunamadi.</div>`;
    return;
  }

  if (currentCariDetailTab === "movements") {
    cariDetailTabContent.innerHTML = relatedMovements.length ? `
      <div class="cari-detail-list">
        ${relatedMovements.map((movement) => `
          <article class="cari-detail-list-item">
            <div>
              <strong>${escapeHtml(movement.movementType || "-")}</strong>
              <span>${formatDate(movement.date)} | ${escapeHtml((movement.note || "").trim() || "Aciklama yok")}</span>
            </div>
            <div>
              <small>${isCreditMovement(movement.movementType) ? "Alacak" : "Borc"}</small>
              <strong class="${isCreditMovement(movement.movementType) ? "is-credit-text" : "is-debt-text"}">${formatCurrency(movement.amount || 0)}</strong>
            </div>
          </article>
        `).join("")}
      </div>
    ` : `<div class="cari-detail-empty">Bu cariye ait hareket kaydi bulunamadi.</div>`;
    return;
  }

  if (currentCariDetailTab === "notes") {
    cariDetailTabContent.innerHTML = `
      <div class="cari-detail-notes-panel">
        <strong>Operasyon Notlari</strong>
        <p>${escapeHtml((cari.notes || "").trim() || "Bu cari icin kayitli not bulunmuyor.")}</p>
      </div>
      <div class="cari-detail-notes-panel">
        <strong>Ozel Uyari</strong>
        <p>${escapeHtml((cari.specialWarning || "").trim() || "Bu cari icin ozel uyari tanimlanmadi.")}</p>
      </div>
    `;
    return;
  }

  cariDetailTabContent.innerHTML = `
    <div class="cari-detail-general-grid">
      <article>
        <small>Cari Kodu</small>
        <strong>${buildCariCode(cari.id, cari.createdAt)}</strong>
      </article>
      <article>
        <small>Cari Tipi</small>
        <strong>${escapeHtml(formatCariTypeLabel(cari.type))}</strong>
      </article>
      <article>
        <small>Durum</small>
        <strong>${escapeHtml(statusLabel)}</strong>
      </article>
      <article>
        <small>Vergi Dairesi</small>
        <strong>${escapeHtml(cari.taxOffice || "-")}</strong>
      </article>
      <article>
        <small>Risk Kullanimi</small>
        <strong>${formatCurrency(balance)} / ${formatCurrency(cari.riskLimit || 0)}</strong>
      </article>
      <article>
        <small>Toplam Teklif</small>
        <strong>${offers.length} adet</strong>
      </article>
      <article>
        <small>Toplam Siparis</small>
        <strong>${relatedOrders.length} adet</strong>
      </article>
      <article>
        <small>Sektor</small>
        <strong>${escapeHtml(cari.sector || "-")}</strong>
      </article>
      <article>
        <small>Kaynak</small>
        <strong>${escapeHtml(cari.source || "-")}</strong>
      </article>
    </div>
    <div class="cari-detail-notes-panel">
      <strong>Kisa Not</strong>
      <p>${escapeHtml((cari.notes || "").trim() || "Bu cari icin kayitli not bulunmuyor.")}</p>
    </div>
  `;
}

function renderCari(records, movements, orders) {
  const target = document.getElementById("cariList");
  if (!target) return;
  const totalEl = document.getElementById("cariStatTotal");
  const debtEl = document.getElementById("cariStatDebt");
  const creditEl = cariStatCredit;
  const riskEl = document.getElementById("cariStatRisk");
  const debtAmountEl = cariStatDebtAmount;
  const creditAmountEl = cariStatCreditAmount;
  const searchTerm = cariSearch?.value?.trim().toLowerCase() || "";
  const typeTerm = cariTypeFilter?.value || "";
  const balanceFilter = cariBalanceFilter?.value || "";
  const sortMode = cariSort?.value || "name-asc";
  const balances = new Map((records || []).map((item) => [item.id, calcCariBalance(item.id, movements, orders)]));
  const debtCount = (records || []).filter((item) => (balances.get(item.id) || 0) > 0).length;
  const creditCount = (records || []).filter((item) => (balances.get(item.id) || 0) < 0).length;
  const riskCount = (records || []).filter((item) => isCariLimitExceeded(item.id, movements, orders, item.riskLimit)).length;
  const debtAmount = (records || []).reduce((sum, item) => sum + Math.max(0, balances.get(item.id) || 0), 0);
  const creditAmount = (records || []).reduce((sum, item) => sum + Math.abs(Math.min(0, balances.get(item.id) || 0)), 0);
  if (totalEl) totalEl.textContent = String((records || []).length);
  if (cariStatTotalMeta) cariStatTotalMeta.textContent = `${formatCompactCurrency(debtAmount + creditAmount)} toplam hareket hacmi`;
  if (debtEl) debtEl.textContent = String(debtCount);
  if (creditEl) creditEl.textContent = String(creditCount);
  if (riskEl) riskEl.textContent = String(riskCount);
  if (debtAmountEl) debtAmountEl.textContent = formatCurrency(debtAmount);
  if (creditAmountEl) creditAmountEl.textContent = formatCurrency(creditAmount);
  if (cariStatRiskMeta) cariStatRiskMeta.textContent = riskCount ? "Aksiyon gerekli" : "Risk asimi yok";
  const filtered = (records || []).filter((item) => {
      const haystack = [buildCariCode(item.id, item.createdAt), item.companyName, item.fullName, item.phone, item.taxNumber, item.email].join(" ").toLowerCase();
      const matchesSearch = !searchTerm || haystack.includes(searchTerm);
      const matchesType = !typeTerm || item.type === typeTerm;
      const balance = balances.get(item.id) || 0;
      const exceeds = isCariLimitExceeded(item.id, movements, orders, item.riskLimit);
      const matchesBalance =
        !balanceFilter ||
        (balanceFilter === "debt" && balance > 0) ||
        (balanceFilter === "credit" && balance < 0) ||
        (balanceFilter === "risk" && exceeds);
      return matchesSearch && matchesType && matchesBalance;
    });
  const sorted = [...filtered].sort((left, right) => sortCariRecords(left, right, movements, orders, sortMode));
  const selectedCari = (records || []).find((item) => item.id === selectedCariId) || null;

  renderCariSticky(selectedCari, movements, orders);
  target.innerHTML = sorted.length ? sorted.map((item, index) => {
    const balance = balances.get(item.id) || 0;
    const exceeded = isCariLimitExceeded(item.id, movements, orders, item.riskLimit);
    const statusLabel = getCariAccountStatusLabel(item, exceeded);
    const statusNote = getCariBalanceStateLabel(balance);
    const statusClassName = getCariStatusClassName(statusLabel);
    const companyLabel = item.companyName || item.fullName || "-";
    const contactLabel = item.fullName || item.companyName || "-";
    const companyDisplay = shortenText(companyLabel, 22);
    const contactDisplay = shortenText(contactLabel, 16);
    return `
      <article class="cari-table-row ${selectedCariId === item.id ? "is-selected" : ""} ${exceeded ? "is-risk" : ""}" data-cari-select="${item.id}">
        <span class="cari-cell cell-code">
          <strong>${buildCariCode(item.id, item.createdAt)}</strong>
          <small>${String(index + 1).padStart(3, "0")}</small>
        </span>
        <span class="cari-cell cell-name">
          <strong title="${escapeHtml(companyLabel)}">${escapeHtml(companyDisplay)}</strong>
          <small title="${escapeHtml(contactLabel)}">${escapeHtml(contactDisplay)}</small>
        </span>
        <span class="cari-cell">${escapeHtml(item.phone || "-")}</span>
        <span class="cari-cell">${escapeHtml(item.email || "-")}</span>
        <span class="cari-cell cell-type">${escapeHtml(formatCariTypeLabel(item.type))}</span>
        <span class="cari-cell cell-money ${balance > 0 ? "is-debt" : balance < 0 ? "is-credit" : ""}">${formatCurrency(balance)}</span>
        <span class="cari-cell cell-money">${formatCurrency(item.riskLimit || 0)}</span>
        <span class="cari-cell cell-status">
          <span class="cari-status-stack">
            <b class="cari-row-status ${statusClassName}">${escapeHtml(statusLabel)}</b>
            <small>${escapeHtml(statusNote)}</small>
          </span>
        </span>
        <span class="cari-cell cell-actions">
          <button class="ghost-action compact-action cari-row-action cari-view-btn" type="button" data-id="${item.id}">Goruntule</button>
          <button class="ghost-action compact-action cari-row-action edit-cari-btn" type="button" data-id="${item.id}">Duzenle</button>
          <button class="ghost-action compact-action cari-row-action cari-movements-btn" type="button" data-id="${item.id}">Hareketler</button>
          <button class="ghost-action compact-action cari-row-action cari-offer-btn" type="button" data-id="${item.id}">Teklif Olustur</button>
          <button class="ghost-action compact-action cari-row-action delete-btn" type="button" data-store="${STORES.cari}" data-id="${item.id}">Sil</button>
        </span>
      </article>
    `;
  }).join("") : `<div class="entity-card empty-state">Cari kaydi bulunamadi.</div>`;
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

function getCariCodeYear(createdAt) {
  const candidateDate = createdAt ? new Date(createdAt) : new Date();
  const year = Number(candidateDate.getFullYear());
  return Number.isFinite(year) && year >= 2000 ? year : new Date().getFullYear();
}

function buildCariCode(id, createdAt) {
  return `CR-${getCariCodeYear(createdAt)}-${String(id || 0).padStart(4, "0")}`;
}

function buildCariDetailData(cari, movements, orders) {
  const offers = (cache.offers || [])
    .filter((item) => item.cariId === cari.id)
    .sort((left, right) => new Date(right.orderDate || right.createdAt || 0) - new Date(left.orderDate || left.createdAt || 0));
  const relatedOrders = (orders || [])
    .filter((item) => Number(item.cariId || 0) === Number(cari.id) || offers.some((offer) => offer.id === item.offerId))
    .sort((left, right) => new Date(right.orderDate || right.createdAt || 0) - new Date(left.orderDate || left.createdAt || 0));
  const relatedMovements = (movements || [])
    .filter((item) => item.cariId === cari.id)
    .sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0) || (right.id || 0) - (left.id || 0));
  const relatedOrderMovements = relatedOrders
    .flatMap((item) => item.accountMovements || [])
    .sort((left, right) => new Date(right.movementDate || 0) - new Date(left.movementDate || 0) || (right.id || 0) - (left.id || 0));
  const relatedFinanceEntries = relatedOrders
    .flatMap((item) => item.financeEntries || [])
    .sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0) || (right.id || 0) - (left.id || 0));
  const lastMovement = relatedMovements[0] || null;
  const balance = calcCariBalance(cari.id, movements, orders);
  const exceeded = isCariLimitExceeded(cari.id, movements, orders, cari.riskLimit);
  const movementTotals = calcCariMovementTotals(cari.id, movements);
  const summary = `${offers.length} teklif | ${relatedOrders.length} siparis | ${relatedMovements.length} hareket`;
  return { offers, relatedOrders, relatedMovements, relatedOrderMovements, relatedFinanceEntries, lastMovement, balance, exceeded, movementTotals, summary };
}

function getCariAccountStatusLabel(cari, exceeded) {
  if (cari?.accountStatus === "Pasif") return "Pasif";
  if (cari?.accountStatus === "Riskli" || exceeded) return "Riskli";
  return "Aktif";
}

function getCariBalanceStateLabel(balance) {
  if (balance > 0) return "Borclu";
  if (balance < 0) return "Alacakli";
  return "Bakiye Yok";
}

function getCariStatusClassName(statusLabel) {
  if (statusLabel === "Pasif") return "is-passive";
  if (statusLabel === "Riskli") return "is-risk";
  return "is-active";
}

function renderCariDetailContactMarkup(cari) {
  return `
    <div class="cari-detail-general-grid">
      <article><small>Yetkili</small><strong>${escapeHtml(cari.fullName || "-")}</strong></article>
      <article><small>Telefon</small><strong>${escapeHtml(cari.phone || "-")}</strong></article>
      <article><small>E-posta</small><strong>${escapeHtml(cari.email || "-")}</strong></article>
      <article><small>WhatsApp</small><strong>${escapeHtml(cari.whatsapp || "-")}</strong></article>
      <article><small>Ikinci Telefon</small><strong>${escapeHtml(cari.phone2 || "-")}</strong></article>
      <article><small>Departman</small><strong>${escapeHtml(cari.department || "-")}</strong></article>
      <article><small>Web Sitesi</small><strong>${escapeHtml(cari.website || "-")}</strong></article>
      <article><small>Kaynak</small><strong>${escapeHtml(cari.source || "-")}</strong></article>
    </div>
  `;
}

function renderCariDetailAddressMarkup(cari) {
  const addresses = Array.isArray(cari.addresses) ? cari.addresses.filter((item) => item?.city || item?.district || item?.fullAddress) : [];
  if (!addresses.length) {
    return `<div class="cari-detail-empty">Bu cari icin kayitli adres bulunmuyor.</div>`;
  }

  return `
    <div class="cari-detail-address-grid">
      ${addresses.map((address, index) => `
        <article class="cari-detail-address-card">
          <strong>${escapeHtml(address.type || `${index + 1}. Adres`)}</strong>
          <p>${escapeHtml([address.city, address.district].filter(Boolean).join(" / ") || "Il ve ilce girilmedi.")}</p>
          <p>${escapeHtml(address.fullAddress || "Acik adres girilmedi.")}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderCariDetailFinanceMarkup(cari, detailData) {
  const { balance, exceeded, movementTotals, relatedFinanceEntries, relatedOrderMovements, relatedOrders } = detailData;
  const limit = Number(cari.riskLimit || 0);
  const usageRatio = limit > 0 ? Math.min(999, Math.round((Math.max(balance, 0) / limit) * 100)) : 0;

  return `
    <div class="cari-detail-stack">
      <div class="cari-detail-general-grid">
        <article><small>Bakiye</small><strong>${formatCurrency(balance)}</strong></article>
        <article><small>Risk Limiti</small><strong>${formatCurrency(limit)}</strong></article>
        <article><small>Risk Kullanimi</small><strong>${limit > 0 ? `%${usageRatio}` : "Tanimli degil"}</strong></article>
        <article><small>Durum</small><strong>${escapeHtml(getCariAccountStatusLabel(cari, exceeded))}</strong></article>
        <article><small>Toplam Borc Hareketi</small><strong>${formatCurrency(movementTotals.debt || 0)}</strong></article>
        <article><small>Toplam Alacak Hareketi</small><strong>${formatCurrency(movementTotals.credit || 0)}</strong></article>
        <article><small>Vergi Dairesi</small><strong>${escapeHtml(cari.taxOffice || "-")}</strong></article>
        <article><small>Vergi / T.C. No</small><strong>${escapeHtml(cari.taxNumber || "-")}</strong></article>
        <article><small>IBAN</small><strong>${escapeHtml(cari.iban || "-")}</strong></article>
        <article><small>E-Fatura</small><strong>${escapeHtml(cari.eInvoiceStatus || "-")}</strong></article>
      </div>
      <article class="cari-detail-finance-card">
        <div class="cari-detail-subhead">
          <strong>Siparise Bagli Finans Kayitlari</strong>
          <span>${relatedFinanceEntries.length} kayit</span>
        </div>
        <p>${relatedFinanceEntries.length
          ? relatedFinanceEntries.slice(0, 5).map((entry) => `${entry.title || entry.type || "Kayit"} - ${formatCurrency(entry.amount || 0)}`).join(" | ")
          : "Cari bazli dogrudan finance_entries baglantisi bulunmuyor. Bu alanda siparislere bagli maliyet kayitlari gosteriliyor."}</p>
      </article>
      <article class="cari-detail-finance-card">
        <div class="cari-detail-subhead">
          <strong>Siparise Bagli Cari Hareketleri</strong>
          <span>${relatedOrderMovements.length} hareket</span>
        </div>
        <p>${relatedOrderMovements.length
          ? relatedOrderMovements.slice(0, 5).map((movement) => `${movement.movementType || "-"} - ${formatCurrency(movement.amount || 0)}`).join(" | ")
          : `${relatedOrders.length ? "Bu cariye ait siparislerde bagli hareket bulunmuyor." : "Bu cariye ait siparis kaydi bulunmuyor."}`}</p>
      </article>
    </div>
  `;
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
  if (select) {
    const currentValue = select.value;
    select.innerHTML = records.length ? records.map((item) => `<option value="${item.id}">${escapeHtml(item.companyName || item.fullName)}</option>`).join("") : `<option value="">Once cari ekleyin</option>`;
    if (currentValue && records.some((item) => String(item.id) === String(currentValue))) {
      select.value = currentValue;
    }
    handleOfferCariChange();
  }
  if (quickOrderCari) {
    const currentValue = quickOrderCari.value;
    quickOrderCari.innerHTML = records.length
      ? `<option value="">Cari secin</option>${records.map((item) => `<option value="${item.id}">${escapeHtml(item.companyName || item.fullName)}</option>`).join("")}`
      : `<option value="">Once cari ekleyin</option>`;
    if (currentValue && records.some((item) => String(item.id) === String(currentValue))) {
      quickOrderCari.value = currentValue;
    }
  }
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

function createDefaultOfferFormSections(config = {}) {
  return [
    {
      id: "products",
      title: String(config.productsTitle || "Urunler"),
      description: String(config.productsHelp || "Kategorileri acip ilgili urunleri alt listeden secerek teklif kalemine aktarabilirsiniz."),
      kind: "default",
      visible: true,
      locked: true,
    },
    {
      id: "header-info",
      title: "Ust Bilgiler",
      description: "Form tipi, teklif numarasi ve cari bilgilerini bu alanda gosterir.",
      kind: "default",
      visible: true,
      locked: true,
    },
    {
      id: "line-entry",
      title: String(config.lineTitle || "Kapak Siparis Kalemi"),
      description: String(config.lineHelp || "Soldan urun secin, olcu ve adet girin, sonra kalemi alt listeye ekleyin."),
      kind: "default",
      visible: true,
      locked: true,
    },
    {
      id: "line-list",
      title: String(config.lineListTitle || "Eklenen Olculer"),
      description: "Eklenen kalemleri liste halinde gosterir.",
      kind: "default",
      visible: true,
      locked: true,
    },
    {
      id: "summary",
      title: String(config.summaryTitle || "Toplam Ozeti"),
      description: "Adet, m2 ve toplam tutar ozetini gosterir.",
      kind: "default",
      visible: true,
      locked: true,
    },
  ];
}

function normalizeOfferFormSections(sections, config = {}) {
  const incoming = Array.isArray(sections) ? sections : [];
  const normalized = incoming
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: String(item.id || `custom-section-${Date.now()}-${index}`),
      title: String(item.title || `Bolum ${index + 1}`),
      description: String(item.description || ""),
      kind: item.kind === "custom" ? "custom" : "default",
      visible: item.visible !== false,
      locked: item.locked !== false,
    }));
  return normalized.length ? normalized : createDefaultOfferFormSections(config);
}

function cloneOfferFormSections(sections, config = {}) {
  return normalizeOfferFormSections(sections, config).map((section) => ({ ...section }));
}

function getOfferFormFieldDefinitions(config = {}) {
  return [
    { id: "formType", label: String(config.formTypeLabel || "Form Tipi"), sample: "Teklif Formu", defaultSectionId: "header-info", display: "compact" },
    { id: "offerNo", label: String(config.offerNoLabel || "Teklif / Siparis No"), sample: "SLV-TKF-2026-0008", defaultSectionId: "header-info", display: "compact" },
    { id: "cari", label: String(config.cariLabel || "Cari / Firma"), sample: "ARTHE MUTFAK - MUCAHIT TURGUT", defaultSectionId: "header-info", display: "wide" },
    { id: "offerDate", label: String(config.offerDateLabel || "Teklif Tarihi"), sample: "21.04.2026", defaultSectionId: "header-info", display: "normal" },
    { id: "termDays", label: String(config.termLabel || "Termin Suresi (Gun)"), sample: "1", defaultSectionId: "header-info", display: "normal" },
    { id: "deliveryDate", label: String(config.deliveryLabel || "Teslim Tarihi"), sample: "23.04.2026", defaultSectionId: "header-info", display: "normal" },
    { id: "shipping", label: "Kargo / Sevkiyat", sample: "Ambar teslim", defaultSectionId: "header-info", display: "normal" },
    { id: "discount", label: "Iskonto Orani (%)", sample: "5", defaultSectionId: "header-info", display: "normal" },
    { id: "vat", label: "KDV Orani (%)", sample: "20", defaultSectionId: "header-info", display: "normal" },
    { id: "lineHeight", label: "Boy", sample: "720", defaultSectionId: "line-entry", display: "entry" },
    { id: "lineWidth", label: "En", sample: "450", defaultSectionId: "line-entry", display: "entry" },
    { id: "lineQuantity", label: "Adet", sample: "4", defaultSectionId: "line-entry", display: "entry" },
    { id: "lineMaterial", label: "Malzeme", sample: "LAKE", defaultSectionId: "line-entry", display: "entry" },
    { id: "lineCover", label: "Kapak", sample: "Lake Kapak", defaultSectionId: "line-entry", display: "entry" },
    { id: "lineColor", label: "Renk", sample: "9010", defaultSectionId: "line-entry", display: "entry" },
    { id: "linePrice", label: "Fiyat", sample: "1.200", defaultSectionId: "line-entry", display: "entry" },
    { id: "lineNote", label: "Aciklama", sample: "Ust dolap", defaultSectionId: "line-entry", display: "entry" },
    { id: "summaryQuantity", label: "Toplam Adet", sample: "6", defaultSectionId: "summary", display: "summary" },
    { id: "summaryArea", label: "Toplam M2", sample: "1.656", defaultSectionId: "summary", display: "summary" },
    { id: "summaryNet", label: "Mal Hizmet", sample: "4.436 TL", defaultSectionId: "summary", display: "summary" },
    { id: "summaryTotal", label: "Genel Toplam", sample: "5.323 TL", defaultSectionId: "summary", display: "summary" },
  ];
}

function resolveOfferFormFieldMeta(field, config = {}) {
  const definition = getOfferFormFieldDefinitions(config).find((item) => item.id === field?.id);
  if (!definition) return null;
  return {
    ...definition,
    label: String(field?.customLabel || definition.label || ""),
    sample: String(field?.sampleText || definition.sample || ""),
    appearance: String(field?.appearance || "default"),
  };
}

function normalizeOfferFormFields(fields, config = {}) {
  const definitions = getOfferFormFieldDefinitions(config);
  const sectionIds = new Set(cloneOfferFormSections(config.sections, config).map((section) => section.id));
  const defaults = definitions.map((field) => ({
    id: field.id,
    sectionId: field.defaultSectionId,
    visible: true,
    customLabel: "",
    sampleText: "",
    appearance: "default",
  }));
  const incoming = Array.isArray(fields) ? fields : defaults;
  return definitions.map((definition) => {
    const matched = incoming.find((item) => item && item.id === definition.id) || defaults.find((item) => item.id === definition.id);
    const requestedSectionId = String(matched?.sectionId || definition.defaultSectionId);
    return {
      id: definition.id,
      sectionId: sectionIds.has(requestedSectionId) ? requestedSectionId : definition.defaultSectionId,
      visible: matched?.visible !== false,
      customLabel: String(matched?.customLabel || ""),
      sampleText: String(matched?.sampleText || ""),
      appearance: ["default", "soft", "accent", "outline"].includes(String(matched?.appearance || "")) ? String(matched.appearance) : "default",
    };
  });
}

function cloneOfferFormFields(fields, config = {}) {
  return normalizeOfferFormFields(fields, config).map((field) => ({ ...field }));
}

function createDefaultOfferFormDesign(overrides = {}) {
  return {
    id: overrides.id || `offer-form-${Date.now()}`,
    name: overrides.name || "Klasik Teklif Formu",
    config: {
      pageTitle: "Yeni Teklif Ekle",
      productsTitle: "Urunler",
      productsHelp: "Kategorileri acip ilgili urunleri alt listeden secerek teklif kalemine aktarabilirsiniz.",
      accentColor: "#5d7792",
      borderColor: "#cfd8e2",
      panelBg: "#ffffff",
      headerBg: "#e9eef5",
      fieldBg: "#fbfcfe",
      labelColor: "#56687d",
      textColor: "#203246",
      fontFamily: "Arial, sans-serif",
      baseFontSize: "12",
      titleFontSize: "15",
      radius: "6",
      sectionGap: "12",
      fieldHeight: "30",
      productsPanelWidth: "286",
      compactInfoWidth: "320",
      cardPadding: "8",
      compactFieldHeight: "24",
      density: "compact",
      formTypeLabel: "Form Tipi",
      offerNoLabel: "Teklif / Siparis No",
      cariLabel: "Cari / Firma",
      offerDateLabel: "Teklif Tarihi",
      termLabel: "Termin Suresi (Gun)",
      deliveryLabel: "Teslim Tarihi",
      lineTitle: "Kapak Siparis Kalemi",
      lineHelp: "Soldan urun secin, olcu ve adet girin, sonra kalemi alt listeye ekleyin.",
      lineListTitle: "Eklenen Olculer",
      summaryTitle: "Toplam Ozeti",
      sections: createDefaultOfferFormSections(overrides.config || {}),
      fields: cloneOfferFormFields(overrides.config?.fields, overrides.config || {}),
      customCss: "",
      ...overrides.config,
    },
  };
}

function loadOfferFormDesigns() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(OFFER_FORM_DESIGNS_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.map((item, index) => createDefaultOfferFormDesign({
      id: item?.id || `offer-form-${Date.now()}-${index}`,
      name: item?.name || `Teklif Tasarim ${index + 1}`,
      config: item?.config || {},
    })) : [];
  } catch {
    return [];
  }
}

function saveOfferFormDesignStore() {
  window.localStorage.setItem(OFFER_FORM_DESIGNS_STORAGE_KEY, JSON.stringify(offerFormDesigns));
  window.localStorage.setItem(OFFER_FORM_ACTIVE_DESIGN_STORAGE_KEY, activeOfferFormDesignId || "");
}

function getActiveOfferFormDesign() {
  return offerFormDesigns.find((item) => item.id === activeOfferFormDesignId) || offerFormDesigns[0] || null;
}

function renderOfferFormDesignList() {
  if (!offerFormDesignList) return;
  offerFormDesignList.innerHTML = offerFormDesigns.map((design) => `
    <article class="settings-form-card ${design.id === activeOfferFormDesignId ? "is-active" : ""}" data-offer-design-id="${design.id}">
      <strong>${escapeHtml(design.name)}</strong>
      <span>Yeni Teklif form tasarimi</span>
    </article>
  `).join("");
}

function applyOfferFormDesignToEditor(design) {
  if (!offerFormDesignEditor || !design) return;
  Object.entries(design.config || {}).forEach(([name, value]) => setFormFieldValue(offerFormDesignEditor, name, value));
  if (offerFormDesignName) offerFormDesignName.value = design.name || "";
  offerFormSectionDrafts = cloneOfferFormSections(design.config?.sections, design.config || {});
  offerFormFieldDrafts = cloneOfferFormFields(design.config?.fields, design.config || {});
  selectedOfferFormSectionId = offerFormSectionDrafts[0]?.id || "";
  selectedOfferFormFieldId = offerFormFieldDrafts[0]?.id || "";
  renderOfferFormSectionsList();
  renderOfferFormSectionEditor();
  renderOfferFormFieldsList();
  renderOfferFormFieldEditor();
}

function readOfferFormDesignConfigFromEditor() {
  const config = offerFormDesignEditor ? formToObject(offerFormDesignEditor) : {};
  config.sections = cloneOfferFormSections(offerFormSectionDrafts, config);
  config.fields = cloneOfferFormFields(offerFormFieldDrafts, config);
  return config;
}

function setOfferFormSaveButtonState() {
  if (!offerFormDesignSaveBtn) return;
  offerFormDesignSaveBtn.disabled = !hasPendingOfferFormDesignChanges;
  offerFormDesignSaveBtn.textContent = hasPendingOfferFormDesignChanges ? "Degisiklikleri Kaydet" : "Kaydedildi";
}

function updateOfferFormPreviewStatusBadge() {
  if (!offerFormPreviewStatusBadge) return;
  const activeDesign = getActiveOfferFormDesign();
  let label = "Canli";
  if (hasPendingOfferFormDesignChanges) {
    label = "Kaydedilmedi";
  } else if (activeDesign) {
    label = "Aktif Tasarim";
  }
  offerFormPreviewStatusBadge.textContent = label;
  offerFormPreviewStatusBadge.classList.toggle("is-dirty", hasPendingOfferFormDesignChanges);
  offerFormPreviewStatusBadge.classList.toggle("is-live", !hasPendingOfferFormDesignChanges);
  offerFormPreviewStatusBadge.title = activeDesign?.name ? `${label}: ${activeDesign.name}` : label;
}

function markOfferFormDesignAsDirty() {
  hasPendingOfferFormDesignChanges = true;
  setOfferFormSaveButtonState();
  updateOfferFormPreviewStatusBadge();
}

function clearOfferFormDesignDirtyState() {
  hasPendingOfferFormDesignChanges = false;
  setOfferFormSaveButtonState();
  updateOfferFormPreviewStatusBadge();
}

function updateActiveOfferFormDesignFromEditor() {
  const design = getActiveOfferFormDesign();
  if (!design || !offerFormDesignEditor) return;
  design.name = String(offerFormDesignName?.value || design.name || "").trim() || "Yeni Form Tasarimi";
  design.config = {
    ...design.config,
    ...readOfferFormDesignConfigFromEditor(),
  };
  activeOfferFormDesignId = design.id;
  saveOfferFormDesignStore();
  renderOfferFormDesignList();
  clearOfferFormDesignDirtyState();
}

function saveActiveOfferFormDesignChanges() {
  updateActiveOfferFormDesignFromEditor();
  refreshOfferFormDesignPreview();
}

function selectOfferFormDesign(designId) {
  const design = offerFormDesigns.find((item) => item.id === designId);
  if (!design) return;
  activeOfferFormDesignId = design.id;
  applyOfferFormDesignToEditor(design);
  saveOfferFormDesignStore();
  renderOfferFormDesignList();
  clearOfferFormDesignDirtyState();
  refreshOfferFormDesignPreview();
}

function ensureOfferFormDesignStore() {
  offerFormDesigns = loadOfferFormDesigns();
  if (!offerFormDesigns.length) {
    offerFormDesigns = [createDefaultOfferFormDesign()];
  }
  const storedActiveId = window.localStorage.getItem(OFFER_FORM_ACTIVE_DESIGN_STORAGE_KEY) || "";
  activeOfferFormDesignId = offerFormDesigns.some((item) => item.id === storedActiveId) ? storedActiveId : offerFormDesigns[0].id;
  const activeDesign = getActiveOfferFormDesign();
  if (activeDesign) {
    applyOfferFormDesignToEditor(activeDesign);
  }
  saveOfferFormDesignStore();
  renderOfferFormDesignList();
  clearOfferFormDesignDirtyState();
  refreshOfferFormDesignPreview();
}

function createOfferFormDesign(name = "", sourceConfig = null) {
  const newDesign = createDefaultOfferFormDesign({
    id: `offer-form-${Date.now()}`,
    name: name || "Yeni Form Tasarimi",
    config: sourceConfig ? { ...sourceConfig } : {},
  });
  offerFormDesigns.unshift(newDesign);
  activeOfferFormDesignId = newDesign.id;
  applyOfferFormDesignToEditor(newDesign);
  saveOfferFormDesignStore();
  renderOfferFormDesignList();
  clearOfferFormDesignDirtyState();
  refreshOfferFormDesignPreview();
}

function duplicateActiveOfferFormDesign() {
  const design = getActiveOfferFormDesign();
  if (!design) return;
  createOfferFormDesign(`${design.name} Kopya`, design.config);
}

function deleteActiveOfferFormDesign() {
  if (offerFormDesigns.length <= 1) {
    window.alert("En az bir form tasarimi kalmalidir.");
    return;
  }
  const design = getActiveOfferFormDesign();
  if (!design) return;
  if (!window.confirm(`"${design.name}" tasarimini silmek istiyor musunuz?`)) return;
  offerFormDesigns = offerFormDesigns.filter((item) => item.id !== design.id);
  activeOfferFormDesignId = offerFormDesigns[0]?.id || "";
  const nextDesign = getActiveOfferFormDesign();
  if (nextDesign) {
    applyOfferFormDesignToEditor(nextDesign);
  }
  saveOfferFormDesignStore();
  renderOfferFormDesignList();
  clearOfferFormDesignDirtyState();
  refreshOfferFormDesignPreview();
}

function handleOfferFormDesignEditorChange() {
  markOfferFormDesignAsDirty();
  refreshOfferFormDesignPreview();
}

function renderOfferFormSectionsList() {
  if (!offerFormSectionsList) return;
  offerFormSectionsList.innerHTML = offerFormSectionDrafts.map((section, index) => `
    <article class="offer-design-section-card ${section.id === selectedOfferFormSectionId ? "is-active" : ""} ${section.visible ? "" : "is-hidden"}" data-section-id="${section.id}">
      <div class="offer-design-section-meta">
        <strong>${escapeHtml(section.title || "Adsiz Bolum")}</strong>
        <span>${escapeHtml(section.description || "Bu bolum icin aciklama girilmedi.")}</span>
        <div class="offer-design-section-badges">
          <span class="offer-design-section-badge">${section.kind === "custom" ? "Ozel" : "Hazir"}</span>
          <span class="offer-design-section-badge">${section.visible ? "Gorunur" : "Gizli"}</span>
          <span class="offer-design-section-badge">Sira ${index + 1}</span>
        </div>
      </div>
      <div class="offer-design-section-actions">
        <button class="offer-design-section-btn" type="button" data-action="edit" data-section-id="${section.id}">Duzenle</button>
        <button class="offer-design-section-btn" type="button" data-action="up" data-section-id="${section.id}" ${index === 0 ? "disabled" : ""}>Yukari</button>
        <button class="offer-design-section-btn" type="button" data-action="down" data-section-id="${section.id}" ${index === offerFormSectionDrafts.length - 1 ? "disabled" : ""}>Asagi</button>
        <button class="offer-design-section-btn" type="button" data-action="toggle" data-section-id="${section.id}">${section.visible ? "Gizle" : "Goster"}</button>
        <button class="offer-design-section-btn danger" type="button" data-action="delete" data-section-id="${section.id}">Sil</button>
      </div>
    </article>
  `).join("");
}

function renderOfferFormSectionEditor() {
  const section = offerFormSectionDrafts.find((item) => item.id === selectedOfferFormSectionId) || offerFormSectionDrafts[0] || null;
  if (!section) {
    if (offerFormSectionTitle) offerFormSectionTitle.value = "";
    if (offerFormSectionDescription) offerFormSectionDescription.value = "";
    if (offerFormSectionKind) {
      offerFormSectionKind.value = "default";
      offerFormSectionKind.disabled = true;
    }
    return;
  }
  selectedOfferFormSectionId = section.id;
  if (offerFormSectionTitle) offerFormSectionTitle.value = section.title || "";
  if (offerFormSectionDescription) offerFormSectionDescription.value = section.description || "";
  if (offerFormSectionKind) {
    offerFormSectionKind.value = section.kind === "custom" ? "custom" : "default";
    offerFormSectionKind.disabled = section.locked !== false;
  }
}

function getOfferAssignableSections(includeHidden = true) {
  return offerFormSectionDrafts.filter((section) => includeHidden || section.visible);
}

function getOfferFieldsForSection(sectionId) {
  return offerFormFieldDrafts.filter((field) => field.sectionId === sectionId);
}

function persistOfferFormFieldLayout() {
  markOfferFormDesignAsDirty();
  renderOfferFormFieldsList();
  renderOfferFormFieldEditor();
  refreshOfferFormDesignPreview();
}

function moveOfferFormField(fieldId, targetSectionId, targetFieldId = "", position = "append") {
  const currentIndex = offerFormFieldDrafts.findIndex((field) => field.id === fieldId);
  if (currentIndex < 0) return;
  const movingField = { ...offerFormFieldDrafts[currentIndex], sectionId: targetSectionId };
  const remaining = offerFormFieldDrafts.filter((field) => field.id !== fieldId);
  if (!targetFieldId || targetFieldId === fieldId) {
    remaining.push(movingField);
    offerFormFieldDrafts = remaining;
    persistOfferFormFieldLayout();
    return;
  }
  const nextDrafts = [];
  let inserted = false;
  remaining.forEach((field) => {
    if (field.id === targetFieldId && position === "before") {
      nextDrafts.push(movingField);
      inserted = true;
    }
    nextDrafts.push(field);
    if (field.id === targetFieldId && position !== "before") {
      nextDrafts.push(movingField);
      inserted = true;
    }
  });
  if (!inserted) nextDrafts.push(movingField);
  offerFormFieldDrafts = nextDrafts;
  persistOfferFormFieldLayout();
}

function renderOfferFormFieldsList() {
  if (!offerFormFieldsList) return;
  const definitions = getOfferFormFieldDefinitions(getOfferFormPreviewConfig());
  const sections = getOfferAssignableSections(true);
  offerFormFieldsList.innerHTML = sections.map((section) => {
    const sectionFields = getOfferFieldsForSection(section.id);
    return `
      <section class="offer-design-field-group" data-section-group="${section.id}">
        <div class="offer-design-field-group-head">
          <strong>${escapeHtml(section.title)}</strong>
          <span>${escapeHtml(section.description || "Bu bolumdeki alanlari siralayin veya baska bolume tasiyin.")}</span>
        </div>
        <div class="offer-design-field-group-body" data-drop-section-id="${section.id}">
          ${sectionFields.length ? sectionFields.map((draft, index) => {
            const definition = definitions.find((item) => item.id === draft.id);
            if (!definition) return "";
            const fieldMeta = resolveOfferFormFieldMeta(draft, getOfferFormPreviewConfig()) || definition;
            return `
              <article class="offer-design-field-card ${draggedOfferFormFieldId === draft.id ? "is-dragging" : ""} ${selectedOfferFormFieldId === draft.id ? "is-selected" : ""}" draggable="true" data-field-card="${draft.id}" data-field-id="${draft.id}" data-section-id="${section.id}">
                <div class="offer-design-field-handle" aria-hidden="true" title="Surukleyerek tasi">
                  <span></span><span></span><span></span>
                  <span></span><span></span><span></span>
                </div>
                <div class="offer-design-field-meta">
                  <strong>${escapeHtml(fieldMeta.label)}</strong>
                  <span>${escapeHtml(fieldMeta.sample)}</span>
                </div>
                <div class="offer-design-field-controls">
                  <button class="offer-design-field-order-btn" type="button" data-action="field-edit" data-field-id="${draft.id}">Duzenle</button>
                  <button class="offer-design-field-order-btn" type="button" data-action="field-up" data-field-id="${draft.id}" ${index === 0 ? "disabled" : ""}>Yukari</button>
                  <button class="offer-design-field-order-btn" type="button" data-action="field-down" data-field-id="${draft.id}" ${index === sectionFields.length - 1 ? "disabled" : ""}>Asagi</button>
                  <label>
                    <span>Bagli Bolum</span>
                    <select data-field-id="${definition.id}" data-role="section">
                      ${sections.map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === draft.sectionId ? "selected" : ""}>${escapeHtml(item.title)}</option>`).join("")}
                    </select>
                  </label>
                  <label class="offer-design-field-toggle">
                    <input type="checkbox" data-field-id="${definition.id}" data-role="visible" ${draft.visible ? "checked" : ""}>
                    <span>${draft.visible ? "Gorunur" : "Gizli"}</span>
                  </label>
                  <span class="offer-design-field-badge">${escapeHtml(fieldMeta.appearance === "default" ? "Surukle-Birak" : `Stil: ${fieldMeta.appearance}`)}</span>
                </div>
              </article>
            `;
          }).join("") : `<div class="offer-design-field-empty" data-drop-section-id="${section.id}">Bu bolume alan tasiyin veya surukleyin.</div>`}
        </div>
      </section>
    `;
  }).join("");
}

function renderOfferFormFieldEditor() {
  if (!offerFormFieldEditorPanel) return;
  const draft = offerFormFieldDrafts.find((item) => item.id === selectedOfferFormFieldId) || offerFormFieldDrafts[0] || null;
  const meta = draft ? resolveOfferFormFieldMeta(draft, getOfferFormPreviewConfig()) : null;
  offerFormFieldEditorPanel.classList.toggle("is-empty", !draft);
  if (offerFormFieldLabel) {
    offerFormFieldLabel.disabled = !draft;
    offerFormFieldLabel.value = draft ? String(draft.customLabel || meta?.label || "") : "";
    offerFormFieldLabel.placeholder = meta?.label || "Alan basligi";
  }
  if (offerFormFieldSample) {
    offerFormFieldSample.disabled = !draft;
    offerFormFieldSample.value = draft ? String(draft.sampleText || meta?.sample || "") : "";
    offerFormFieldSample.placeholder = meta?.sample || "Kutuda gorunecek ornek icerik";
  }
  if (offerFormFieldAppearance) {
    offerFormFieldAppearance.disabled = !draft;
    offerFormFieldAppearance.value = draft ? String(draft.appearance || "default") : "default";
  }
  if (offerFormFieldResetBtn) {
    offerFormFieldResetBtn.disabled = !draft;
    offerFormFieldResetBtn.textContent = meta ? `"${meta.label}" Alanini Sifirla` : "Alani Sifirla";
  }
}

function markOfferFormSectionsDirty() {
  markOfferFormDesignAsDirty();
  renderOfferFormSectionsList();
  renderOfferFormSectionEditor();
  renderOfferFormFieldsList();
  renderOfferFormFieldEditor();
  refreshOfferFormDesignPreview();
}

function createOfferFormSection() {
  const sectionId = `custom-section-${Date.now()}`;
  offerFormSectionDrafts.push({
    id: sectionId,
    title: "Yeni Ozel Bolum",
    description: "Bu bolume daha sonra alanlar ve ozel icerik ekleyebilirsiniz.",
    kind: "custom",
    visible: true,
    locked: false,
  });
  selectedOfferFormSectionId = sectionId;
  markOfferFormSectionsDirty();
}

function handleOfferFormSectionsListClick(event) {
  const button = event.target.closest("[data-action][data-section-id]");
  if (!button) return;
  const sectionId = String(button.dataset.sectionId || "");
  const action = String(button.dataset.action || "");
  if (!sectionId || !action) return;
  if (action === "select" || action === "edit") {
    selectedOfferFormSectionId = sectionId;
    renderOfferFormSectionsList();
    renderOfferFormSectionEditor();
    return;
  }
  const index = offerFormSectionDrafts.findIndex((item) => item.id === sectionId);
  if (index < 0) return;
  if (action === "up" && index > 0) {
    [offerFormSectionDrafts[index - 1], offerFormSectionDrafts[index]] = [offerFormSectionDrafts[index], offerFormSectionDrafts[index - 1]];
    selectedOfferFormSectionId = sectionId;
    markOfferFormSectionsDirty();
    return;
  }
  if (action === "down" && index < offerFormSectionDrafts.length - 1) {
    [offerFormSectionDrafts[index + 1], offerFormSectionDrafts[index]] = [offerFormSectionDrafts[index], offerFormSectionDrafts[index + 1]];
    selectedOfferFormSectionId = sectionId;
    markOfferFormSectionsDirty();
    return;
  }
  if (action === "toggle") {
    offerFormSectionDrafts[index].visible = !offerFormSectionDrafts[index].visible;
    selectedOfferFormSectionId = sectionId;
    markOfferFormSectionsDirty();
    return;
  }
  if (action === "delete") {
    if (offerFormSectionDrafts.length <= 1) {
      window.alert("En az bir bolum kalmalidir.");
      return;
    }
    if (!window.confirm(`"${offerFormSectionDrafts[index].title}" bolumunu silmek istiyor musunuz?`)) return;
    offerFormSectionDrafts.splice(index, 1);
    selectedOfferFormSectionId = offerFormSectionDrafts[Math.max(0, index - 1)]?.id || offerFormSectionDrafts[0]?.id || "";
    markOfferFormSectionsDirty();
  }
}

function handleOfferFormSectionEditorChange() {
  const section = offerFormSectionDrafts.find((item) => item.id === selectedOfferFormSectionId);
  if (!section) return;
  section.title = String(offerFormSectionTitle?.value || "").trim() || "Adsiz Bolum";
  section.description = String(offerFormSectionDescription?.value || "").trim();
  if (section.locked === false) {
    section.kind = offerFormSectionKind?.value === "custom" ? "custom" : "default";
  }
  markOfferFormDesignAsDirty();
  renderOfferFormSectionsList();
  renderOfferFormFieldsList();
  refreshOfferFormDesignPreview();
}

function handleOfferFormFieldsListChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const fieldId = String(target.dataset.fieldId || "");
  const role = String(target.dataset.role || "");
  if (!fieldId || !role) return;
  const draft = offerFormFieldDrafts.find((item) => item.id === fieldId);
  if (!draft) return;
  if (role === "section" && target instanceof HTMLSelectElement) {
    draft.sectionId = target.value;
  }
  if (role === "visible" && target instanceof HTMLInputElement) {
    draft.visible = target.checked;
    const label = target.closest(".offer-design-field-toggle")?.querySelector("span");
    if (label) label.textContent = target.checked ? "Gorunur" : "Gizli";
  }
  markOfferFormDesignAsDirty();
  renderOfferFormFieldsList();
  renderOfferFormFieldEditor();
  refreshOfferFormDesignPreview();
}

function handleOfferFormFieldsListClick(event) {
  const button = event.target.closest("[data-action][data-field-id]");
  if (!button) return;
  const fieldId = String(button.dataset.fieldId || "");
  const action = String(button.dataset.action || "");
  if (!fieldId || !action) return;
  const draft = offerFormFieldDrafts.find((field) => field.id === fieldId);
  if (!draft) return;
  selectedOfferFormFieldId = fieldId;
  renderOfferFormFieldsList();
  renderOfferFormFieldEditor();
  const sectionFields = getOfferFieldsForSection(draft.sectionId);
  const index = sectionFields.findIndex((field) => field.id === fieldId);
  if (index < 0) return;
  if (action === "field-edit") {
    return;
  }
  if (action === "field-up" && index > 0) {
    moveOfferFormField(fieldId, draft.sectionId, sectionFields[index - 1].id, "before");
  }
  if (action === "field-down" && index < sectionFields.length - 1) {
    moveOfferFormField(fieldId, draft.sectionId, sectionFields[index + 1].id, "after");
  }
}

function handleOfferFormFieldEditorChange() {
  const draft = offerFormFieldDrafts.find((item) => item.id === selectedOfferFormFieldId);
  if (!draft) return;
  const definition = getOfferFormFieldDefinitions(getOfferFormPreviewConfig()).find((item) => item.id === draft.id);
  draft.customLabel = String(offerFormFieldLabel?.value || "").trim();
  draft.sampleText = String(offerFormFieldSample?.value || "").trim();
  draft.appearance = String(offerFormFieldAppearance?.value || "default");
  if (definition && draft.customLabel === definition.label) draft.customLabel = "";
  if (definition && draft.sampleText === definition.sample) draft.sampleText = "";
  if (!["default", "soft", "accent", "outline"].includes(draft.appearance)) {
    draft.appearance = "default";
  }
  markOfferFormDesignAsDirty();
  renderOfferFormFieldsList();
  renderOfferFormFieldEditor();
  refreshOfferFormDesignPreview();
}

function resetSelectedOfferFormFieldCustomization() {
  const draft = offerFormFieldDrafts.find((item) => item.id === selectedOfferFormFieldId);
  if (!draft) return;
  draft.customLabel = "";
  draft.sampleText = "";
  draft.appearance = "default";
  markOfferFormDesignAsDirty();
  renderOfferFormFieldsList();
  renderOfferFormFieldEditor();
  refreshOfferFormDesignPreview();
}

function handleOfferFormFieldsDragStart(event) {
  const card = event.target.closest("[data-field-card]");
  if (!card) return;
  draggedOfferFormFieldId = String(card.dataset.fieldId || "");
  if (!draggedOfferFormFieldId) return;
  card.classList.add("is-dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedOfferFormFieldId);
  }
}

function handleOfferFormFieldsDragOver(event) {
  const dropTarget = event.target.closest("[data-field-card], [data-drop-section-id]");
  if (!dropTarget || !draggedOfferFormFieldId) return;
  event.preventDefault();
  updateOfferFormDropIndicators(dropTarget, event);
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

function handleOfferFormFieldsDragLeave(event) {
  if (!offerFormFieldsList || !draggedOfferFormFieldId) return;
  const related = event.relatedTarget;
  if (related instanceof Node && offerFormFieldsList.contains(related)) return;
  clearOfferFormDropIndicators();
}

function handleOfferFormFieldsDrop(event) {
  const dropCard = event.target.closest("[data-field-card]");
  const dropZone = event.target.closest("[data-drop-section-id]");
  if ((!dropCard && !dropZone) || !draggedOfferFormFieldId) return;
  event.preventDefault();
  if (dropCard) {
    const targetFieldId = String(dropCard.dataset.fieldId || "");
    const targetSectionId = String(dropCard.dataset.sectionId || "");
    if (targetFieldId && targetSectionId && targetFieldId !== draggedOfferFormFieldId) {
      moveOfferFormField(draggedOfferFormFieldId, targetSectionId, targetFieldId, currentOfferFieldDropPosition);
      clearOfferFormFieldDragState();
      return;
    }
  }
  if (dropZone) {
    const targetSectionId = String(dropZone.dataset.dropSectionId || "");
    if (targetSectionId) {
      moveOfferFormField(draggedOfferFormFieldId, targetSectionId);
    }
  }
  clearOfferFormFieldDragState();
}

function clearOfferFormFieldDragState() {
  draggedOfferFormFieldId = "";
  currentOfferFieldDropPosition = "before";
  clearOfferFormDropIndicators();
  offerFormFieldsList?.querySelectorAll(".is-dragging").forEach((node) => node.classList.remove("is-dragging"));
}

function clearOfferFormDropIndicators() {
  offerFormFieldsList?.querySelectorAll(".is-drop-target, .is-drop-zone-active, .is-drop-before, .is-drop-after").forEach((node) => {
    node.classList.remove("is-drop-target", "is-drop-zone-active", "is-drop-before", "is-drop-after");
  });
}

function updateOfferFormDropIndicators(dropTarget, event) {
  clearOfferFormDropIndicators();
  const groupBody = dropTarget.closest("[data-drop-section-id]");
  const card = dropTarget.closest("[data-field-card]");
  if (groupBody) {
    groupBody.classList.add("is-drop-zone-active");
  }
  if (card && String(card.dataset.fieldId || "") !== draggedOfferFormFieldId) {
    card.classList.add("is-drop-target");
    const rect = card.getBoundingClientRect();
    const relativeY = event.clientY - rect.top;
    currentOfferFieldDropPosition = relativeY > rect.height / 2 ? "after" : "before";
    card.classList.add(currentOfferFieldDropPosition === "after" ? "is-drop-after" : "is-drop-before");
  }
}

function getOfferFormPreviewConfig() {
  const baseConfig = offerFormDesignEditor ? formToObject(offerFormDesignEditor) : (getActiveOfferFormDesign()?.config || createDefaultOfferFormDesign().config);
  return {
    ...baseConfig,
    sections: cloneOfferFormSections(offerFormSectionDrafts, baseConfig),
    fields: cloneOfferFormFields(offerFormFieldDrafts, baseConfig),
  };
}

function refreshOfferFormDesignPreview() {
  if (!offerFormDesignPreviewFrame) return;
  offerFormDesignPreviewFrame.srcdoc = buildOfferFormPreviewHtml(getOfferFormPreviewConfig());
}

function buildOfferFormPreviewHtml(config = {}) {
  const fontFamily = String(config.fontFamily || "Arial, sans-serif");
  const baseFontSize = Math.max(10, Math.min(16, Number(config.baseFontSize || 12) || 12));
  const titleFontSize = Math.max(12, Math.min(24, Number(config.titleFontSize || 15) || 15));
  const radius = Math.max(0, Math.min(16, Number(config.radius || 6) || 6));
  const sectionGap = Math.max(6, Math.min(24, Number(config.sectionGap || 12) || 12));
  const fieldHeight = Math.max(24, Math.min(44, Number(config.fieldHeight || 30) || 30));
  const productsPanelWidth = Math.max(220, Math.min(420, Number(config.productsPanelWidth || 286) || 286));
  const compactInfoWidth = Math.max(220, Math.min(420, Number(config.compactInfoWidth || 320) || 320));
  const cardPadding = Math.max(4, Math.min(18, Number(config.cardPadding || 8) || 8));
  const compactFieldHeight = Math.max(20, Math.min(40, Number(config.compactFieldHeight || 24) || 24));
  const densityMap = {
    compact: { pad: 8, subPad: 6, listPad: 7 },
    balanced: { pad: 10, subPad: 8, listPad: 9 },
    airy: { pad: 12, subPad: 10, listPad: 11 },
  };
  const density = densityMap[String(config.density || "compact")] || densityMap.compact;
  const sections = cloneOfferFormSections(config.sections, config).filter((section) => section.visible);
  const fieldDefinitions = getOfferFormFieldDefinitions(config);
  const fields = cloneOfferFormFields(config.fields, config)
    .filter((field) => field.visible)
    .map((field) => ({ ...field, meta: resolveOfferFormFieldMeta(field, config) || fieldDefinitions.find((definition) => definition.id === field.id) }))
    .filter((field) => field.meta);
  const sampleCategories = [
    { name: "Lake Kapak", items: ["Lake Kapak Beyaz Duz", "Lake Kapak RAL Duz", "Lake Kapak Citali"] },
    { name: "Ham Kapak", items: ["Ham Kapak Duz", "Ham Kapak Tarama"] },
    { name: "Camli Kapak", items: ["Camli Cerceve", "Camli Citali"] },
  ];
  const renderAssignedFields = (sectionId, displayMode = "card-grid") => {
    const assignedFields = fields.filter((field) => field.sectionId === sectionId);
    if (!assignedFields.length) {
      return `<div class="empty-section-note">Bu bolume atanmis alan yok.</div>`;
    }
    if (displayMode === "entry-grid") {
      return `
        <div class="line-grid">
          ${assignedFields.map((field) => `<div class="cell-head">${escapeHtml(field.meta.label)}</div>`).join("")}
          ${assignedFields.map((field) => `<div class="field-box field-appearance-${escapeHtml(field.meta.appearance || "default")}">${escapeHtml(field.meta.sample)}</div>`).join("")}
        </div>
      `;
    }
    if (displayMode === "summary-grid") {
      return `
        <div class="summary-grid">
          ${assignedFields.map((field) => `
            <div class="summary-card field-appearance-${escapeHtml(field.meta.appearance || "default")}">
              <span>${escapeHtml(field.meta.label)}</span>
              <strong>${escapeHtml(field.meta.sample)}</strong>
            </div>
          `).join("")}
        </div>
      `;
    }
    if (sectionId === "header-info") {
      const headerFieldOrder = [
        "formType",
        "offerNo",
        "offerDate",
        "cari",
        "termDays",
        "deliveryDate",
        "shipping",
        "discount",
        "vat",
      ];
      const orderedHeaderFields = [...assignedFields].sort((a, b) => {
        const aIndex = headerFieldOrder.indexOf(a.id);
        const bIndex = headerFieldOrder.indexOf(b.id);
        return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
      });
      return `
        <div class="header-info-grid">
          ${orderedHeaderFields.map((field) => `
            <div class="field-card field-appearance-${escapeHtml(field.meta.appearance || "default")} field-${escapeHtml(field.id)} ${field.meta.display === "wide" ? "wide" : ""}">
              <label>${escapeHtml(field.meta.label)}</label>
              <div class="field-box">${escapeHtml(field.meta.sample)}</div>
            </div>
          `).join("")}
        </div>
      `;
    }
    const compactFields = assignedFields.filter((field) => field.meta.display === "compact");
    const regularFields = assignedFields.filter((field) => field.meta.display !== "compact");
    return `
      ${compactFields.length ? `
        <div class="top-header">
          <div></div>
          <div class="top-side">
            ${compactFields.map((field) => `
              <div class="field-card compact field-appearance-${escapeHtml(field.meta.appearance || "default")}">
                <label>${escapeHtml(field.meta.label)}</label>
                <div class="field-box">${escapeHtml(field.meta.sample)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ``}
      ${regularFields.length ? `
        <div class="top-main generic-main-grid">
          ${regularFields.map((field) => `
            <div class="field-card field-appearance-${escapeHtml(field.meta.appearance || "default")} ${field.meta.display === "wide" ? "wide" : ""}">
              <label>${escapeHtml(field.meta.label)}</label>
              <div class="field-box">${escapeHtml(field.meta.sample)}</div>
            </div>
          `).join("")}
        </div>
      ` : ``}
    `;
  };
  const renderSectionMarkup = (section) => {
    if (section.id === "products") {
      return `
        <section class="panel">
          <div class="panel-head">
            <strong>${escapeHtml(section.title || config.productsTitle || "Urunler")}</strong>
            <span>${escapeHtml(section.description || config.productsHelp || "")}</span>
          </div>
          <div class="products">
            ${sampleCategories.map((category, index) => `
              <div class="cat">
                <div class="cat-head"><span>${escapeHtml(category.name)}</span><span>${index === 0 ? "-" : "+"}</span></div>
                ${index === 0 ? `<div class="cat-items">
                  ${category.items.map((item) => `<div class="prod"><strong>${escapeHtml(item)}</strong><span>${escapeHtml(category.name)} urunu</span></div>`).join("")}
                </div>` : ``}
              </div>
            `).join("")}
          </div>
        </section>
      `;
    }
    if (section.id === "header-info") {
      return `
        <section class="header-section">
          <div class="section-note">
            <strong>${escapeHtml(section.title || "Ust Bilgiler")}</strong>
            <span>${escapeHtml(section.description || "")}</span>
          </div>
          ${renderAssignedFields(section.id, "card-grid")}
        </section>
      `;
    }
    if (section.id === "line-entry") {
      return `
        <section class="line-panel">
          <div class="line-head">
            <div><strong>${escapeHtml(section.title || config.lineTitle || "Kapak Siparis Kalemi")}</strong><span>${escapeHtml(section.description || config.lineHelp || "")}</span></div>
            <div class="field-box line-action-box" style="width:84px; justify-content:center; background:${escapeHtml(config.accentColor || "#5d7792")}; color:#fff; border-color:${escapeHtml(config.accentColor || "#5d7792")};">Ekle</div>
          </div>
          ${renderAssignedFields(section.id, "entry-grid")}
        </section>
      `;
    }
    if (section.id === "line-list") {
      return `
        <section class="list-panel">
          <div class="line-list-head">
            <strong>${escapeHtml(section.title || config.lineListTitle || "Eklenen Olculer")}</strong>
            <span>${escapeHtml(section.description || "2 kalem") || "2 kalem"}</span>
          </div>
          <div class="line-row"><div><strong>Lake Kapak</strong><div>LAKE | 9010</div></div><div>720 x 450 mm<br>4 adet</div><div><strong>3.456 TL</strong><div>1.296 m2</div></div><div>X</div></div>
          <div class="line-row"><div><strong>Ham Kapak</strong><div>HAM | Dogal</div></div><div>600 x 300 mm<br>2 adet</div><div><strong>980 TL</strong><div>0.360 m2</div></div><div>X</div></div>
        </section>
      `;
    }
    if (section.id === "summary") {
      return `
        <section class="summary-panel">
          <div class="summary-title">${escapeHtml(section.title || config.summaryTitle || "Toplam Ozeti")}</div>
          ${section.description ? `<div class="section-note summary-note"><span>${escapeHtml(section.description)}</span></div>` : ``}
          ${renderAssignedFields(section.id, "summary-grid")}
        </section>
      `;
    }
    return `
      <section class="custom-panel">
        <div class="custom-panel-head">
          <strong>${escapeHtml(section.title || "Yeni Ozel Bolum")}</strong>
          <span>${escapeHtml(section.description || "Bu alan daha sonra ozel icerikle doldurulabilir.")}</span>
        </div>
        <div class="custom-panel-body ${fields.some((field) => field.sectionId === section.id) ? "has-fields" : ""}">
          ${fields.some((field) => field.sectionId === section.id)
            ? renderAssignedFields(section.id, "card-grid")
            : `<div class="custom-placeholder">Ozel icerik alani</div>
               <div class="custom-placeholder">Serbest kutu</div>
               <div class="custom-placeholder">Not veya ek bilgi</div>`}
        </div>
      </section>
    `;
  };
  const visibleProductsFirst = sections[0]?.id === "products";
  const productsSection = sections.find((section) => section.id === "products");
  const mainSections = visibleProductsFirst ? sections.filter((section) => section.id !== "products") : sections;
  return `
    <!doctype html>
    <html lang="tr">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(config.pageTitle || "Yeni Teklif Ekle")}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; background: #f3f5f8; color: ${escapeHtml(config.textColor || "#203246")}; font-family: ${escapeHtml(fontFamily)}; font-size: ${baseFontSize}px; }
          .wrap { padding: 18px; }
          .page-title { margin: 0 0 ${sectionGap}px; font-size: ${titleFontSize}px; font-weight: 700; }
          .stack-main, .main { display: grid; gap: ${sectionGap}px; }
          .layout { display: grid; grid-template-columns: ${productsPanelWidth}px minmax(0, 1fr); gap: ${sectionGap}px; }
          .panel { border: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; border-radius: ${radius}px; background: ${escapeHtml(config.panelBg || "#ffffff")}; overflow: hidden; }
          .panel-head { padding: ${density.pad}px ${density.pad + 2}px; border-bottom: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; background: ${escapeHtml(config.headerBg || "#e9eef5")}; }
          .panel-head strong { display: block; font-size: ${Math.max(11, titleFontSize - 1)}px; }
          .panel-head span { display: block; margin-top: 3px; color: ${escapeHtml(config.labelColor || "#56687d")}; font-size: ${Math.max(9, baseFontSize - 2)}px; }
          .products { padding: ${density.subPad}px; background: ${escapeHtml(config.panelBg || "#ffffff")}; }
          .cat { border: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; margin-bottom: 4px; }
          .cat-head { display: flex; justify-content: space-between; gap: 8px; padding: 7px 8px; background: ${escapeHtml(config.headerBg || "#e9eef5")}; font-size: ${Math.max(10, baseFontSize - 1)}px; font-weight: 700; }
          .cat-items { border-top: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; }
          .prod { display: grid; gap: 2px; padding: 7px 10px 7px 18px; border-top: 1px solid #e4e9f0; background: ${escapeHtml(config.fieldBg || "#fbfcfe")}; }
          .prod strong { font-size: ${Math.max(10, baseFontSize - 1)}px; }
          .prod span { color: ${escapeHtml(config.labelColor || "#56687d")}; font-size: ${Math.max(9, baseFontSize - 3)}px; }
          .section-note { display: grid; gap: 3px; padding: 0 0 8px; }
          .section-note strong { font-size: ${Math.max(10, baseFontSize)}px; }
          .section-note span { color: ${escapeHtml(config.labelColor || "#56687d")}; font-size: ${Math.max(9, baseFontSize - 2)}px; }
          .header-info-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 4px; align-items: start; }
          .header-info-grid .field-card { min-width: 0; }
          .header-info-grid .field-card { padding: ${Math.max(4, cardPadding - 2)}px; gap: 3px; }
          .header-info-grid .field-formType { grid-column: 1 / span 2; grid-row: 1; }
          .header-info-grid .field-offerNo { grid-column: 3 / span 6; grid-row: 1; }
          .header-info-grid .field-offerDate { grid-column: 9 / span 2; grid-row: 1; }
          .header-info-grid .field-cari { grid-column: 11 / span 2; grid-row: 1; }
          .header-info-grid .field-termDays,
          .header-info-grid .field-deliveryDate,
          .header-info-grid .field-shipping,
          .header-info-grid .field-discount,
          .header-info-grid .field-vat { grid-column: span 3; }
          .header-info-grid .field-termDays { grid-row: 2; }
          .header-info-grid .field-deliveryDate { grid-row: 2; }
          .header-info-grid .field-shipping { grid-row: 2; }
          .header-info-grid .field-discount { grid-row: 2; }
          .header-info-grid .field-vat { grid-row: 2; }
          .header-info-grid .field-card label { font-size: ${Math.max(7, baseFontSize - 4)}px; line-height: 1.15; }
          .header-info-grid .field-card .field-box { height: ${Math.max(24, fieldHeight - 4)}px; font-size: ${Math.max(9, baseFontSize - 2)}px; }
          .header-info-grid .field-offerNo .field-box,
          .header-info-grid .field-cari .field-box { height: auto; min-height: ${Math.max(24, fieldHeight - 4)}px; padding-top: 4px; padding-bottom: 4px; white-space: normal; line-height: 1.2; align-items: flex-start; }
          .top-header { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: start; }
          .top-side { display: grid; grid-template-columns: repeat(2, minmax(120px, 1fr)); gap: 6px; width: ${compactInfoWidth}px; margin-left: auto; }
          .top-main { display: grid; grid-template-columns: minmax(180px, 1.3fr) repeat(3, minmax(110px, 0.8fr)); gap: 6px; }
          .generic-main-grid { grid-template-columns: repeat(4, minmax(120px, 1fr)); }
          .field-card { display: grid; gap: 4px; padding: ${cardPadding}px; border: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; border-radius: ${radius}px; background: ${escapeHtml(config.panelBg || "#ffffff")}; }
          .field-card.compact { padding: ${Math.max(4, cardPadding - 2)}px; }
          .field-card.wide { grid-column: span 2; }
          .field-card label { font-size: ${Math.max(8, baseFontSize - 3)}px; text-transform: uppercase; color: ${escapeHtml(config.labelColor || "#56687d")}; font-weight: 700; letter-spacing: 0.02em; }
          .field-box { height: ${fieldHeight}px; display: flex; align-items: center; padding: 0 8px; border: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; border-radius: ${Math.max(4, radius - 2)}px; background: ${escapeHtml(config.fieldBg || "#fbfcfe")}; font-size: ${Math.max(10, baseFontSize - 1)}px; font-weight: 600; }
          .field-card.compact .field-box { height: ${compactFieldHeight}px; font-size: ${Math.max(9, baseFontSize - 2)}px; }
          .field-card.field-appearance-soft { background: rgba(93, 119, 146, 0.07); }
          .field-card.field-appearance-soft .field-box, .field-box.field-appearance-soft, .summary-card.field-appearance-soft { background: rgba(93, 119, 146, 0.09); }
          .field-card.field-appearance-accent { border-color: ${escapeHtml(config.accentColor || "#5d7792")}; background: rgba(93, 119, 146, 0.04); }
          .field-card.field-appearance-accent label { color: ${escapeHtml(config.accentColor || "#5d7792")}; }
          .field-card.field-appearance-accent .field-box, .field-box.field-appearance-accent, .summary-card.field-appearance-accent { border-color: ${escapeHtml(config.accentColor || "#5d7792")}; background: rgba(93, 119, 146, 0.12); box-shadow: inset 0 0 0 1px rgba(93, 119, 146, 0.08); }
          .summary-card.field-appearance-accent span { color: ${escapeHtml(config.accentColor || "#5d7792")}; }
          .field-card.field-appearance-outline, .summary-card.field-appearance-outline { background: transparent; box-shadow: inset 0 0 0 1px ${escapeHtml(config.borderColor || "#cfd8e2")}; }
          .field-card.field-appearance-outline .field-box, .field-box.field-appearance-outline, .summary-card.field-appearance-outline { background: transparent; border-style: dashed; }
          .line-panel, .list-panel, .summary-panel { border: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; border-radius: ${radius}px; background: ${escapeHtml(config.panelBg || "#ffffff")}; overflow: hidden; }
          .line-head { display: flex; justify-content: space-between; gap: 8px; padding: ${density.pad}px; border-bottom: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; background: ${escapeHtml(config.headerBg || "#e9eef5")}; }
          .line-head strong { font-size: ${Math.max(11, titleFontSize - 2)}px; }
          .line-head span { color: ${escapeHtml(config.labelColor || "#56687d")}; font-size: ${Math.max(9, baseFontSize - 2)}px; }
          .line-grid { display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px; padding: ${density.subPad}px; }
          .cell-head { font-size: ${Math.max(8, baseFontSize - 3)}px; color: ${escapeHtml(config.labelColor || "#56687d")}; text-transform: uppercase; font-weight: 700; }
          .line-list-head { display: flex; justify-content: space-between; align-items: center; padding: ${density.pad}px; border-bottom: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; background: ${escapeHtml(config.headerBg || "#e9eef5")}; }
          .line-row { display: grid; grid-template-columns: 1.55fr 1.25fr 1fr auto; gap: 10px; padding: ${density.listPad}px ${density.pad}px; border-top: 1px solid #e3e8ef; background: ${escapeHtml(config.fieldBg || "#fbfcfe")}; }
          .summary-title { padding: ${density.pad}px; border-bottom: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; background: ${escapeHtml(config.headerBg || "#e9eef5")}; font-size: ${Math.max(11, titleFontSize - 2)}px; font-weight: 700; }
          .summary-note { padding: ${density.subPad}px ${density.pad} 0; }
          .summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; padding: ${density.subPad}px; }
          .summary-card { border: 1px solid ${escapeHtml(config.borderColor || "#cfd8e2")}; border-radius: ${Math.max(4, radius - 2)}px; background: ${escapeHtml(config.fieldBg || "#fbfcfe")}; padding: ${density.pad}px; }
          .summary-card span { display: block; font-size: ${Math.max(8, baseFontSize - 3)}px; color: ${escapeHtml(config.labelColor || "#56687d")}; text-transform: uppercase; }
          .summary-card strong { display: block; margin-top: 4px; font-size: ${Math.max(12, baseFontSize + 2)}px; }
          .custom-panel { border: 1px dashed ${escapeHtml(config.borderColor || "#cfd8e2")}; border-radius: ${radius}px; background: linear-gradient(180deg, #ffffff, ${escapeHtml(config.fieldBg || "#fbfcfe")}); overflow: hidden; }
          .custom-panel-head { display: grid; gap: 4px; padding: ${density.pad}px; border-bottom: 1px dashed ${escapeHtml(config.borderColor || "#cfd8e2")}; background: rgba(255,255,255,0.76); }
          .custom-panel-head strong { font-size: ${Math.max(11, titleFontSize - 2)}px; }
          .custom-panel-head span { color: ${escapeHtml(config.labelColor || "#56687d")}; font-size: ${Math.max(9, baseFontSize - 2)}px; }
          .custom-panel-body { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding: ${density.pad}px; }
          .custom-panel-body.has-fields { grid-template-columns: 1fr; }
          .custom-placeholder { display: flex; align-items: center; justify-content: center; min-height: 74px; border: 1px dashed ${escapeHtml(config.borderColor || "#cfd8e2")}; border-radius: ${Math.max(4, radius - 2)}px; background: rgba(255,255,255,0.72); color: ${escapeHtml(config.labelColor || "#56687d")}; font-size: ${Math.max(9, baseFontSize - 2)}px; font-weight: 700; }
          .empty-section-note { padding: ${density.pad}px; color: ${escapeHtml(config.labelColor || "#56687d")}; font-size: ${Math.max(9, baseFontSize - 2)}px; }
          @media (max-width: 980px) {
            .header-info-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .header-info-grid .field-card { grid-column: span 1 !important; grid-row: auto !important; }
            .header-info-grid .field-offerNo,
            .header-info-grid .field-cari { grid-column: span 2 !important; }
          }
          ${String(config.customCss || "")}
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1 class="page-title">${escapeHtml(config.pageTitle || "Yeni Teklif Ekle")}</h1>
          ${visibleProductsFirst && productsSection ? `
            <div class="layout">
              ${renderSectionMarkup(productsSection)}
              <section class="main">
                ${mainSections.map(renderSectionMarkup).join("") || `<section class="custom-panel"><div class="custom-panel-head"><strong>Gorunur bolum kalmadi</strong><span>Yeni bir bolum ekleyin veya gizli bolumleri tekrar acin.</span></div></section>`}
              </section>
            </div>
          ` : `
            <section class="stack-main">
              ${sections.map(renderSectionMarkup).join("") || `<section class="custom-panel"><div class="custom-panel-head"><strong>Gorunur bolum kalmadi</strong><span>Yeni bir bolum ekleyin veya gizli bolumleri tekrar acin.</span></div></section>`}
            </section>
          `}
        </div>
      </body>
    </html>
  `;
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
  if (!target) return;
  renderOfferDashboardShell(records || []);
  const searchTerm = offersSearch?.value?.trim().toLowerCase() || "";
  const statusTerm = offersStatusFilter?.value || "";
  const cariTerm = offersCariFilter?.value || "";
  const dateFrom = offersDateFrom?.value || "";
  const dateTo = offersDateTo?.value || "";
  const dateSort = offersDateSort?.value || "date-desc";
  const amountSort = offersAmountSort?.value || "none";

  let filtered = (records || []).filter((item) => {
    const cariName = String(item.cariName || "").toLowerCase();
    const companyHaystack = [
      item.offerNo,
      item.cariName,
      item.meta?.formType,
      item.coverType,
    ].join(" ").toLowerCase();
    const matchesSearch = !searchTerm || cariName.includes(searchTerm) || companyHaystack.includes(searchTerm);
    const matchesStatus = !statusTerm || String(item.status || "") === statusTerm;
    const matchesCari = !cariTerm || String(item.cariId || "") === String(cariTerm);
    const itemDateValue = String(item.orderDate || item.createdAt || "").slice(0, 10);
    const matchesDateFrom = !dateFrom || itemDateValue >= dateFrom;
    const matchesDateTo = !dateTo || itemDateValue <= dateTo;
    return matchesSearch && matchesStatus && matchesCari && matchesDateFrom && matchesDateTo;
  });

  filtered = filtered.sort((left, right) => {
    if (amountSort === "amount-desc" || amountSort === "amount-asc") {
      const amountDiff = Number(left.netTotal || 0) - Number(right.netTotal || 0);
      if (amountDiff !== 0) {
        return amountSort === "amount-asc" ? amountDiff : -amountDiff;
      }
    }
    const leftDate = new Date(left.orderDate || left.createdAt || 0).getTime();
    const rightDate = new Date(right.orderDate || right.createdAt || 0).getTime();
    return dateSort === "date-asc" ? leftDate - rightDate : rightDate - leftDate;
  });

  if (offersCountBadge) {
    offersCountBadge.textContent = `${filtered.length} teklif`;
  }

  target.innerHTML = filtered.length
    ? createOffersTableMarkup(filtered)
    : `<div class="offers-empty-state">Teklif kaydi bulunamadi.</div>`;
  bindActions();
  return;
  /*
          <strong>${escapeHtml(item.meta?.rows?.[0]?.modelName || item.coverType || "-")}</strong>
          <small>${escapeHtml(item.color || "-")} · ${item.meta?.rows?.length || 1} kalem · ${item.meta?.summary?.totalQuantity || item.quantity || 0} adet</small>
        </span>
        <span class="offers-cell offers-cell-center">
          <strong>${formatDate(item.deliveryDate)}</strong>
          <small>${formatDate(item.orderDate)}</small>
        </span>
        <span class="offers-cell offers-cell-money">
          <strong>${formatCurrency(item.netTotal)}</strong>
        </span>
        <span class="offers-cell offers-actions-block">
          <span class="offers-actions-status">
            ${item.status === "Beklemede" ? `<b class="status-pill status-Beklemede">Beklemede</b>` : `<b class="status-pill status-Tamamlandi">Onaylandi</b>`}
          </span>
          <span class="offers-actions-cell">
            ${item.status === "Beklemede" ? `
              <button class="offer-action-icon approve-offer-btn" type="button" data-id="${item.id}" title="Onayla" aria-label="Onayla">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="m20 6-11 11-5-5"></path>
                </svg>
              </button>
            ` : ``}
            <button class="offer-action-icon offer-action-icon-delete delete-btn" type="button" data-store="${STORES.offers}" data-id="${item.id}" title="Sil" aria-label="Sil">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 6h18"></path>
                <path d="M8 6V4h8v2"></path>
                <path d="M19 6l-1 14H6L5 6"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
              </svg>
            </button>
          </span>
        </span>
        </div>
      `).join("")}
    </div>
  ` : `<div class="offers-row empty">Teklif kaydi bulunamadi.</div>`;
  */
}

function renderOfferDashboardShell(records = []) {
  renderOfferKpis(records);
  renderOfferFilterOptions(records);
  renderOfferStatusFlow();
}

function getOfferTotals(offer = {}) {
  const rows = offer.items?.length ? offer.items : offer.meta?.rows || [];
  return {
    lineCount: rows.length || Number(offer.meta?.rows?.length || 0) || 1,
    quantity: rows.reduce((sum, row) => sum + Number(row.quantity || 0), 0) || Number(offer.quantity || 0),
    m2: rows.reduce((sum, row) => sum + Number(row.m2 || 0), 0),
  };
}

function renderOfferKpis(records = []) {
  if (!offersKpiGrid) return;
  const totalAmount = records.reduce((sum, item) => sum + Number(item.netTotal || 0), 0);
  const pending = records.filter((item) => ["sent", "pending", "revised"].includes(normalizeOfferStatusKey(item.status)));
  const approved = records.filter((item) => normalizeOfferStatusKey(item.status) === "approved");
  const converted = records.filter((item) => normalizeOfferStatusKey(item.status) === "converted");
  const rejected = records.filter((item) => ["cancelled", "rejected"].includes(normalizeOfferStatusKey(item.status)));
  const cards = [
    ["Toplam Teklif", records.length, "Bu ay: " + records.length, "blue"],
    ["Toplam Tutar", formatCurrency(totalAmount), "Net teklif tutari", "green"],
    ["Onay Bekleyen", pending.length, formatCurrency(pending.reduce((sum, item) => sum + Number(item.netTotal || 0), 0)), "orange"],
    ["Onaylanan", approved.length, formatCurrency(approved.reduce((sum, item) => sum + Number(item.netTotal || 0), 0)), "green"],
    ["Siparise Donusen", converted.length, formatCurrency(converted.reduce((sum, item) => sum + Number(item.netTotal || 0), 0)), "teal"],
    ["Iptal / Reddedilen", rejected.length, formatCurrency(rejected.reduce((sum, item) => sum + Number(item.netTotal || 0), 0)), "red"],
  ];
  offersKpiGrid.innerHTML = cards.map(([label, value, meta, tone]) => `
    <article class="erp-kpi-card tone-${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
      <small>${escapeHtml(String(meta))}</small>
    </article>
  `).join("");
}

function renderOfferFilterOptions(records = []) {
  if (offersCariFilter) {
    const current = offersCariFilter.value;
    const options = [...new Map(records.map((item) => [String(item.cariId || ""), item.cariName || "-"])).entries()]
      .filter(([id]) => id)
      .sort((a, b) => String(a[1]).localeCompare(String(b[1]), "tr"));
    offersCariFilter.innerHTML = `<option value="">Tumu</option>${options.map(([id, name]) => `<option value="${escapeHtml(id)}">${escapeHtml(name)}</option>`).join("")}`;
    offersCariFilter.value = options.some(([id]) => id === current) ? current : "";
  }
  if (offersSalesRepFilter && !offersSalesRepFilter.dataset.ready) {
    offersSalesRepFilter.innerHTML = `<option value="">Tumu</option><option value="admin">Admin</option>`;
    offersSalesRepFilter.dataset.ready = "1";
  }
}

function renderOfferStatusFlow() {
  if (!offerStatusFlowPanel) return;
  const mainFlow = ["draft", "sent", "pending", "revised", "approved", "converted"];
  const sideFlow = ["rejected", "expired", "cancelled"];
  offerStatusFlowPanel.innerHTML = `
    <h3>Teklif Durum Akisi</h3>
    <div class="erp-flow-list">
      ${mainFlow.map((key, index) => `
        <div class="erp-flow-item">
          <b class="status-pill status-${key}">${escapeHtml(OFFER_STATUSES[key]?.label || key)}</b>
          <span>${getOfferFlowDescription(key)}</span>
        </div>
        ${index < mainFlow.length - 1 ? `<div class="erp-flow-arrow">↓</div>` : ``}
      `).join("")}
    </div>
    <div class="erp-flow-side">
      ${sideFlow.map((key) => `<b class="status-pill status-${key}">${escapeHtml(OFFER_STATUSES[key]?.label || key)}</b>`).join("")}
    </div>
    <p class="erp-flow-note">Gecersiz durum gecisleri sistem tarafindan engellenir.</p>
  `;
}

function getOfferFlowDescription(key) {
  return {
    draft: "Teklif henuz kaydedildi, gonderilmedi.",
    sent: "Musteriye teklif gonderildi.",
    pending: "Musteri degerlendirme asamasinda.",
    revised: "Teklif revize edildi.",
    approved: "Musteri tarafindan onaylandi.",
    converted: "Teklif siparise donusturuldu.",
  }[key] || "";
}

function normalizeOfferStatusLabelLegacy(status = "") {
  const value = String(status || "").trim();
  if (value === "Onaylandi") return "Onaylandı";
  if (value === "Iptal") return "İptal";
  return OFFER_STATUSES[value]?.label || "Taslak";
}

function getOfferStatusClass(status = "") {
  const normalized = normalizeOfferStatusLabel(status)
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/İ/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `status-${normalized || "taslak"}`;
}

function canConvertOfferToOrderLegacy(status = "") {
  return ORDER_CONVERTIBLE_OFFER_STATUSES.includes(normalizeOfferStatusLabel(status));
}

function createOfferStatusPillLegacy(status = "") {
  const label = normalizeOfferStatusLabel(status);
  return `<b class="status-pill ${getOfferStatusClass(label)}">${escapeHtml(label)}</b>`;
}

function createOfferStatusSelect(offer) {
  const currentStatus = normalizeOfferStatusLabel(offer?.status);
  return `
    <select class="offer-status-select" data-offer-status-id="${offer.id}" title="Durum Degistir" aria-label="Durum Degistir">
      ${Object.entries(OFFER_STATUSES).map(([statusKey, config]) => `
        <option value="${escapeHtml(statusKey)}" ${config.label === currentStatus ? "selected" : ""}>${escapeHtml(config.label)}</option>
      `).join("")}
    </select>
  `;
}

function normalizeOfferStatusKey(status = "") {
  const value = String(status || "").trim();
  if (OFFER_STATUSES[value]) return value;
  const normalized = value.toLocaleLowerCase("tr-TR");
  const legacyMap = new Map([
    ["taslak", "draft"],
    ["gonderildi", "sent"],
    ["gönderildi", "sent"],
    ["gÃ¶nderildi", "sent"],
    ["beklemede", "pending"],
    ["revize", "revised"],
    ["onaylandi", "approved"],
    ["onaylandı", "approved"],
    ["onaylandÄ±", "approved"],
    ["reddedildi", "rejected"],
    ["suresi gecti", "expired"],
    ["süresi geçti", "expired"],
    ["sÃ¼resi geÃ§ti", "expired"],
    ["siparise donustu", "converted"],
    ["siparişe dönüştü", "converted"],
    ["sipariÅŸe dÃ¶nÃ¼ÅŸtÃ¼", "converted"],
    ["iptal", "cancelled"],
    ["i̇ptal", "cancelled"],
    ["Ä°ptal", "cancelled"],
  ]);
  return legacyMap.get(normalized) || "draft";
}

function normalizeOfferStatusLabel(status = "") {
  const key = normalizeOfferStatusKey(status);
  return OFFER_STATUSES[key]?.label || OFFER_STATUSES.draft.label;
}

function getOfferStatusConfig(status = "") {
  const key = normalizeOfferStatusKey(status);
  return { key, ...OFFER_STATUSES[key] };
}

function canConvertOfferToOrder(status = "") {
  return ORDER_CONVERTIBLE_OFFER_STATUSES.includes(normalizeOfferStatusKey(status));
}

function createOfferStatusPill(status = "") {
  const config = getOfferStatusConfig(status);
  return `<b class="status-pill status-${config.key}">${escapeHtml(config.label)}</b>`;
}

function createOfferStatusControl(offer) {
  const config = getOfferStatusConfig(offer?.status);
  const transitions = getAllowedOfferTransitions(offer);
  const disabled = transitions.length ? "" : "disabled";
  const title = transitions.length ? "Durum degistir" : "Bu durumdan sonra izinli gecis yok";
  return `
    <button class="offer-status-badge-btn status-pill status-${config.key}" type="button" data-offer-status-toggle="${offer.id}" ${disabled} title="${title}" aria-label="Durum degistir: ${escapeHtml(config.label)}" aria-expanded="false">
      <span>${escapeHtml(config.label)}</span>
      ${transitions.length ? `<span class="offer-status-chevron" aria-hidden="true">&#9662;</span>` : ``}
    </button>
  `;
}

function getAllowedOfferTransitions(offer) {
  const statusKey = normalizeOfferStatusKey(offer?.status);
  const backendTransitions = Array.isArray(offer?.allowedNextStatuses)
    ? offer.allowedNextStatuses.map((item) => item?.key || item?.status || item).filter(Boolean)
    : [];
  const nextKeys = backendTransitions.length ? backendTransitions : (OFFER_STATUSES[statusKey]?.next || []);
  return nextKeys
    .map((key) => (OFFER_STATUSES[key] ? { key, ...OFFER_STATUSES[key] } : null))
    .filter(Boolean);
}

function createOfferTransitionButtons(offer) {
  const transitions = getAllowedOfferTransitions(offer);
  if (!transitions.length) {
    return `<span class="offer-status-terminal">Son durum</span>`;
  }
  return `
    <div class="offers-status-transitions">
      ${transitions.map((transition) => {
        if (transition.key === "converted") {
          return `
            <button class="offer-status-transition-btn approve-offer-btn" type="button" data-id="${offer.id}" title="Siparise Donustur" aria-label="Siparise Donustur">
              ${escapeHtml(transition.label)}
            </button>
          `;
        }
        if (transition.key === "revised") {
          return `
            <button class="offer-status-transition-btn revise-offer-btn" type="button" data-id="${offer.id}" title="Revizyon Olustur" aria-label="Revizyon Olustur">
              ${escapeHtml(transition.label)}
            </button>
          `;
        }
        return `
          <button class="offer-status-transition-btn" type="button" data-offer-status-id="${offer.id}" data-status="${escapeHtml(transition.key)}" title="${escapeHtml(transition.label)}">
            ${escapeHtml(transition.label)}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function closeOfferStatusDropdown() {
  document.querySelector(".offer-status-floating-menu")?.remove();
  document.querySelectorAll("[data-offer-status-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
}

function openOfferStatusDropdown(button) {
  const offerId = Number(button.dataset.offerStatusToggle);
  const offer = (cache.offers || []).find((item) => Number(item.id) === offerId);
  const transitions = getAllowedOfferTransitions(offer);
  closeOfferStatusDropdown();
  closeOfferActionsDropdown();
  if (!offer || !transitions.length) return;

  button.setAttribute("aria-expanded", "true");
  const menu = document.createElement("div");
  menu.className = "offer-status-floating-menu";
  menu.dataset.offerStatusMenu = String(offerId);
  menu.innerHTML = transitions.map((transition) => `
    <button class="offer-status-menu-item status-${transition.key}" type="button" data-offer-status-id="${offerId}" data-status="${escapeHtml(transition.key)}">
      <span class="offer-status-dot"></span>
      <span>${escapeHtml(transition.label)}</span>
    </button>
  `).join("");
  document.body.appendChild(menu);

  const rect = button.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const left = Math.max(8, Math.min(window.innerWidth - menuRect.width - 8, rect.right - menuRect.width));
  const belowTop = rect.bottom + 6;
  const aboveTop = rect.top - menuRect.height - 6;
  const top = belowTop + menuRect.height > window.innerHeight - 8 && aboveTop > 8 ? aboveTop : belowTop;
  menu.style.left = `${left}px`;
  menu.style.top = `${Math.max(8, top)}px`;

  menu.querySelectorAll("[data-offer-status-id]").forEach((item) => {
    item.addEventListener("click", () => {
      const nextStatus = item.dataset.status;
      closeOfferStatusDropdown();
      openOfferStatusNoteModal(offerId, nextStatus);
    });
  });
}

function closeOfferStatusNoteModal() {
  document.querySelector(".offer-status-note-modal")?.remove();
}

function openOfferStatusNoteModal(offerId, nextStatus) {
  const offer = (cache.offers || []).find((item) => Number(item.id) === Number(offerId));
  const currentConfig = getOfferStatusConfig(offer?.status);
  const nextConfig = getOfferStatusConfig(nextStatus);
  const modal = document.createElement("div");
  modal.className = "offer-status-note-modal";
  modal.innerHTML = `
    <div class="offer-status-note-backdrop" data-close-offer-status-modal></div>
    <section class="offer-status-note-dialog" role="dialog" aria-modal="true" aria-labelledby="offerStatusNoteTitle">
      <div class="offer-status-note-head">
        <span>Durum Degisikligi</span>
        <button type="button" data-close-offer-status-modal aria-label="Kapat">x</button>
      </div>
      <h3 id="offerStatusNoteTitle">${escapeHtml(currentConfig.label)} -> ${escapeHtml(nextConfig.label)}</h3>
      <label>
        <span>Not</span>
        <textarea id="offerStatusNoteText" rows="4" placeholder="Durum degisikligi icin kisa bir not yazin..."></textarea>
      </label>
      <div class="offer-status-note-actions">
        <button class="ghost-btn" type="button" data-close-offer-status-modal>Vazgec</button>
        <button class="primary-action" type="button" data-save-offer-status-change>Kaydet</button>
      </div>
    </section>
  `;
  document.body.appendChild(modal);
  const textarea = modal.querySelector("#offerStatusNoteText");
  const saveButton = modal.querySelector("[data-save-offer-status-change]");
  textarea?.focus();

  modal.querySelectorAll("[data-close-offer-status-modal]").forEach((button) => {
    button.addEventListener("click", closeOfferStatusNoteModal);
  });
  saveButton?.addEventListener("click", async () => {
    saveButton.disabled = true;
    try {
      await api.offers.updateStatus(offerId, {
        status: nextStatus,
        note: textarea?.value?.trim() || "",
      });
      closeOfferStatusNoteModal();
      await refreshUI();
    } catch (error) {
      window.alert(`Teklif durumu guncellenemedi: ${error?.message || "Bilinmeyen hata"}`);
      saveButton.disabled = false;
    }
  });
}

function getOfferActionIcon(name) {
  const icons = {
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"></path></svg>`,
    more: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    pdf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M7 16h2"></path><path d="M11 16h2"></path><path d="M15 16h2"></path></svg>`,
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7Z"></path><path d="M22 2 11 13"></path></svg>`,
    cart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.6"></circle><circle cx="18" cy="20" r="1.6"></circle><path d="M2 3h3l2.2 12.2A2 2 0 0 0 9.2 17H18a2 2 0 0 0 2-1.6L21.5 8H6"></path></svg>`,
    workflow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4v5a3 3 0 0 0 3 3h6"></path><path d="M18 20v-5a3 3 0 0 0-3-3H9"></path><circle cx="6" cy="4" r="2"></circle><circle cx="18" cy="20" r="2"></circle><circle cx="18" cy="12" r="2"></circle></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>`,
  };
  return icons[name] || "";
}

function canEditOfferInline(offer) {
  return !["converted", "cancelled", "rejected"].includes(normalizeOfferStatusKey(offer?.status));
}

function getOfferMenuActions(offer) {
  const statusKey = normalizeOfferStatusKey(offer?.status);
  const actions = [
    { key: "view", label: "Goruntule", icon: "eye", mobileOnly: true },
  ];
  if (canEditOfferInline(offer)) {
    actions.push({ key: "edit", label: "Duzenle", icon: "edit", mobileOnly: true });
  }
  if (statusKey === "cancelled") return actions;
  if (statusKey === "draft") {
    actions.push({ key: "send", label: "Gonder", icon: "send" });
    actions.push({ key: "delete", label: "Sil", icon: "trash", danger: true });
    return actions;
  }
  if (statusKey === "approved") {
    actions.push({ key: "pdf", label: "PDF al", icon: "pdf" });
    actions.push({ key: "convert", label: "Siparise donustur", icon: "cart" });
    return actions;
  }
  if (statusKey === "converted") {
    actions.push({ key: "pdf", label: "PDF al", icon: "pdf" });
    return actions;
  }
  if (statusKey === "rejected") {
    actions.push({ key: "pdf", label: "PDF al", icon: "pdf" });
    return actions;
  }
  actions.push({ key: "copy", label: "Kopyala", icon: "copy" });
  actions.push({ key: "pdf", label: "PDF al", icon: "pdf" });
  actions.push({ key: "delete", label: "Sil", icon: "trash", danger: true });
  return actions;
}

function createOfferActionsMarkup(offer) {
  const canEdit = canEditOfferInline(offer);
  const actions = getOfferMenuActions(offer);
  const hasDesktopMenu = actions.some((action) => !action.mobileOnly);
  return `
    <div class="offers-actions-cell offers-actions-cell-compact">
      <button class="offer-action-icon view-offer-btn offer-action-primary" type="button" data-id="${offer.id}" title="Goruntule" aria-label="Goruntule">
        ${getOfferActionIcon("eye")}
      </button>
      ${canEdit ? `
        <button class="offer-action-icon edit-offer-btn offer-action-primary" type="button" data-id="${offer.id}" title="Duzenle" aria-label="Duzenle">
          ${getOfferActionIcon("edit")}
        </button>
      ` : ``}
      ${(hasDesktopMenu || actions.length) ? `
        <button class="offer-action-icon offer-actions-more-btn ${hasDesktopMenu ? "" : "offer-actions-mobile-trigger"}" type="button" data-offer-actions-toggle="${offer.id}" title="Diger islemler" aria-label="Diger islemler" aria-expanded="false">
          ${getOfferActionIcon("more")}
        </button>
      ` : ``}
    </div>
  `;
}

function openOfferPreview(offerId) {
  const offer = (cache.offers || []).find((item) => Number(item.id) === Number(offerId));
  if (!offer) {
    window.alert("Goruntulenecek teklif bulunamadi.");
    return;
  }
  if (offerPrintSelect) offerPrintSelect.value = String(offerId);
  const cari = (cache.cari || []).find((item) => item.id === offer.cariId);
  const previewWindow = window.open("", "_blank", "width=960,height=800");
  if (!previewWindow) {
    window.alert("Teklif onizleme penceresi acilamadi. Tarayicida popup iznini kontrol edin.");
    return;
  }
  previewWindow.document.write(buildOfferPrintHtml(offer, cari));
  previewWindow.document.close();
  previewWindow.focus();
}

function closeOfferActionsDropdown() {
  document.querySelector(".offer-actions-floating-menu")?.remove();
  document.querySelectorAll("[data-offer-actions-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll("[data-order-actions-toggle]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
  });
}

function openOfferActionsDropdown(button) {
  const offerId = Number(button.dataset.offerActionsToggle);
  const offer = (cache.offers || []).find((item) => Number(item.id) === offerId);
  const actions = getOfferMenuActions(offer);
  closeOfferActionsDropdown();
  closeOfferStatusDropdown();
  if (!offer || !actions.length) return;

  button.setAttribute("aria-expanded", "true");
  const menu = document.createElement("div");
  menu.className = "offer-actions-floating-menu";
  menu.dataset.offerActionsMenu = String(offerId);
  menu.innerHTML = actions.map((action) => `
    <button class="offer-actions-menu-item ${action.mobileOnly ? "offer-actions-mobile-only" : ""} ${action.danger ? "is-danger" : ""}" type="button" data-offer-menu-action="${action.key}" data-id="${offerId}">
      ${getOfferActionIcon(action.icon)}
      <span>${escapeHtml(action.label)}</span>
    </button>
  `).join("");
  document.body.appendChild(menu);

  const rect = button.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const left = Math.max(8, Math.min(window.innerWidth - menuRect.width - 8, rect.right - menuRect.width));
  const belowTop = rect.bottom + 6;
  const aboveTop = rect.top - menuRect.height - 6;
  const top = belowTop + menuRect.height > window.innerHeight - 8 && aboveTop > 8 ? aboveTop : belowTop;
  menu.style.left = `${left}px`;
  menu.style.top = `${Math.max(8, top)}px`;

  menu.querySelectorAll("[data-offer-menu-action]").forEach((item) => {
    item.addEventListener("click", async () => {
      closeOfferActionsDropdown();
      await handleOfferMenuAction(item.dataset.offerMenuAction, offerId, item);
    });
  });
}

async function handleOfferMenuAction(action, offerId, sourceButton) {
  const offer = (cache.offers || []).find((item) => Number(item.id) === Number(offerId));
  if (!offer) return;
  if (action === "view") {
    openOfferPreview(offerId);
    return;
  }
  if (action === "edit") {
    openOfferForEdit(offerId);
    return;
  }
  if (action === "send") {
    openOfferStatusNoteModal(offerId, "sent");
    return;
  }
  if (action === "copy") {
    sourceButton.disabled = true;
    try {
      const result = await api.offers.createRevision(offerId, { status: "draft" });
      await refreshUI();
      openOfferForEdit(result.id);
    } catch (error) {
      window.alert(`Revizyon olusturulamadi: ${error?.message || "Bilinmeyen hata"}`);
      sourceButton.disabled = false;
    }
    return;
  }
  if (action === "pdf") {
    if (offerPrintSelect) offerPrintSelect.value = String(offerId);
    const cari = (cache.cari || []).find((item) => item.id === offer.cariId);
    const printWindow = window.open("", "_blank", "width=960,height=800");
    if (!printWindow) return;
    printWindow.document.write(buildOfferPrintHtml(offer, cari));
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
    return;
  }
  if (action === "convert") {
    sourceButton.disabled = true;
    try {
      const result = await api.offers.approve(offerId);
      await refreshUI();
      setActiveView("orders");
      if (result?.order_id) {
        currentOrderDetailTab = "general";
        selectedOrderId = Number(result.order_id);
        const order = (cache.orders || []).find((item) => item.id === selectedOrderId) || null;
        renderOrderDetail(order);
        document.getElementById("orderDetailPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (error) {
      window.alert(`Teklif siparise donusturulemedi: ${error?.message || "Bilinmeyen hata"}`);
      sourceButton.disabled = false;
    }
    return;
  }
  if (action === "delete") {
    if (!window.confirm("Bu kaydi silmek istiyor musunuz?")) return;
    await deleteRecord(STORES.offers, offerId);
    await refreshUI();
  }
}

function getOrderMenuActions(order) {
  if (!order) return [];
  return [
    ...(order.status === "Onaylandi" ? [{ key: "erp-flow", label: "Uretim Surecini Baslat", icon: "workflow" }] : []),
    { key: "delete", label: "Sil", icon: "trash", danger: true },
  ];
}

function openOrderActionsDropdown(button) {
  const orderId = Number(button.dataset.orderActionsToggle);
  const order = (cache.orders || []).find((item) => Number(item.id) === orderId);
  const actions = getOrderMenuActions(order);
  closeOfferActionsDropdown();
  closeOfferStatusDropdown();
  if (!order || !actions.length) return;

  button.setAttribute("aria-expanded", "true");
  const menu = document.createElement("div");
  menu.className = "offer-actions-floating-menu order-actions-floating-menu";
  menu.dataset.orderActionsMenu = String(orderId);
  menu.innerHTML = `
    <label class="order-actions-menu-select">
      <span>Durum</span>
      <select class="order-status-select" data-id="${orderId}" aria-label="Siparis Durumu">
        ${(order.allowedStatuses || ORDER_STATUSES).map((status) => `<option value="${escapeHtml(status)}" ${status === order.status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
      </select>
    </label>
    ${actions.map((action) => `
      <button class="offer-actions-menu-item ${action.danger ? "is-danger" : ""}" type="button" data-order-menu-action="${action.key}" data-id="${orderId}">
        ${getOfferActionIcon(action.icon)}
        <span>${escapeHtml(action.label)}</span>
      </button>
    `).join("")}
  `;
  document.body.appendChild(menu);

  const rect = button.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const left = Math.max(8, Math.min(window.innerWidth - menuRect.width - 8, rect.right - menuRect.width));
  const belowTop = rect.bottom + 6;
  const aboveTop = rect.top - menuRect.height - 6;
  const top = belowTop + menuRect.height > window.innerHeight - 8 && aboveTop > 8 ? aboveTop : belowTop;
  menu.style.left = `${left}px`;
  menu.style.top = `${Math.max(8, top)}px`;

  menu.querySelectorAll("[data-order-menu-action]").forEach((item) => {
    item.addEventListener("click", async () => {
      closeOfferActionsDropdown();
      await handleOrderMenuAction(item.dataset.orderMenuAction, orderId, item);
    });
  });
  menu.querySelector(".order-status-select")?.addEventListener("change", async (event) => {
    const select = event.currentTarget;
    select.disabled = true;
    try {
      await api.orders.updateStatus(orderId, select.value);
      closeOfferActionsDropdown();
      await refreshUI();
    } catch (error) {
      window.alert(`Siparis durumu guncellenemedi: ${error?.message || "Bilinmeyen hata"}`);
      select.disabled = false;
    }
  });
}

async function handleOrderMenuAction(action, orderId, sourceButton) {
  if (action === "erp-flow") {
    sourceButton.disabled = true;
    try {
      await api.orders.runErpFlow(orderId);
      await refreshUI();
    } catch (error) {
      window.alert(`Uretim sureci baslatilamadi: ${error?.message || "Bilinmeyen hata"}`);
      sourceButton.disabled = false;
    }
    return;
  }
  if (action === "delete") {
    if (!window.confirm("Bu siparisi silmek istiyor musunuz?")) return;
    await deleteRecord(STORES.orders, orderId);
    await refreshUI();
  }
}

function createOffersTableMarkup(records) {
  return `
    <table class="offers-data-table erp-modern-table">
      <thead>
        <tr>
          <th>TEKLIF NO</th>
          <th>TARIH</th>
          <th>CARI / FIRMA</th>
          <th>KALEM</th>
          <th>TOPLAM ADET</th>
          <th>TOPLAM M2</th>
          <th>TUTAR</th>
          <th>DURUM</th>
          <th>GECERLILIK</th>
          <th>ISLEMLER</th>
        </tr>
      </thead>
      <tbody>
        ${records.map((item) => {
          const totals = getOfferTotals(item);
          const linkedOrder = (cache.orders || []).find((order) => order.id === Number(item.convertedOrderId || 0) || order.offerId === item.id) || null;
          return `
          <tr>
            <td class="offers-col-offer-no">
              <strong>${escapeHtml(item.offerNo || `TK-${item.id}`)}</strong>
              <small>Rev ${Number(item.revisionNo || 0)}</small>
            </td>
            <td class="offers-col-center">
              <strong>${formatDate(item.orderDate)}</strong>
            </td>
            <td>
              <strong>${escapeHtml(item.cariName || "-")}</strong>
            </td>
            <td class="offers-col-summary">
              <strong>${escapeHtml(item.meta?.rows?.[0]?.modelName || item.coverType || "-")}</strong>
              <small>${escapeHtml(item.color || "-")} - ${totals.lineCount} kalem</small>
            </td>
            <td class="offers-col-center">
              <strong>${Number(totals.quantity || 0)}</strong>
            </td>
            <td class="offers-col-center">
              <strong>${Number(totals.m2 || 0).toFixed(3)}</strong>
            </td>
            <td class="offers-col-money">
              <strong>${formatCurrency(item.netTotal)}</strong>
            </td>
            <td class="offers-col-center offers-col-status">
              ${createOfferStatusControl(item)}
              ${normalizeOfferStatusKey(item.status) === "converted" && linkedOrder ? `
                <small class="offer-linked-order-meta">${escapeHtml(linkedOrder.trackingNo || "-")}</small>
                <select class="offer-linked-order-status-select" data-order-id="${linkedOrder.id}" aria-label="Bagli Siparis Durumu">
                  ${(linkedOrder.allowedStatuses || ORDER_STATUSES).map((status) => `<option value="${escapeHtml(status)}" ${status === linkedOrder.status ? "selected" : ""}>${escapeHtml(status)}</option>`).join("")}
                </select>
              ` : ``}
            </td>
            <td class="offers-col-center">
              <strong>${formatDate(item.deliveryDate)}</strong>
            </td>
            <td class="offers-col-actions">
              <div class="offers-actions-block">
                ${createOfferActionsMarkup(item)}
              </div>
            </td>
          </tr>
        `}).join("")}
      </tbody>
    </table>
  `;
}

function renderOfferPrintSelect(records) {
  if (!offerPrintSelect) return;
  offerPrintSelect.innerHTML = records.length
    ? records.map((item) => `<option value="${item.id}">${escapeHtml(item.offerNo || `TK-${item.id}`)} - ${escapeHtml(item.cariName)} - ${formatCurrency(item.netTotal)}</option>`).join("")
    : `<option value="">Teklif bulunamadi</option>`;
}

function renderOrdersTable(records) {
  const term = orderSearch?.value?.trim().toLowerCase() || "";
  const filtered = records.filter((item) => !term || [item.orderNo, item.trackingNo, item.cariName, item.status].join(" ").toLowerCase().includes(term));
  document.getElementById("ordersTable").innerHTML = createOrdersMarkup(filtered);
  renderOrderStatusFlow();
  renderOrderDetail((cache.orders || []).find((item) => item.id === selectedOrderId) || null);
}

function renderWorkOrdersTable(records) {
  if (!workOrdersTable) return;
  const term = workOrderSearch?.value?.trim().toLowerCase() || "";
  const statusValue = workOrderStatusFilter?.value || "";
  const priorityValue = workOrderPriorityFilter?.value || "";
  const stageValue = workOrderStageFilter?.value || "";
  const filtered = (records || []).filter((item) => {
    const haystack = [
      item.workOrderNo,
      item.trackingNo,
      item.offerNo,
      item.cariName,
      item.status,
      item.priority,
      ...(item.stages || []).map((stage) => `${stage.stageName} ${stage.status}`),
    ].join(" ").toLowerCase();
    const matchesTerm = !term || haystack.includes(term);
    const matchesStatus = !statusValue || item.status === statusValue;
    const matchesPriority = !priorityValue || item.priority === priorityValue;
    const matchesStage = !stageValue || (item.stages || []).some((stage) => stage.status === stageValue);
    return matchesTerm && matchesStatus && matchesPriority && matchesStage;
  });

  workOrdersTable.innerHTML = filtered.length ? `
    <table class="orders-data-table erp-modern-table work-orders-data-table">
      <thead>
        <tr>
          <th>EMIR NO</th>
          <th>SIPARIS</th>
          <th>CARI</th>
          <th>DURUM</th>
          <th>ONCELIK</th>
          <th>ATANAN</th>
          <th>ASAMA OZETI</th>
          <th>ISLEMLER</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.map((item) => {
          const completedCount = (item.stages || []).filter((stage) => stage.status === "completed").length;
          const totalStageCount = (item.stages || []).length;
          return `
            <tr>
              <td><strong>${escapeHtml(item.workOrderNo || "-")}</strong><small>${escapeHtml(item.offerNo || "")}</small></td>
              <td><strong>${escapeHtml(item.trackingNo || "-")}</strong><small>${formatDate(item.plannedStartDate || item.createdAt)}</small></td>
              <td><strong>${escapeHtml(item.cariName || "-")}</strong></td>
              <td><b class="status-pill status-${getStatusClassName(getWorkOrderStatusLabel(item.status))}">${escapeHtml(getWorkOrderStatusLabel(item.status))}</b></td>
              <td><span class="work-order-priority-chip priority-${escapeHtml(item.priority || "normal")}">${escapeHtml(getWorkOrderPriorityLabel(item.priority))}</span></td>
              <td>${escapeHtml(item.assignedTo || "-")}</td>
              <td><strong>${completedCount} / ${totalStageCount}</strong><small>${escapeHtml((item.stages || []).find((stage) => stage.status === "in_progress")?.stageName || "Aktif asama yok")}</small></td>
              <td>
                <span class="order-row-actions">
                  <button class="offer-action-icon work-order-detail-btn" type="button" data-id="${item.id}" title="Detay">G</button>
                  <button class="offer-action-icon work-order-open-order-btn" type="button" data-order-id="${item.orderId}" title="Siparise Git">S</button>
                </span>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  ` : `<div class="orders-row empty">Uretim emri bulunamadi.</div>`;

  renderWorkOrderDetail((cache.workOrders || []).find((item) => item.id === selectedWorkOrderId) || null);
}

function renderWorkOrderDetail(workOrder) {
  if (!workOrderDetailPanel) return;
  if (!workOrder) {
    workOrderDetailPanel.hidden = true;
    workOrderDetailPanel.innerHTML = "";
    return;
  }

  workOrderDetailPanel.hidden = false;
  const stages = workOrder.stages || [];
  workOrderDetailPanel.innerHTML = `
    <div class="panel-header-row compact">
      <div>
        <h2>Uretim Emri - ${escapeHtml(workOrder.workOrderNo || `#${workOrder.id}`)}</h2>
        <p>${escapeHtml(workOrder.cariName || "-")} | Siparis: ${escapeHtml(workOrder.trackingNo || "-")} | Durum: ${escapeHtml(getWorkOrderStatusLabel(workOrder.status))}</p>
      </div>
      <button class="ghost-action close-work-order-detail-btn" type="button">Kapat</button>
    </div>
    <div class="order-detail-summary-grid">
      <article class="order-summary-card">
        <span>Oncelik</span>
        <strong>${escapeHtml(getWorkOrderPriorityLabel(workOrder.priority))}</strong>
      </article>
      <article class="order-summary-card">
        <span>Atanan</span>
        <strong>${escapeHtml(workOrder.assignedTo || "-")}</strong>
      </article>
      <article class="order-summary-card">
        <span>Planlanan Baslangic</span>
        <strong>${formatDate(workOrder.plannedStartDate)}</strong>
      </article>
      <article class="order-summary-card">
        <span>Planlanan Bitis</span>
        <strong>${formatDate(workOrder.plannedFinishDate)}</strong>
      </article>
    </div>
    <div class="order-detail-card">
      <div class="order-detail-card-head">
        <div>
          <h3>Asama Takibi</h3>
          <p>Istasyon bazli uretim asamalarini bu panelden takip edin.</p>
        </div>
      </div>
      <div class="work-order-control-bar">
        <label>
          <span>Uretim Emri Durumu</span>
          <select class="work-order-status-select" data-id="${workOrder.id}">
            ${["draft", "planned", "in_progress", "paused", "completed", "cancelled"].map((status) => `<option value="${status}" ${status === workOrder.status ? "selected" : ""}>${escapeHtml(getWorkOrderStatusLabel(status))}</option>`).join("")}
          </select>
        </label>
      </div>
      <div class="work-order-stage-list">
        ${stages.length ? stages.map((stage) => `
          <article class="work-order-stage-card">
            <div>
              <strong>${escapeHtml(stage.stageName || "-")}</strong>
              <span>${escapeHtml(stage.assignedTo || "-")} | Baslangic: ${formatDateTime(stage.startedAt)} | Bitis: ${formatDateTime(stage.completedAt)}</span>
            </div>
            <select class="work-order-stage-status-select" data-order-id="${workOrder.id}" data-stage-id="${stage.id}">
              ${["pending", "in_progress", "completed", "blocked"].map((status) => `<option value="${status}" ${status === stage.status ? "selected" : ""}>${escapeHtml(getWorkOrderStageStatusLabel(status))}</option>`).join("")}
            </select>
          </article>
        `).join("") : `<div class="order-detail-empty">Asama kaydi bulunamadi.</div>`}
      </div>
    </div>
  `;
}

function createOrdersMarkup(records) {
  if (!records.length) return `<div class="orders-row empty">Siparis kaydi bulunamadi.</div>`;
  return `
    <table class="orders-data-table erp-modern-table">
      <thead>
        <tr>
          <th>SIPARIS NO</th>
          <th>TARIH</th>
          <th>CARI FIRMA</th>
          <th>KAYNAK</th>
          <th>TUTAR</th>
          <th>DURUM</th>
          <th>TERMIN TARIHI</th>
          <th>ISLEMLER</th>
        </tr>
      </thead>
      <tbody>
        ${records.map((item) => `
          <tr>
            <td><strong>${escapeHtml(item.orderNo || item.trackingNo || "-")}</strong><small>${escapeHtml(item.offerNo || "")}</small></td>
            <td>${formatDate(item.orderDate)}</td>
            <td><strong>${escapeHtml(item.cariName)}</strong></td>
            <td><span class="status-pill status-${item.sourceType === "direct" ? "direct-order" : "converted"}">${item.sourceType === "direct" ? "Teklifsiz" : "Tekliften"}</span></td>
            <td class="offers-col-money"><strong>${formatCurrency(item.netTotal)}</strong></td>
            <td><b class="status-pill status-${getStatusClassName(item.status)}">${escapeHtml(item.status)}</b></td>
            <td>${formatDate(item.deliveryDate)}</td>
            <td class="order-actions-cell">
              <div class="order-row-actions order-row-actions-compact">
                <button class="offer-action-icon order-detail-btn offer-action-primary" type="button" data-id="${item.id}" title="Detay" aria-label="Detay">
                  ${getOfferActionIcon("eye")}
                </button>
                <button class="offer-action-icon offer-actions-more-btn" type="button" data-order-actions-toggle="${item.id}" title="Diger islemler" aria-label="Diger islemler" aria-expanded="false">
                  ${getOfferActionIcon("more")}
                </button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function renderOrderStatusFlow() {
  if (!orderStatusFlowPanel) return;
  const flow = ["Yeni", "Onaylandi", "Olcu Alindi", "Uretim Planlandi", "Uretimde", "Kalite Kontrol", "Sevkiyata Hazir", "Sevk Edildi", "Teslim Edildi", "Tamamlandi"];
  orderStatusFlowPanel.innerHTML = `
    <h3>Siparis Durum Akisi</h3>
    <div class="erp-order-flow-track">
      ${flow.map((status, index) => `
        <span class="status-pill status-${getStatusClassName(status)}">${escapeHtml(status)}</span>
        ${index < flow.length - 1 ? `<i>→</i>` : ``}
      `).join("")}
      <span class="status-pill status-iptal">Iptal</span>
    </div>
  `;
}

function formatDecimal(value, fractionDigits = 2) {
  return Number(value || 0).toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
}

function formatDateTimeLegacy(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? escapeHtml(String(value))
    : date.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
}

function formatMmSize(width, height, length = 0) {
  const safeWidth = Number(width || 0);
  const safeHeight = Number(height || 0);
  const safeLength = Number(length || 0);
  if (safeLength > 0) return `${safeWidth} x ${safeHeight} x ${safeLength} mm`;
  if (safeWidth > 0 || safeHeight > 0) return `${safeWidth} x ${safeHeight} mm`;
  return "-";
}

function getWorkOrderStatusLabel(status = "") {
  const labels = {
    draft: "Taslak",
    planned: "Planlandi",
    in_progress: "Devam Ediyor",
    paused: "Beklemede",
    completed: "Tamamlandi",
    cancelled: "Iptal",
  };
  return labels[String(status || "").trim()] || status || "-";
}

function getWorkOrderPriorityLabel(priority = "") {
  const labels = {
    low: "Dusuk",
    normal: "Normal",
    high: "Yuksek",
    urgent: "Acil",
  };
  return labels[String(priority || "").trim()] || priority || "-";
}

function getWorkOrderStageStatusLabel(status = "") {
  const labels = {
    pending: "Bekliyor",
    in_progress: "Devam Ediyor",
    completed: "Tamamlandi",
    blocked: "Bloke",
  };
  return labels[String(status || "").trim()] || status || "-";
}

function renderOrderDetail(order) {
  const target = document.getElementById("orderDetailPanel");
  if (!target) return;
  if (!order) {
    target.hidden = true;
    target.innerHTML = "";
    return;
  }
  target.hidden = false;
  const rows = order.orderItems || order.items || [];
  const cutListItems = order.cutListItems || [];
  const totalNetM2 = cutListItems.reduce((sum, item) => sum + Number(item.netM2 || 0), 0);
  const totalGrossM2 = cutListItems.reduce((sum, item) => sum + Number(item.grossM2 || 0), 0);
  const panjurEligibleItemCount = Number(order.panjurEligibleItemCount || 0);
  const panjurActionLabel = order.panjurJob ? "Panjur Kapak Sablonunu Ac" : "Panjur Kapak Sablonu Olustur";
  const tabs = getOrderDetailTabs();
  if (!tabs.some((tab) => tab.key === currentOrderDetailTab)) {
    currentOrderDetailTab = "general";
  }
  target.innerHTML = `
    <div class="panel-header-row compact">
      <div>
        <h2>Siparis Detayi - ${escapeHtml(order.orderNo || order.trackingNo || `#${order.id}`)}</h2>
        <p>${escapeHtml(order.cariName || "-")} | ${order.sourceType === "direct" ? "Teklifsiz Siparis" : `Teklif: ${escapeHtml(order.offerNo || "-")}`} | ${formatCurrency(order.netTotal)}</p>
      </div>
      <div class="order-detail-top-actions">
        ${order.status === "Onaylandi" ? `<button class="primary-btn run-order-erp-flow-btn" type="button" data-id="${order.id}">Uretim Surecini Baslat</button>` : ``}
        ${panjurEligibleItemCount || order.panjurJob ? `<button class="ghost-action create-panjur-job-btn" type="button" data-id="${order.id}">${escapeHtml(panjurActionLabel)}</button>` : ``}
        <button class="ghost-action order-refresh-btn" type="button" data-id="${order.id}">Yenile</button>
        <button class="ghost-action close-order-detail-btn" type="button">Kapat</button>
      </div>
    </div>
    <div class="order-detail-summary-grid">
      <article class="order-summary-card">
        <span>Siparis Durumu</span>
        <strong>${escapeHtml(order.status || "-")}</strong>
      </article>
      <article class="order-summary-card">
        <span>Kaynak</span>
        <strong>${order.sourceType === "direct" ? "Teklifsiz Siparis" : "Tekliften"}</strong>
      </article>
      <article class="order-summary-card">
        <span>Kalem Sayisi</span>
        <strong>${rows.length}</strong>
      </article>
      <article class="order-summary-card">
        <span>Kesim Net M2</span>
        <strong>${formatDecimal(totalNetM2, 3)}</strong>
      </article>
      <article class="order-summary-card">
        <span>Kesim Brut M2</span>
        <strong>${formatDecimal(totalGrossM2, 3)}</strong>
      </article>
    </div>
    <nav class="order-detail-tabs" aria-label="Siparis detay sekmeleri">
      ${tabs.map((tab) => `
        <button class="order-detail-tab ${currentOrderDetailTab === tab.key ? "is-active" : ""}" type="button" data-order-detail-tab="${escapeHtml(tab.key)}">
          ${escapeHtml(tab.label)}
        </button>
      `).join("")}
    </nav>
    <div class="order-detail-tab-panel">
      ${renderOrderDetailTabContent(order, currentOrderDetailTab)}
    </div>
  `;
  target.querySelectorAll("[data-order-detail-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      currentOrderDetailTab = button.dataset.orderDetailTab || "general";
      renderOrderDetail(order);
    });
  });
  target.querySelector(".close-order-detail-btn")?.addEventListener("click", () => {
    selectedOrderId = null;
    currentOrderDetailTab = "general";
    renderOrderDetail(null);
  });
  bindActionButtons();
}

function getOrderDetailTabs() {
  return [
    { key: "general", label: "Genel Bilgiler" },
    { key: "items", label: "Siparis Kalemleri" },
    { key: "panjur", label: "Panjur Kapak" },
    { key: "cut-list", label: "Kesim Listesi" },
    { key: "work-order", label: "Uretim Emri" },
    { key: "stock", label: "Stok / Malzeme" },
    { key: "shipping", label: "Sevkiyat" },
    { key: "collection", label: "Tahsilat" },
    { key: "history", label: "Durum Gecmisi" },
  ];
}

function renderOrderDetailTabContent(order, tabKey = "general") {
  const renderers = {
    general: renderOrderGeneralTab,
    items: renderOrderItemsTab,
    panjur: renderOrderPanjurTab,
    "cut-list": renderOrderCutListTab,
    "work-order": renderOrderWorkOrderTab,
    stock: renderOrderStockTab,
    shipping: renderOrderShippingTab,
    collection: renderOrderCollectionTab,
    history: renderOrderHistoryTab,
  };
  return (renderers[tabKey] || renderOrderGeneralTab)(order);
}

function renderOrderGeneralTab(order) {
  return `
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head">
        <div>
          <h3>Genel Bilgiler</h3>
          <p>Siparisin cari, teklif, termin ve toplam bilgileri.</p>
        </div>
      </div>
      <div class="order-detail-info-grid">
        <article><span>Siparis No</span><strong>${escapeHtml(order.orderNo || order.trackingNo || `#${order.id}`)}</strong></article>
        <article><span>Teklif No</span><strong>${escapeHtml(order.offerNo || "-")}</strong></article>
        <article><span>Cari Firma</span><strong>${escapeHtml(order.cariName || "-")}</strong></article>
        <article><span>Durum</span><strong>${escapeHtml(order.status || "-")}</strong></article>
        <article><span>Siparis Tarihi</span><strong>${formatDate(order.orderDate)}</strong></article>
        <article><span>Termin Tarihi</span><strong>${formatDate(order.deliveryDate)}</strong></article>
        <article><span>Termin Suresi</span><strong>${Number(order.termDays || 0)} gun</strong></article>
        <article><span>Tutar</span><strong>${formatCurrency(order.netTotal || 0)}</strong></article>
      </div>
    </section>
  `;
}

function renderOrderItemsTab(order) {
  const rows = order.orderItems || order.items || [];
  return `
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head">
        <div>
          <h3>Siparis Kalemleri</h3>
          <p>order_items tablosundan gelen siparis kalemi snapshot kayitlari.</p>
        </div>
      </div>
      ${rows.length ? `
        <table class="mini-data-table">
          <thead><tr><th>Urun</th><th>Varyasyon</th><th>Renk</th><th>Hesap</th><th>Olcu</th><th>Adet</th><th>Miktar</th><th>Birim Fiyat</th><th>Tutar</th></tr></thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <td>
                  <strong>${escapeHtml(row.productName || row.modelName || row.coverType || row.materialGroup || "-")}</strong>
                  <small>${escapeHtml(row.productionNote || row.cncNote || row.note || "-")}</small>
                </td>
                <td>${escapeHtml(row.variantSummary || [row.materialType, row.coatingType, row.thicknessMm ? `${row.thicknessMm} mm` : "", row.woodType].filter(Boolean).join(" / ") || row.materialGroup || "-")}</td>
                <td>${escapeHtml(row.color || "-")}</td>
                <td>${escapeHtml(getProductCalculationLabel(row.calculationType || (isPieceUnit(row.unit) ? "piece" : "sqm")))}</td>
                <td>${isPieceUnit(row.unit) ? "-" : formatMmSize(row.widthMm ?? row.width, row.heightMm ?? row.height, row.length)}</td>
                <td>${Number(row.quantity || 0)}</td>
                <td>${formatDecimal(row.calculatedQuantity ?? row.m2 ?? 0, 3)}</td>
                <td>${formatCurrency(row.unitPrice || 0)} <small>${escapeHtml(row.unit || "-")}</small></td>
                <td>${formatCurrency(row.total || 0)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      ` : renderOrderEmptyState("Siparis kalemi bulunamadi.", "Bu siparis icin order_items tablosunda kayit yok.")}
    </section>
  `;
}

function renderOrderPanjurTab(order) {
  const eligibleItems = Array.isArray(order.panjurEligibleItems) ? order.panjurEligibleItems : [];
  const totalQuantity = eligibleItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalM2 = eligibleItems.reduce((sum, item) => {
    const width = Number(item.widthMm || 0);
    const height = Number(item.heightMm || 0);
    const quantity = Number(item.quantity || 0);
    return sum + ((width / 1000) * (height / 1000) * quantity);
  }, 0);
  return `
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head">
        <div>
          <h3>Panjur Kapak</h3>
          <p>Siparisteki panjur kapak kalemleri, sablon durumu ve sonraki CNC akisina gecis.</p>
        </div>
      </div>
      ${eligibleItems.length || order.panjurJob ? `
        <div class="order-detail-info-grid">
          <article><span>Siparis No</span><strong>${escapeHtml(order.orderNo || order.trackingNo || `#${order.id}`)}</strong></article>
          <article><span>Cari / Musteri</span><strong>${escapeHtml(order.cariName || "-")}</strong></article>
          <article><span>Toplam Kapak</span><strong>${totalQuantity}</strong></article>
          <article><span>Toplam m2</span><strong>${formatDecimal(totalM2, 3)}</strong></article>
          <article><span>Sablon Durumu</span><strong>${escapeHtml(order.panjurJob ? `Hazir - ${order.panjurJob.jobNo || "#"}` : "Olusturulmadi")}</strong></article>
          <article><span>Teslim Tarihi</span><strong>${formatDate(order.deliveryDate)}</strong></article>
        </div>
        ${eligibleItems.length ? `
          <table class="mini-data-table">
            <thead><tr><th>Urun</th><th>Varyasyon</th><th>Olcu</th><th>Adet</th><th>Renk</th></tr></thead>
            <tbody>
              ${eligibleItems.map((item) => `
                <tr>
                  <td><strong>${escapeHtml(item.productName || "-")}</strong></td>
                  <td>${escapeHtml(item.variantSummary || [item.materialType, item.coatingType, item.thicknessMm ? `${item.thicknessMm} mm` : "", item.woodType].filter(Boolean).join(" / ") || "-")}</td>
                  <td>${formatMmSize(item.widthMm, item.heightMm, 0)}</td>
                  <td>${Number(item.quantity || 0)}</td>
                  <td>${escapeHtml(item.color || "-")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : ""}
        <div class="order-detail-inline-actions">
          <button class="ghost-action create-panjur-job-btn" type="button" data-id="${order.id}">${escapeHtml(order.panjurJob ? "Panjur Kapak Sablonunu Ac" : "Panjur Kapak Sablonu Olustur")}</button>
          ${order.panjurJob ? `<button class="ghost-action open-order-panjur-job-btn" type="button" data-id="${order.panjurJob.id}">Sablonu Ac</button>` : ""}
        </div>
      ` : renderOrderEmptyState("Bu sipariste panjur kapak kalemi bulunamadi.", "Panjur Kapak sekmesi sadece panjur kategorisindeki order_items kalemleri icin aktif olur.")}
    </section>
  `;
}

function renderOrderCutListTab(order) {
  const cutListItems = order.cutListItems || [];
  return `
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head">
        <div>
          <h3>Kesim Listesi</h3>
          <p>Net ve brut m2 hesaplari ile uretime aktarilacak parca listesi.</p>
        </div>
        <div class="order-detail-inline-actions">
          <button class="ghost-action generate-cut-list-btn" type="button" data-id="${order.id}">${cutListItems.length ? "Kesim Listesini Guncelle" : "Kesim Listesi Olustur"}</button>
        </div>
      </div>
      ${cutListItems.length ? `
        <table class="mini-data-table">
          <thead><tr><th>Satir</th><th>Parca</th><th>Malzeme</th><th>Renk</th><th>Olcu</th><th>Adet</th><th>Net M2</th><th>Fire %</th><th>Brut M2</th></tr></thead>
          <tbody>
            ${cutListItems.map((item) => `
              <tr>
                <td>${Number(item.lineNo || 0)}</td>
                <td><strong>${escapeHtml(item.partName || "-")}</strong><small>${escapeHtml(item.productionNote || item.cncNote || "-")}</small></td>
                <td>${escapeHtml(item.materialType || "-")}</td>
                <td>${escapeHtml(item.color || "-")}</td>
                <td>${formatMmSize(item.width, item.height)}</td>
                <td>${Number(item.quantity || 0)}</td>
                <td>${formatDecimal(item.netM2, 3)}</td>
                <td>${formatDecimal(item.wasteRate, 2)}</td>
                <td>${formatDecimal(item.grossM2, 3)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      ` : renderOrderEmptyState("Kesim listesi bulunamadi.", "Kesim listesi olustur butonu ile ilk listeyi uretebilirsiniz.")}
    </section>
  `;
}

function renderOrderWorkOrderTab(order) {
  const workOrder = order.workOrder || null;
  const workOrderStages = order.workOrderStages || workOrder?.stages || [];
  return `
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head">
        <div>
          <h3>Uretim Emri</h3>
          <p>${workOrder ? "Siparise bagli aktif uretim emri." : "Bu siparis icin henuz uretim emri olusturulmadi."}</p>
        </div>
        <div class="order-detail-inline-actions">
          ${workOrder ? "" : `<button class="primary-btn create-work-order-btn" type="button" data-id="${order.id}">Uretim Emri Olustur</button>`}
        </div>
      </div>
      ${workOrder ? `
        <div class="work-order-summary">
          <article><span>Emir No</span><strong>${escapeHtml(workOrder.workOrderNo || "-")}</strong></article>
          <article><span>Durum</span><strong>${escapeHtml(getWorkOrderStatusLabel(workOrder.status))}</strong></article>
          <article><span>Oncelik</span><strong>${escapeHtml(getWorkOrderPriorityLabel(workOrder.priority))}</strong></article>
          <article><span>Atanan</span><strong>${escapeHtml(workOrder.assignedTo || "-")}</strong></article>
        </div>
        <div class="work-order-control-bar">
          <label>
            <span>Uretim Emri Durumu</span>
            <select class="work-order-status-select" data-id="${workOrder.id}">
              ${["draft", "planned", "in_progress", "paused", "completed", "cancelled"].map((status) => `<option value="${status}" ${status === workOrder.status ? "selected" : ""}>${escapeHtml(getWorkOrderStatusLabel(status))}</option>`).join("")}
            </select>
          </label>
        </div>
        <div class="work-order-stage-list">
          ${workOrderStages.length ? workOrderStages.map((stage) => `
            <article class="work-order-stage-card">
              <div>
                <strong>${escapeHtml(stage.stageName || "-")}</strong>
                <span>${escapeHtml(stage.assignedTo || "-")} | Baslangic: ${formatDateTime(stage.startedAt)} | Bitis: ${formatDateTime(stage.completedAt)}</span>
              </div>
              <select class="work-order-stage-status-select" data-order-id="${workOrder.id}" data-stage-id="${stage.id}">
                ${["pending", "in_progress", "completed", "blocked"].map((status) => `<option value="${status}" ${status === stage.status ? "selected" : ""}>${escapeHtml(getWorkOrderStageStatusLabel(status))}</option>`).join("")}
              </select>
            </article>
          `).join("") : renderOrderEmptyState("Uretim asamasi bulunamadi.", "Uretim emri asamalari olusturuldugunda burada listelenecek.")}
        </div>
      ` : renderOrderEmptyState("Uretim emri yok.", "Kesim listesi hazir oldugunda bu siparis icin uretim emri olusturabilirsiniz.")}
    </section>
  `;
}

function renderOrderStockTab(order) {
  const cutListItems = order.cutListItems || [];
  const reservations = order.stockReservations || [];
  const totalGrossM2 = cutListItems.reduce((sum, item) => sum + Number(item.grossM2 || 0), 0);
  const totalReserved = reservations.reduce((sum, item) => sum + Number(item.reservedQuantity || 0), 0);
  return `
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head">
        <div>
          <h3>Stok / Malzeme</h3>
          <p>Siparise bagli malzeme ihtiyaci ve stok rezervasyonlari.</p>
        </div>
      </div>
      ${cutListItems.length || reservations.length ? `
        <div class="order-detail-info-grid">
          <article><span>Kesim Kalemi</span><strong>${cutListItems.length}</strong></article>
          <article><span>Toplam Brut M2</span><strong>${formatDecimal(totalGrossM2, 3)}</strong></article>
          <article><span>Rezervasyon Kalemi</span><strong>${reservations.length}</strong></article>
          <article><span>Rezerve Miktar</span><strong>${formatDecimal(totalReserved, 3)} M2</strong></article>
        </div>
        ${reservations.length ? `
          <table class="mini-data-table">
            <thead><tr><th>Malzeme</th><th>Renk</th><th>Stok Karti</th><th>Miktar</th><th>Durum</th><th>Not</th></tr></thead>
            <tbody>
              ${reservations.map((item) => `
                <tr>
                  <td>${escapeHtml(item.materialType || "-")}</td>
                  <td>${escapeHtml(item.color || "-")}</td>
                  <td>${escapeHtml(item.stockItemName || item.stockItemCode || "-")}</td>
                  <td>${formatDecimal(item.reservedQuantity, 3)} ${escapeHtml(item.unit || "M2")}</td>
                  <td><span class="status-pill status-active">${escapeHtml(item.status || "-")}</span></td>
                  <td>${escapeHtml(item.note || "-")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : renderOrderEmptyState("Rezervasyon bekleniyor.", "ERP akisi baslatildiginda stok rezervasyonlari burada listelenecek.")}
      ` : renderOrderEmptyState("Stok / malzeme kaydi yok.", "Kesim listesi veya stok rezervasyonlari olusturuldugunda bu sekmede gorunecek.")}
    </section>
  `;
}

function renderOrderShippingTab() {
  return `
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head">
        <div>
          <h3>Sevkiyat</h3>
          <p>Siparis sevkiyat planlari ve teslim bilgileri burada izlenecek.</p>
        </div>
      </div>
      ${renderOrderEmptyState("Sevkiyat kaydi bulunamadi.", "Bu siparis icin henuz sevkiyat planlamasi yapilmadi.")}
    </section>
  `;
}

function renderOrderCollectionTab(order) {
  const movements = order.accountMovements || [];
  const financeEntries = order.financeEntries || [];
  const totalDebt = movements
    .filter((item) => String(item.movementType || "").toLowerCase() === "borc")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalCollection = movements
    .filter((item) => ["tahsilat", "alacak dekontu"].includes(String(item.movementType || "").toLowerCase()))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalFinanceCost = financeEntries.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const remaining = Math.max(0, totalDebt - totalCollection);
  return `
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head">
        <div>
          <h3>Tahsilat / Cari Hareket</h3>
          <p>Siparise bagli account_movements ve finance_entries kayitlari.</p>
        </div>
      </div>
      ${movements.length || financeEntries.length ? `
        <div class="order-detail-info-grid">
          <article><span>Cariye Islenen</span><strong>${formatCurrency(totalDebt)}</strong></article>
          <article><span>Tahsilat</span><strong>${formatCurrency(totalCollection)}</strong></article>
          <article><span>Kalan</span><strong>${formatCurrency(remaining)}</strong></article>
          <article><span>Maliyet Kaydi</span><strong>${formatCurrency(totalFinanceCost)}</strong></article>
          <article><span>Siparis Tutari</span><strong>${formatCurrency(order.netTotal || 0)}</strong></article>
        </div>
        ${movements.length ? `
          <h4 class="order-detail-subtitle">Cari Hareketler</h4>
          <table class="mini-data-table">
            <thead><tr><th>Tarih</th><th>Hareket</th><th>Tutar</th><th>Not</th></tr></thead>
            <tbody>
              ${movements.map((item) => `
                <tr>
                  <td>${formatDate(item.movementDate)}</td>
                  <td>${escapeHtml(item.movementType === "Borc" ? "Siparis Cari Borcu" : item.movementType || "-")}</td>
                  <td>${formatCurrency(item.amount || 0)}</td>
                  <td>${escapeHtml(item.note || "-")}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : renderOrderEmptyState("Cari hareket bekleniyor.", "Siparis onaylandiginda cari borc hareketi otomatik olusur.")}
        ${financeEntries.length ? `
          <h4 class="order-detail-subtitle">Finans / Maliyet Kayitlari</h4>
          <table class="mini-data-table">
            <thead><tr><th>Tur</th><th>Baslik</th><th>Tutar</th><th>Tarih</th></tr></thead>
            <tbody>
              ${financeEntries.map((item) => `
                <tr>
                  <td>${escapeHtml(item.type || "-")}</td>
                  <td>${escapeHtml(item.title || "-")}</td>
                  <td>${formatCurrency(item.amount || 0)}</td>
                  <td>${formatDate(item.createdAt)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : ``}
      ` : renderOrderEmptyState("Cari hareket kaydi bulunamadi.", "Siparis onaylandiginda veya ERP akisi baslatildiginda cari hareket otomatik olusacak.")}
    </section>
  `;
}

function renderOrderHistoryTab(order) {
  const history = order.statusHistory || [];
  return `
    <section class="order-detail-card order-detail-card-wide">
      <div class="order-detail-card-head">
        <div>
          <h3>Durum Gecmisi</h3>
          <p>Siparis durum degisikliklerinin kayit altina alindigi gecmis.</p>
        </div>
      </div>
      <div class="status-history-list">
        ${history.length ? history.map((item) => `
          <article>
            <strong>${escapeHtml(item.fromStatus || "Baslangic")} -> ${escapeHtml(item.toStatus || "-")}</strong>
            <span>${formatDate(item.createdAt)} ${item.note ? `| ${escapeHtml(item.note)}` : ""}</span>
          </article>
        `).join("") : renderOrderEmptyState("Durum gecmisi bulunamadi.", "Siparis durumlari degistikce bu sekmede listelenecek.")}
      </div>
    </section>
  `;
}

function renderOrderEmptyState(title, description = "") {
  return `
    <div class="order-detail-empty">
      <strong>${escapeHtml(title)}</strong>
      ${description ? `<span>${escapeHtml(description)}</span>` : ""}
    </div>
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
  const recordCategories = (records || []).map((item) => item.category).filter(Boolean);
  const storedCategories = getStoredProductCategories().filter((category) => !recordCategories.length || recordCategories.includes(category));
  return [...new Set([
    "Panjur Sistemleri",
    ...storedCategories,
    ...recordCategories,
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

function renderProductCategories(records) {
  const categories = collectProductCategories(records);
  const selectedValue = productCategorySelect?.value || "";
  if (!selectedCategoryManager || !categories.includes(selectedCategoryManager)) {
    selectedCategoryManager = categories[0] || "";
  }
  syncProductCategorySelect(records, selectedValue);
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
    const isExpanded = selectedExpandedProductCategory === category;
    const isActiveCategory = selectedProductCategoryFilter === category;
    return `
      <article class="products-tree-group ${isExpanded ? "expanded" : ""}">
        <div class="products-tree-category ${isActiveCategory ? "active" : ""}">
          <button class="products-tree-main" type="button" data-hierarchy-category="${escapeHtml(category)}">
            <strong>${escapeHtml(category)}</strong>
            <span>${items.length} kayit</span>
          </button>
          <button class="products-tree-toggle" type="button" data-hierarchy-toggle="${escapeHtml(category)}">${isExpanded ? "−" : "+"}</button>
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
  const currentValue = productBulkCategory.value;
  productBulkCategory.innerHTML = [
    `<option value="">Kategori Secin</option>`,
    ...categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`),
  ].join("");
  if (currentValue && categories.includes(currentValue)) {
    productBulkCategory.value = currentValue;
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
    ["Urun Adi", "Kategori", "Birim", "Hesaplama", "Fiyat Tipi", "Fiyat", "Fire Orani", "Malzeme", "Kalinlik", "Not"],
    ...records.map((item) => [
      item.name || "",
      item.category || "",
      item.unit || "",
      getProductCalculationLabel(item.calculationType),
      getProductDisplayBasis(item),
      Number(getProductDisplayPrice(item)),
      Number(item.defaultWasteRate || 0),
      item.materialType || "",
      item.thickness ?? "",
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
  const calculationTypeInput = forms.product?.querySelector("[name='calculationType']");
  const defaultWasteRateInput = forms.product?.querySelector("[name='defaultWasteRate']");
  const nameInput = forms.product?.querySelector("[name='name']");
  const materialTypeInput = forms.product?.querySelector("[name='materialType']");
  const thicknessInput = forms.product?.querySelector("[name='thickness']");
  if (calculationTypeInput) calculationTypeInput.value = "sqm";
  if (defaultWasteRateInput) defaultWasteRateInput.value = "0";
  if (nameInput) nameInput.value = "Panjur Kapak";
  if (materialTypeInput) materialTypeInput.value = "MDF / Ahsap";
  if (thicknessInput) thicknessInput.value = "18";
  if (productEditId) productEditId.value = "";
  if (productSubmitBtn) productSubmitBtn.textContent = "Urunu Kaydet";
  productSubmitBtn?.classList.remove("is-active");
  productResetBtn?.classList.remove("is-active");
  if (productHasVariants) productHasVariants.checked = true;
  if (productCategorySelect) {
    syncProductCategorySelect(cache.products || [], "Panjur Sistemleri");
  }
  productVariantsDraft = [];
  resetProductVariantEditor();
  renderProductVariantsEditor();
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
  const calculationTypeInput = forms.product.querySelector("[name='calculationType']");
  const defaultWasteRateInput = forms.product.querySelector("[name='defaultWasteRate']");
  const materialTypeInput = forms.product.querySelector("[name='materialType']");
  const thicknessInput = forms.product.querySelector("[name='thickness']");
  const edgeBandDefaultInput = forms.product.querySelector("[name='edgeBandDefault']");
  const stockItemIdInput = forms.product.querySelector("[name='stockItemId']");
  const imageInput = forms.product.querySelector("[name='imageUrl']");
  const notesInput = forms.product.querySelector("[name='costNotes']");
  if (nameInput) nameInput.value = product.name || "";
  if (productCategorySelect) {
    syncProductCategorySelect(cache.products || [], product.category || "");
  }
  renderProductCategories(cache.products || []);
  if (costTypeInput) costTypeInput.value = getProductDisplayBasis(product);
  if (costAmountInput) costAmountInput.value = formatMoneyInputValue(getProductDisplayPrice(product));
  if (calculationTypeInput) calculationTypeInput.value = normalizeProductCalculationType(product.calculationType);
  if (defaultWasteRateInput) defaultWasteRateInput.value = String(product.defaultWasteRate ?? 0);
  if (materialTypeInput) materialTypeInput.value = product.materialType || "";
  if (thicknessInput) thicknessInput.value = product.thickness === null || product.thickness === undefined ? "" : String(product.thickness);
  if (edgeBandDefaultInput) edgeBandDefaultInput.value = product.edgeBandDefault || "";
  if (stockItemIdInput) stockItemIdInput.value = product.stockItemId ? String(product.stockItemId) : "";
  if (imageInput) imageInput.value = product.imageUrl || "";
  if (notesInput) notesInput.value = product.costNotes || "";
  if (productHasVariants) productHasVariants.checked = product.hasVariants !== false;
  productVariantsDraft = (product.variants || []).map((variant, index) => normalizeProductVariantDraft(variant, index));
  resetProductVariantEditor();
  renderProductVariantsEditor();
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
  const activeRecords = (records || []).filter((item) => item.isActive !== false);
  renderProductCategories(activeRecords || []);
  renderProductHierarchyTree(activeRecords || []);
  syncBulkCategorySelect(activeRecords || []);
  const filtered = (activeRecords || []).filter((item) => {
    const haystack = [
      item.name,
      item.category,
      item.costNotes,
      item.materialType,
      item.edgeBandDefault,
      (item.variants || []).map((variant) => createDefaultProductVariantName(variant)).join(" "),
      getProductCalculationLabel(item.calculationType),
    ].join(" ").toLowerCase();
    const matchesSearch = !searchTerm || haystack.includes(searchTerm);
    const matchesCategory = matchesSelectedProductCategory(item);
    return matchesSearch && matchesCategory;
  });
  const sorted = getSortedProducts(filtered);
  const scopedForCategory = (activeRecords || []).filter((item) => matchesSelectedProductCategory(item));
  const categoryLabel = selectedProductCategoryFilter || "Tum Kategoriler";
  if (productsSelectionSummary) {
    productsSelectionSummary.innerHTML = `
      <article class="products-summary-card">
        <span>Kategori</span>
        <strong>${escapeHtml(categoryLabel)}</strong>
        <small>${scopedForCategory.length} kayit</small>
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
          <span>Urun Adi</span>
          <span>Grubu</span>
          <span>Varyasyon</span>
          <span>Birim</span>
          <span>Hesap</span>
          <span>Fiyat</span>
          <span>Islem</span>
        </div>
      ${sorted.map((item) => `
        <div class="products-table-row products-table-row-simple ${productEditId?.value === String(item.id) ? "is-active" : ""}" data-product-edit="${item.id}">
          <span class="products-cell"><strong>${escapeHtml(item.name)}</strong></span>
          <span class="products-cell">${escapeHtml(item.category || "-")}</span>
          <span class="products-cell">${item.hasVariants ? `${(item.variants || []).length} varyasyon` : "Tekil"}</span>
          <span class="products-cell">${escapeHtml(item.unit || "-")}</span>
          <span class="products-cell">${escapeHtml(getProductCalculationLabel(item.calculationType))}</span>
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
  const waitingOffersLegacy = (data.offers || []).filter((item) => (
    ["Gönderildi", "Beklemede", "Revize"].includes(normalizeOfferStatusLabel(item.status))
  )).length;
  const waitingOffers = (data.offers || []).filter((item) => (
    ["sent", "pending", "revised"].includes(normalizeOfferStatusKey(item.status))
  )).length;

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

function closeCrmActionsDropdown() {
  document.querySelector(".crm-actions-floating-menu")?.remove();
}

function openCrmActionsDropdown(button) {
  const leadId = Number(button.dataset.crmActionsToggle);
  const lead = (cache.crm || []).find((item) => Number(item.id) === leadId);
  if (!lead) return;
  closeCrmActionsDropdown();
  const menu = document.createElement("div");
  menu.className = "offer-actions-floating-menu crm-actions-floating-menu";
  menu.innerHTML = [
    ["edit", "Duzenle", "edit"],
    ["activity", "Gorusme Ekle", "send"],
    ["offer", "Teklif Olustur", "pdf"],
    ["cari", "Cariye Donustur", "cart"],
    ["won", "Kazanildi Yap", "workflow"],
    ["lost", "Kaybedildi Yap", "trash"],
  ].map(([key, label, icon]) => `
    <button class="offer-actions-menu-item ${key === "lost" ? "is-danger" : ""}" type="button" data-crm-menu-action="${key}" data-id="${leadId}">
      ${getOfferActionIcon(icon)}<span>${label}</span>
    </button>
  `).join("");
  document.body.appendChild(menu);
  const rect = button.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  menu.style.left = `${Math.max(8, Math.min(window.innerWidth - menuRect.width - 8, rect.right - menuRect.width))}px`;
  menu.style.top = `${Math.max(8, rect.bottom + 6)}px`;
  menu.querySelectorAll("[data-crm-menu-action]").forEach((item) => {
    item.addEventListener("click", async () => {
      closeCrmActionsDropdown();
      await handleCrmMenuAction(item.dataset.crmMenuAction, leadId);
    });
  });
}

async function handleCrmMenuAction(action, leadId) {
  const lead = (cache.crm || []).find((item) => Number(item.id) === Number(leadId));
  if (!lead) return;
  try {
    if (action === "edit") {
      if (crmLeadEditId) crmLeadEditId.value = String(lead.id);
      Object.entries({
        companyName: lead.companyName,
        contactName: lead.contactName,
        phone: lead.phone,
        email: lead.email,
        source: lead.source,
        status: lead.status,
        priority: lead.priority,
        estimatedValue: lead.estimatedValue,
        winProbability: lead.winProbability,
        nextFollowUpDate: lead.nextFollowUpDate,
        assignedTo: lead.assignedTo,
        city: lead.city,
        district: lead.district,
        note: lead.note,
      }).forEach(([name, value]) => {
        const input = crmLeadForm?.querySelector(`[name='${name}']`);
        if (input) input.value = value ?? "";
      });
      crmLeadForm?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (action === "activity") {
      const subject = window.prompt("Gorusme konusu", "Telefon gorusmesi");
      if (!subject) return;
      await api.crm.addActivity(leadId, { activityType: "Telefon", subject, activityDate: new Date().toISOString().slice(0, 10) });
    }
    if (action === "offer") {
      await api.crm.createOffer(leadId);
      setActiveView("offers");
    }
    if (action === "cari") await api.crm.convertToCari(leadId);
    if (action === "won") await api.crm.updateStatus(leadId, { status: "won", note: "Kazanildi olarak isaretlendi." });
    if (action === "lost") {
      const lostReason = window.prompt("Kaybetme nedeni", "");
      await api.crm.updateStatus(leadId, { status: "lost", lostReason, note: lostReason || "Kaybedildi olarak isaretlendi." });
    }
    await refreshUI();
  } catch (error) {
    window.alert(`CRM islemi tamamlanamadi: ${error?.message || "Bilinmeyen hata"}`);
  }
}

function bindCrmActions() {
  document.querySelectorAll(".crm-detail-btn").forEach((button) => {
    button.onclick = async () => {
      const leadId = Number(button.dataset.id);
      const lead = (cache.crm || []).find((item) => item.id === leadId);
      const bundle = await api.crm.activities(leadId).catch(() => ({}));
      renderCrmDetail(lead, bundle);
      crmDetailPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  });
  document.querySelectorAll("[data-crm-actions-toggle]").forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      openCrmActionsDropdown(button);
    };
  });
}

function bindActions() {
  document.querySelectorAll("[data-offer-status-toggle]").forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      openOfferStatusDropdown(button);
    };
  });
  document.querySelectorAll("[data-offer-actions-toggle]").forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      openOfferActionsDropdown(button);
    };
  });
  document.querySelectorAll(".edit-offer-btn").forEach((button) => {
    button.onclick = () => openOfferForEdit(Number(button.dataset.id));
  });
  document.querySelectorAll(".view-offer-btn").forEach((button) => {
    button.onclick = () => {
      openOfferPreview(Number(button.dataset.id));
    };
  });
  document.querySelectorAll(".revise-offer-btn").forEach((button) => {
    button.onclick = async () => {
      button.disabled = true;
      try {
        const result = await api.offers.createRevision(Number(button.dataset.id), { status: "draft" });
        await refreshUI();
        openOfferForEdit(result.id);
      } catch (error) {
        window.alert(`Revizyon olusturulamadi: ${error?.message || "Bilinmeyen hata"}`);
        button.disabled = false;
      }
    };
  });
  document.querySelectorAll(".print-offer-row-btn").forEach((button) => {
    button.onclick = () => {
      if (offerPrintSelect) offerPrintSelect.value = String(button.dataset.id);
      const offer = (cache.offers || []).find((item) => Number(item.id) === Number(button.dataset.id));
      if (!offer) {
        window.alert("Yazdirilacak teklif bulunamadi.");
        return;
      }
      const cari = (cache.cari || []).find((item) => item.id === offer.cariId);
      const printWindow = window.open("", "_blank", "width=960,height=800");
      if (!printWindow) return;
      printWindow.document.write(buildOfferPrintHtml(offer, cari));
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 300);
    };
  });
  document.querySelectorAll(".order-detail-btn").forEach((button) => {
    button.onclick = () => {
      const nextOrderId = Number(button.dataset.id);
      if (selectedOrderId !== nextOrderId) currentOrderDetailTab = "general";
      selectedOrderId = nextOrderId;
      renderOrderDetail((cache.orders || []).find((item) => item.id === selectedOrderId) || null);
      document.getElementById("orderDetailPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  });
  document.querySelectorAll("[data-order-actions-toggle]").forEach((button) => {
    button.onclick = (event) => {
      event.stopPropagation();
      openOrderActionsDropdown(button);
    };
  });
  document.querySelectorAll(".order-status-select").forEach((select) => {
    select.onchange = async () => {
      select.disabled = true;
      try {
        await api.orders.updateStatus(Number(select.dataset.id), select.value);
        await refreshUI();
      } catch (error) {
        window.alert(`Siparis durumu guncellenemedi: ${error?.message || "Bilinmeyen hata"}`);
        select.disabled = false;
      }
    };
  });
  document.querySelectorAll(".offer-linked-order-status-select").forEach((select) => {
    select.onchange = async () => {
      select.disabled = true;
      try {
        await api.orders.updateStatus(Number(select.dataset.orderId), select.value);
        await refreshUI();
      } catch (error) {
        window.alert(`Bagli siparis durumu guncellenemedi: ${error?.message || "Bilinmeyen hata"}`);
        select.disabled = false;
      }
    };
  });
  document.querySelectorAll(".close-order-detail-btn").forEach((button) => {
    button.onclick = () => {
      selectedOrderId = null;
      renderOrderDetail(null);
    };
  });
  document.querySelectorAll(".work-order-detail-btn").forEach((button) => {
    button.onclick = () => {
      selectedWorkOrderId = Number(button.dataset.id);
      renderWorkOrderDetail((cache.workOrders || []).find((item) => item.id === selectedWorkOrderId) || null);
      workOrderDetailPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
  });
  document.querySelectorAll(".work-order-open-order-btn").forEach((button) => {
    button.onclick = () => {
      const orderId = Number(button.dataset.orderId);
      const order = (cache.orders || []).find((item) => item.id === orderId);
      setActiveView("orders");
      if (selectedOrderId !== orderId) currentOrderDetailTab = "general";
      selectedOrderId = orderId;
      if (order) {
        renderOrderDetail(order);
        document.getElementById("orderDetailPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
  });
  document.querySelectorAll(".close-work-order-detail-btn").forEach((button) => {
    button.onclick = () => {
      selectedWorkOrderId = null;
      renderWorkOrderDetail(null);
    };
  });
  document.querySelectorAll(".order-refresh-btn").forEach((button) => {
    button.onclick = async () => {
      button.disabled = true;
      try {
        await refreshUI();
      } catch (error) {
        window.alert(`Siparis detayi yenilenemedi: ${error?.message || "Bilinmeyen hata"}`);
        button.disabled = false;
      }
    };
  });
  document.querySelectorAll(".generate-cut-list-btn").forEach((button) => {
    button.onclick = async () => {
      button.disabled = true;
      try {
        await api.orders.generateCutList(Number(button.dataset.id));
        await refreshUI();
      } catch (error) {
        window.alert(`Kesim listesi olusturulamadi: ${error?.message || "Bilinmeyen hata"}`);
        button.disabled = false;
      }
    };
  });
  document.querySelectorAll(".run-order-erp-flow-btn").forEach((button) => {
    button.onclick = async () => {
      button.disabled = true;
      try {
        await api.orders.runErpFlow(Number(button.dataset.id));
        await refreshUI();
      } catch (error) {
        window.alert(`Uretim sureci baslatilamadi: ${error?.message || "Bilinmeyen hata"}`);
        button.disabled = false;
      }
    };
  });
  document.querySelectorAll(".create-work-order-btn").forEach((button) => {
    button.onclick = async () => {
      button.disabled = true;
      try {
        await api.orders.createWorkOrder(Number(button.dataset.id));
        await refreshUI();
      } catch (error) {
        window.alert(`Uretim emri olusturulamadi: ${error?.message || "Bilinmeyen hata"}`);
        button.disabled = false;
      }
    };
  });
  document.querySelectorAll(".create-panjur-job-btn").forEach((button) => {
    button.onclick = async () => {
      const orderId = Number(button.dataset.id);
      const currentOrder = (cache.orders || []).find((item) => item.id === orderId) || null;
      const existingJobId = Number(currentOrder?.panjurJob?.id || 0);
      if (existingJobId) {
        setActiveView("panjur");
        if (window.PanjurTemplateModule?.openJob) {
          await window.PanjurTemplateModule.openJob(existingJobId);
        }
        return;
      }
      button.disabled = true;
      try {
        const result = await api.orders.createPanjurJob(orderId);
        await refreshUI();
        const jobId = Number(result.job_id || result.panjur_job?.id || 0);
        setActiveView("panjur");
        if (jobId && window.PanjurTemplateModule?.openJob) {
          await window.PanjurTemplateModule.openJob(jobId);
        }
      } catch (error) {
        if ((error?.message || "").includes("zaten var")) {
          window.alert("Bu siparis icin panjur sablonu zaten var.");
          setActiveView("panjur");
          if (existingJobId && window.PanjurTemplateModule?.openJob) {
            await window.PanjurTemplateModule.openJob(existingJobId);
          }
        } else if ((error?.message || "").includes("panjur_kapak")) {
          window.alert("Bu sipariste panjur kapak kategorisinde kalem bulunamadi.");
        } else {
          window.alert(`Panjur kapak sablonu olusturulamadi: ${error?.message || "Bilinmeyen hata"}`);
        }
        button.disabled = false;
      }
    };
  });
  document.querySelectorAll(".open-order-panjur-job-btn").forEach((button) => {
    button.onclick = async () => {
      const jobId = Number(button.dataset.id || 0);
      if (!jobId) return;
      setActiveView("panjur");
      if (window.PanjurTemplateModule?.openJob) {
        await window.PanjurTemplateModule.openJob(jobId);
      }
    };
  });
  document.querySelectorAll(".work-order-status-select").forEach((select) => {
    select.onchange = async () => {
      select.disabled = true;
      try {
        await api.workOrders.updateStatus(Number(select.dataset.id), { status: select.value });
        await refreshUI();
      } catch (error) {
        window.alert(`Uretim emri durumu guncellenemedi: ${error?.message || "Bilinmeyen hata"}`);
        select.disabled = false;
      }
    };
  });
  document.querySelectorAll(".work-order-stage-status-select").forEach((select) => {
    select.onchange = async () => {
      select.disabled = true;
      try {
        await api.workOrders.updateStageStatus(
          Number(select.dataset.orderId),
          Number(select.dataset.stageId),
          { status: select.value },
        );
        await refreshUI();
      } catch (error) {
        window.alert(`Uretim asamasi guncellenemedi: ${error?.message || "Bilinmeyen hata"}`);
        select.disabled = false;
      }
    };
  });
  document.querySelectorAll(".approve-offer-btn").forEach((button) => {
    button.onclick = async () => {
      button.disabled = true;
      try {
        const result = await api.offers.approve(Number(button.dataset.id));
        await refreshUI();
        setActiveView("orders");
        if (result?.order_id) {
          currentOrderDetailTab = "general";
          selectedOrderId = Number(result.order_id);
          const order = (cache.orders || []).find((item) => item.id === selectedOrderId) || null;
          renderOrderDetail(order);
          document.getElementById("orderDetailPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (error) {
        window.alert(`Teklif siparise donusturulemedi: ${error?.message || "Bilinmeyen hata"}`);
        button.disabled = false;
      }
    };
  });
  document.querySelectorAll(".offer-status-transition-btn:not(.approve-offer-btn):not(.revise-offer-btn)").forEach((button) => {
    button.onclick = async () => {
      const offerId = Number(button.dataset.offerStatusId);
      const nextStatus = button.dataset.status;
      button.disabled = true;
      try {
        await api.offers.updateStatus(offerId, nextStatus);
        await refreshUI();
      } catch (error) {
        window.alert(`Teklif durumu guncellenemedi: ${error?.message || "Bilinmeyen hata"}`);
        button.disabled = false;
      }
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
  const rows = (offer.items?.length ? offer.items : meta.rows?.length ? meta.rows : [{
    modelName: offer.coverType,
    coverType: offer.coverType,
    color: offer.color,
    width: offer.width,
    height: offer.height,
    quantity: offer.quantity,
    unitPrice: offer.unitPrice,
    total: offer.netTotal,
    note: "",
  }]).map((row) => sanitizeOfferRowForPersistence(row));
  const summary = calculateOfferSummary(rows, Number(offer.discountRate || meta.discountRate || 0), Number(meta.vatRate || 20));
  const grandTotal = Number(meta.summary?.grandTotal ?? summary.grandTotal ?? offer.netTotal ?? 0);
  const subtotal = Number(meta.summary?.subtotal ?? summary.subtotal ?? 0);
  const vatAmount = Number(meta.summary?.vatAmount ?? summary.vatAmount ?? 0);
  const discountAmount = Number(meta.summary?.discountAmount ?? summary.discountAmount ?? 0);
  const status = getOfferStatusConfig(offer.status);
  const revisionText = Number(offer.revisionNo || 0) > 0 ? `Rev ${Number(offer.revisionNo || 0)}` : "Ilk teklif";
  return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Teklif Ciktisi</title>
      <style>
        @page { size: A4; margin: 12mm; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #eef3f8; color: #17253a; font-family: "Segoe UI", Arial, sans-serif; }
        .sheet { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm; background: #fff; }
        .topbar { height: 7px; margin: -14mm -14mm 14mm; background: linear-gradient(90deg, #0f2a44, #1d70d6, #12a36f); }
        .head { display: grid; grid-template-columns: 1fr 240px; gap: 18px; align-items: start; }
        .brand-row { display: flex; gap: 12px; align-items: center; }
        .logo { width: 52px; height: 52px; border-radius: 16px; display: grid; place-items: center; background: #0f2a44; color: #fff; font-size: 24px; font-weight: 900; }
        .brand { font-size: 24px; font-weight: 900; letter-spacing: .08em; color: #0f2a44; }
        .brand-sub { margin-top: 2px; color: #12a36f; font-size: 11px; font-weight: 800; letter-spacing: .34em; }
        .doc-box { border: 1px solid #d9e3ef; border-radius: 14px; overflow: hidden; }
        .doc-box h1 { margin: 0; padding: 11px 13px; background: #0f2a44; color: #fff; font-size: 16px; letter-spacing: .04em; }
        .doc-line { display: grid; grid-template-columns: 88px 1fr; gap: 8px; padding: 7px 12px; border-top: 1px solid #edf2f7; font-size: 11px; }
        .doc-line span { color: #6b7d90; font-weight: 700; }
        .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
        .card { border: 1px solid #d9e3ef; border-radius: 14px; padding: 13px; background: #fbfdff; }
        .card h3 { margin: 0 0 9px; color: #0f2a44; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }
        .info { display: grid; gap: 5px; font-size: 11px; line-height: 1.45; }
        .muted { color: #6b7d90; }
        .badge { display: inline-flex; width: max-content; align-items: center; min-height: 22px; border-radius: 999px; padding: 0 9px; background: #e8fbf0; color: #16834f; font-size: 10px; font-weight: 900; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 10.5px; }
        th { background: #f0f5fb; color: #334b66; text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: .04em; }
        th, td { border: 1px solid #d9e3ef; padding: 7px 8px; vertical-align: top; }
        tbody tr:nth-child(even) td { background: #fbfdff; }
        .right { text-align: right; }
        .totals { width: 290px; margin: 16px 0 0 auto; border: 1px solid #d9e3ef; border-radius: 14px; overflow: hidden; }
        .total-row { display: grid; grid-template-columns: 1fr 110px; gap: 10px; padding: 8px 11px; border-top: 1px solid #edf2f7; font-size: 11px; }
        .total-row:first-child { border-top: 0; }
        .grand { background: #0f2a44; color: #fff; font-size: 14px; font-weight: 900; }
        .notes { margin-top: 16px; display: grid; grid-template-columns: 1.2fr .8fr; gap: 12px; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
        .signature { min-height: 68px; border: 1px dashed #c7d4e3; border-radius: 12px; padding: 10px; color: #6b7d90; font-size: 10px; }
        .footer { margin-top: 14px; padding-top: 9px; border-top: 1px solid #d9e3ef; display: flex; justify-content: space-between; color: #6b7d90; font-size: 9.5px; }
        @media print { body { background: #fff; } .sheet { width: auto; min-height: auto; margin: 0; padding: 0; } .topbar { margin: 0 0 10mm; } }
      </style>
    </head>
    <body>
      <main class="sheet">
        <div class="topbar"></div>
        <section class="head">
          <div class="brand-row">
            <div class="logo">S</div>
            <div>
              <div class="brand">Silva Ahsap</div>
              <div class="brand-sub">AHSAP</div>
              <p class="muted">${escapeHtml(meta.formType || "Teklif Formu")} | ${escapeHtml(revisionText)}</p>
            </div>
          </div>
          <div class="doc-box">
            <h1>TEKLIF</h1>
            <div class="doc-line"><span>Teklif No</span><strong>${escapeHtml(offer.offerNo || `TK-${offer.id}`)}</strong></div>
            <div class="doc-line"><span>Tarih</span><strong>${formatDate(offer.orderDate)}</strong></div>
            <div class="doc-line"><span>Gecerlilik</span><strong>${formatDate(offer.deliveryDate)}</strong></div>
            <div class="doc-line"><span>Durum</span><strong>${escapeHtml(status.label)}</strong></div>
          </div>
        </section>
        <section class="section-grid">
          <div class="card">
          <h3>Cari Bilgisi</h3>
            <div class="info">
              <strong>${escapeHtml(cari?.companyName || offer.cariName || "-")}</strong>
              <span>${escapeHtml(cari?.fullName || "")}</span>
              <span>${escapeHtml(cari?.phone || "")}</span>
              <span>${escapeHtml(cari?.email || "")}</span>
            </div>
          </div>
          <div class="card">
            <h3>Ticari Bilgiler</h3>
            <div class="info">
              <span>Vergi Dairesi: <strong>${escapeHtml(cari?.taxOffice || "-")}</strong></span>
              <span>Vergi No: <strong>${escapeHtml(cari?.taxNumber || "-")}</strong></span>
              <span>Termin: <strong>${Number(offer.termDays || 0)} gun</strong></span>
              <span class="badge">Iskonto %${Number(offer.discountRate || 0)}</span>
            </div>
          </div>
        </section>
        <table>
          <thead><tr><th>#</th><th>Urun / Model</th><th>Renk</th><th>Olcu</th><th class="right">Adet</th><th class="right">Miktar</th><th class="right">Birim Fiyat</th><th class="right">Tutar</th></tr></thead>
          <tbody>
            ${rows.map((row, index) => `
              <tr>
                <td>${index + 1}</td>
                <td><strong>${escapeHtml(row.modelName || row.coverType || "-")}</strong><br><span class="muted">${escapeHtml(row.materialGroup || row.unit || "-")}</span></td>
                <td>${escapeHtml(row.color || "-")}</td>
                <td>${row.calculationType === "sqm" ? `${Number(row.width || 0)} x ${Number(row.height || 0)} mm` : row.calculationType === "linear_meter" ? `${Number(row.length || 0)} mm` : "-"}</td>
                <td class="right">${Number(row.quantity || 0)}</td>
                <td class="right">${Number(row.calculatedQuantity || row.m2 || 0).toFixed(3)} ${escapeHtml(row.unit || "")}</td>
                <td class="right">${formatCurrency(row.unitPrice)}</td>
                <td class="right">${formatCurrency(row.total)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        <section class="totals">
          <div class="total-row"><span>Ara Toplam</span><strong class="right">${formatCurrency(subtotal + discountAmount)}</strong></div>
          <div class="total-row"><span>Iskonto</span><strong class="right">-${formatCurrency(discountAmount)}</strong></div>
          <div class="total-row"><span>KDV</span><strong class="right">${formatCurrency(vatAmount)}</strong></div>
          <div class="total-row grand"><span>Genel Toplam</span><strong class="right">${formatCurrency(grandTotal)}</strong></div>
        </section>
        <section class="notes">
          <div class="card"><h3>Notlar</h3><p class="muted">${escapeHtml(meta.notes || offer.contractText || "Ek not bulunmuyor.")}</p></div>
          <div class="card"><h3>Sevkiyat</h3><div class="info"><span>${escapeHtml(offer.shipment || "-")}</span><span>Teslim: ${formatDate(offer.deliveryDate)}</span></div></div>
        </section>
        <section class="signatures">
          <div class="signature">Hazirlayan / Imza</div>
          <div class="signature">Musteri Onayi / Imza</div>
        </section>
        <footer class="footer"><span>Silva Ahsap teklif dokumani</span><span>Olusturma: ${formatDate(new Date().toISOString())}</span></footer>
      </main>
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
    orderNo: `SP-${offer.id}`,
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

function formToObjectLegacy(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function normalizeCari(rows) {
  return (rows || []).map((row) => {
    const meta = getCariMetaById(row.id);
    return {
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
      email: meta.email || "",
      whatsapp: meta.whatsapp || "",
      website: meta.website || "",
      phone2: meta.phone2 || "",
      department: meta.department || "",
      accountStatus: meta.accountStatus || "Aktif",
      sector: meta.sector || "",
      source: meta.source || "",
      tag: meta.tag || "",
      maturityDay: Number(meta.maturityDay || 0),
      currency: meta.currency || "TRY",
      openingBalance: Number(meta.openingBalance || 0),
      balanceType: meta.balanceType || "Borc",
      eInvoiceStatus: meta.eInvoiceStatus || "Bilinmiyor",
      iban: meta.iban || "",
      specialWarning: meta.specialWarning || "",
      addresses: Array.isArray(meta.addresses) ? meta.addresses : [],
      createdAt: row.created_at,
    };
  });
}

function normalizeOffers(rows) {
  return (rows || []).map((row) => {
    const meta = parseOfferContract(row.contract_text);
    const items = Array.isArray(row.items) && row.items.length
      ? row.items.map((item) => ({
        id: item.id,
        offerId: item.offerId || item.offer_id || row.id,
        lineNo: item.lineNo || item.line_no || 1,
        productId: item.productId || item.product_id || null,
        variantId: item.variantId || item.variant_id || null,
        materialGroup: item.materialGroup || item.material_group || "",
        materialType: item.materialType || item.material_type || "",
        coatingType: item.coatingType || item.coating_type || "",
        modelName: item.modelName || item.model_name || item.coverType || item.cover_type || "",
        coverType: item.coverType || item.cover_type || item.modelName || item.model_name || "",
        color: item.color || "",
        woodType: item.woodType || item.wood_type || "",
        thicknessMm: Number(item.thicknessMm ?? item.thickness_mm ?? 0) || null,
        width: Number(item.widthMm ?? item.width_mm ?? item.width ?? 0),
        height: Number(item.heightMm ?? item.height_mm ?? item.height ?? 0),
        widthMm: Number(item.widthMm ?? item.width_mm ?? item.width ?? 0),
        heightMm: Number(item.heightMm ?? item.height_mm ?? item.height ?? 0),
        length: Number(item.length || 0),
        quantity: Number(item.quantity || 0),
        calculationType: normalizeProductCalculationType(item.calculationType || item.calculation_type || (isPieceUnit(item.unit) ? "piece" : "sqm")),
        calculatedQuantity: Number(item.calculatedQuantity ?? item.calculated_quantity ?? item.m2 ?? item.quantity ?? 0),
        m2: Number(item.m2 || 0),
        unit: item.unit || "M2",
        unitPrice: Number(item.unitPrice ?? item.unit_price ?? 0),
        total: Number(item.total || 0),
        variantSummary: item.variantSummary || item.variant_summary || "",
        note: item.note || "",
      }))
      : (Array.isArray(meta.rows) ? meta.rows : []);
    meta.rows = items;
    const status = normalizeOfferStatusKey(row.status);
    return {
      id: row.id,
      offerId: row.id,
      offerNo: row.offer_no,
      orderNo: row.offer_no,
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
      contractText: meta.notes || "",
      meta,
      items,
      status,
      statusConfig: row.status_config || OFFER_STATUSES[status],
      allowedNextStatuses: Array.isArray(row.allowed_next_statuses) ? row.allowed_next_statuses : [],
      statusNote: row.status_note || "",
      revisionNo: Number(row.revision_no || 0),
      originalOfferId: row.original_offer_id || row.originalOfferId || null,
      previousRevisionId: row.previous_revision_id || row.previousRevisionId || null,
      convertedOrderId: row.converted_order_id,
      createdAt: row.created_at,
    };
  });
}

function normalizeOrders(rows) {
  return (rows || []).map((row) => {
    const normalizedOrderItems = Array.isArray(row.order_items) && row.order_items.length
      ? row.order_items.map((item) => ({
        id: item.id,
        orderId: item.orderId || item.order_id || row.id,
        productId: item.productId || item.product_id || null,
        variantId: item.variantId || item.variant_id || null,
        productName: item.productName || item.product_name || item.modelName || item.model_name || "",
        materialGroup: item.materialGroup || item.material_group || "",
        materialType: item.materialType || item.material_type || item.coverType || item.cover_type || "",
        coatingType: item.coatingType || item.coating_type || "",
        color: item.color || "",
        woodType: item.woodType || item.wood_type || "",
        thicknessMm: Number(item.thicknessMm ?? item.thickness_mm ?? 0) || null,
        width: Number(item.widthMm ?? item.width_mm ?? item.width ?? 0),
        height: Number(item.heightMm ?? item.height_mm ?? item.height ?? 0),
        widthMm: Number(item.widthMm ?? item.width_mm ?? item.width ?? 0),
        heightMm: Number(item.heightMm ?? item.height_mm ?? item.height ?? 0),
        length: Number(item.length || 0),
        quantity: Number(item.quantity || 0),
        calculationType: item.calculationType || item.calculation_type || "m2",
        calculatedQuantity: Number(item.calculatedQuantity ?? item.calculated_quantity ?? item.m2 ?? 0),
        unit: item.unit || "M2",
        unitPrice: Number(item.unitPrice ?? item.unit_price ?? 0),
        total: Number(item.total || 0),
        variantSummary: item.variantSummary || item.variant_summary || "",
        edgeBand: item.edgeBand || item.edge_band || "",
        cncNote: item.cncNote || item.cnc_note || "",
        productionNote: item.productionNote || item.production_note || item.note || "",
        modelName: item.modelName || item.model_name || item.productName || item.product_name || item.coverType || item.cover_type || "",
        coverType: item.coverType || item.cover_type || item.materialType || item.material_type || "",
        m2: Number(item.m2 ?? item.calculatedQuantity ?? item.calculated_quantity ?? 0),
        note: item.note || item.productionNote || item.production_note || "",
        productCategory: item.productCategory || item.product_category || "",
        createdAt: item.createdAt || item.created_at || row.created_at,
      }))
      : (Array.isArray(row.items) ? row.items : []);

    const normalizedCutListItems = Array.isArray(row.cut_list_items)
      ? row.cut_list_items.map((item) => ({
        id: item.id,
        orderId: item.orderId || item.order_id || row.id,
        orderItemId: item.orderItemId || item.order_item_id || null,
        lineNo: Number(item.lineNo || item.line_no || 0),
        partName: item.partName || item.part_name || "",
        materialType: item.materialType || item.material_type || "",
        color: item.color || "",
        width: Number(item.widthMm ?? item.width_mm ?? item.width ?? 0),
        height: Number(item.heightMm ?? item.height_mm ?? item.height ?? 0),
        widthMm: Number(item.widthMm ?? item.width_mm ?? item.width ?? 0),
        heightMm: Number(item.heightMm ?? item.height_mm ?? item.height ?? 0),
        quantity: Number(item.quantity || 0),
        netM2: Number(item.netM2 ?? item.net_m2 ?? 0),
        wasteRate: Number(item.wasteRate ?? item.waste_rate ?? 0),
        grossM2: Number(item.grossM2 ?? item.gross_m2 ?? 0),
        edgeBand: item.edgeBand || item.edge_band || "",
        cncNote: item.cncNote || item.cnc_note || "",
        productionNote: item.productionNote || item.production_note || "",
        createdAt: item.createdAt || item.created_at || row.created_at,
      }))
      : [];

    const normalizedWorkOrderStages = Array.isArray(row.work_order_stages)
      ? row.work_order_stages.map((stage) => ({
        id: stage.id,
        workOrderId: stage.workOrderId || stage.work_order_id || null,
        stageKey: stage.stageKey || stage.stage_key || "",
        stageName: stage.stageName || stage.stage_name || "",
        status: stage.status || "pending",
        sortOrder: Number(stage.sortOrder || stage.sort_order || 0),
        assignedTo: stage.assignedTo || stage.assigned_to || "",
        startedAt: stage.startedAt || stage.started_at || "",
        completedAt: stage.completedAt || stage.completed_at || "",
        note: stage.note || "",
      }))
      : [];

    const normalizedWorkOrder = row.work_order
      ? {
        id: row.work_order.id,
        orderId: row.work_order.orderId || row.work_order.order_id || row.id,
        workOrderNo: row.work_order.workOrderNo || row.work_order.work_order_no || "",
        status: row.work_order.status || "planned",
        priority: row.work_order.priority || "normal",
        assignedTo: row.work_order.assignedTo || row.work_order.assigned_to || "",
        plannedStartDate: row.work_order.plannedStartDate || row.work_order.planned_start_date || "",
        plannedFinishDate: row.work_order.plannedFinishDate || row.work_order.planned_finish_date || "",
        actualStartDate: row.work_order.actualStartDate || row.work_order.actual_start_date || "",
        actualFinishDate: row.work_order.actualFinishDate || row.work_order.actual_finish_date || "",
        note: row.work_order.note || "",
        stages: Array.isArray(row.work_order.stages)
          ? row.work_order.stages.map((stage) => ({
            id: stage.id,
            workOrderId: stage.workOrderId || stage.work_order_id || row.work_order.id,
            stageKey: stage.stageKey || stage.stage_key || "",
            stageName: stage.stageName || stage.stage_name || "",
            status: stage.status || "pending",
            sortOrder: Number(stage.sortOrder || stage.sort_order || 0),
            assignedTo: stage.assignedTo || stage.assigned_to || "",
            startedAt: stage.startedAt || stage.started_at || "",
            completedAt: stage.completedAt || stage.completed_at || "",
            note: stage.note || "",
          }))
          : normalizedWorkOrderStages,
      }
      : null;

    const normalizedStockReservations = Array.isArray(row.stock_reservations)
      ? row.stock_reservations.map((item) => ({
        id: item.id,
        orderId: item.orderId || item.order_id || row.id,
        workOrderId: item.workOrderId || item.work_order_id || null,
        orderItemId: item.orderItemId || item.order_item_id || null,
        cutListItemId: item.cutListItemId || item.cut_list_item_id || null,
        stockItemId: item.stockItemId || item.stock_item_id || null,
        stockItemName: item.stockItemName || item.stock_item_name || "",
        stockItemCode: item.stockItemCode || item.stock_item_code || "",
        materialType: item.materialType || item.material_type || "",
        color: item.color || "",
        reservedQuantity: Number(item.reservedQuantity ?? item.reserved_quantity ?? 0),
        unit: item.unit || "M2",
        status: item.status || "reserved",
        note: item.note || "",
        createdAt: item.createdAt || item.created_at || "",
      }))
      : [];

    const normalizedAccountMovements = Array.isArray(row.account_movements)
      ? row.account_movements.map((item) => ({
        id: item.id,
        orderId: item.orderId || item.order_id || row.id,
        cariId: item.cariId || item.cari_id || null,
        movementType: item.movementType || item.movement_type || "",
        amount: Number(item.amount || 0),
        movementDate: item.movementDate || item.movement_date || "",
        note: item.note || "",
        createdAt: item.createdAt || item.created_at || "",
      }))
      : [];

    const normalizedFinanceEntries = Array.isArray(row.finance_entries)
      ? row.finance_entries.map((item) => ({
        id: item.id,
        orderId: item.orderId || item.order_id || row.id,
        type: item.type || "",
        title: item.title || "",
        amount: Number(item.amount || 0),
        createdAt: item.createdAt || item.created_at || "",
      }))
      : [];

    const normalizedPanjurJob = row.panjur_job
      ? {
        id: row.panjur_job.id,
        orderId: row.panjur_job.orderId || row.panjur_job.order_id || row.id,
        jobNo: row.panjur_job.jobNo || row.panjur_job.job_no || "",
        customerName: row.panjur_job.customerName || row.panjur_job.customer_name || row.company_name || row.full_name || "",
        orderNo: row.panjur_job.orderNo || row.panjur_job.order_no || row.order_no || row.tracking_no || "",
        orderDate: row.panjur_job.orderDate || row.panjur_job.order_date || "",
        deliveryDate: row.panjur_job.deliveryDate || row.panjur_job.delivery_date || "",
        materialType: row.panjur_job.materialType || row.panjur_job.material_type || "",
        coverType: row.panjur_job.coverType || row.panjur_job.cover_type || "",
        coverThickness: Number(row.panjur_job.coverThickness || row.panjur_job.cover_thickness || 0),
        slatThickness: Number(row.panjur_job.slatThickness || row.panjur_job.slat_thickness || 0),
        totalQuantity: Number(row.panjur_job.totalQuantity || row.panjur_job.total_quantity || 0),
        totalM2: Number(row.panjur_job.totalM2 || row.panjur_job.total_m2 || 0),
        status: row.panjur_job.status || "draft",
        note: row.panjur_job.note || "",
        createdAt: row.panjur_job.createdAt || row.panjur_job.created_at || "",
      }
      : null;

    return {
      id: row.id,
      offerId: row.offer_id,
      cariId: row.cari_id || null,
      sourceType: row.source_type || (row.offer_id ? "offer" : "direct"),
      orderNo: row.order_no || row.tracking_no || "",
      trackingNo: row.tracking_no || row.order_no || "",
      offerNo: row.offer_no,
      cariName: row.company_name || row.full_name || "-",
      orderDate: row.order_date,
      deliveryDate: row.delivery_date,
      termDays: Number(row.term_days || 0),
      netTotal: Number(row.net_total || 0),
      status: normalizeOrderStatus(row.status),
      items: normalizedOrderItems,
      orderItems: normalizedOrderItems,
      cutListItems: normalizedCutListItems,
      stockReservations: normalizedStockReservations,
      accountMovements: normalizedAccountMovements,
      accountMovement: normalizedAccountMovements[0] || null,
      financeEntries: normalizedFinanceEntries,
      workOrder: normalizedWorkOrder,
      workOrderStages: normalizedWorkOrder?.stages || normalizedWorkOrderStages,
      panjurJob: normalizedPanjurJob,
      panjurEligibleItems: Array.isArray(row.panjur_eligible_items) ? row.panjur_eligible_items.map((item) => ({
        id: item.id,
        productId: item.productId || item.product_id || null,
        variantId: item.variantId || item.variant_id || null,
        variantName: item.variantName || item.variant_name || "",
        productName: item.productName || item.product_name || "",
        widthMm: Number(item.widthMm || item.width_mm || 0),
        heightMm: Number(item.heightMm || item.height_mm || 0),
        quantity: Number(item.quantity || 0),
        materialType: item.materialType || item.material_type || "",
        coatingType: item.coatingType || item.coating_type || "",
        thicknessMm: Number(item.thicknessMm || item.thickness_mm || 0),
        color: item.color || "",
        woodType: item.woodType || item.wood_type || "",
        note: item.note || "",
      })) : [],
      panjurEligibleItemCount: Number(row.panjur_eligible_item_count || 0),
      statusHistory: Array.isArray(row.status_history) ? row.status_history.map((item) => ({
        id: item.id,
        orderId: item.orderId || item.order_id || row.id,
        fromStatus: item.fromStatus || item.from_status || "",
        toStatus: item.toStatus || item.to_status || "",
        note: item.note || "",
        createdAt: item.createdAt || item.created_at || "",
      })) : [],
      allowedStatuses: Array.isArray(row.allowed_statuses) ? row.allowed_statuses : ORDER_STATUSES,
      createdAt: row.created_at,
    };
  });
}

function normalizeWorkOrders(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    orderId: row.order_id,
    workOrderNo: row.work_order_no || row.workOrderNo || "",
    trackingNo: row.tracking_no || row.trackingNo || "",
    offerNo: row.offer_no || row.offerNo || "",
    cariName: row.company_name || row.full_name || row.cariName || "-",
    status: row.status || "planned",
    priority: row.priority || "normal",
    assignedTo: row.assigned_to || row.assignedTo || "",
    plannedStartDate: row.planned_start_date || row.plannedStartDate || "",
    plannedFinishDate: row.planned_finish_date || row.plannedFinishDate || "",
    actualStartDate: row.actual_start_date || row.actualStartDate || "",
    actualFinishDate: row.actual_finish_date || row.actualFinishDate || "",
    note: row.note || "",
    stages: Array.isArray(row.stages) ? row.stages.map((stage) => ({
      id: stage.id,
      workOrderId: stage.work_order_id || stage.workOrderId || row.id,
      stageKey: stage.stage_key || stage.stageKey || "",
      stageName: stage.stage_name || stage.stageName || "",
      status: stage.status || "pending",
      sortOrder: Number(stage.sort_order || stage.sortOrder || 0),
      assignedTo: stage.assigned_to || stage.assignedTo || "",
      startedAt: stage.started_at || stage.startedAt || "",
      completedAt: stage.completed_at || stage.completedAt || "",
      note: stage.note || "",
    })) : [],
    createdAt: row.created_at || row.createdAt,
  }));
}

function normalizePanjurJobs(rows) {
  return (rows || []).map((row) => ({
    id: row.id,
    orderId: row.orderId || row.order_id || null,
    jobNo: row.jobNo || row.job_no || "",
    customerName: row.customerName || row.customer_name || row.company_name || row.full_name || "",
    orderNo: row.orderNo || row.order_no || row.tracking_no || "",
    orderDate: row.orderDate || row.order_date || "",
    deliveryDate: row.deliveryDate || row.delivery_date || "",
    materialType: row.materialType || row.material_type || "",
    coverType: row.coverType || row.cover_type || "",
    coverThickness: Number(row.coverThickness || row.cover_thickness || 0),
    slatThickness: Number(row.slatThickness || row.slat_thickness || 0),
    frameType: row.frameType || row.frame_type || "",
    cargoType: row.cargoType || row.cargo_type || "",
    totalQuantity: Number(row.totalQuantity || row.total_quantity || 0),
    totalM2: Number(row.totalM2 || row.total_m2 || 0),
    status: row.status || "draft",
    note: row.note || "",
    items: Array.isArray(row.items) ? row.items.map((item) => ({
      id: item.id,
      widthMm: Number(item.widthMm || item.width_mm || 0),
      heightMm: Number(item.heightMm || item.height_mm || 0),
      quantity: Number(item.quantity || 0),
      materialType: item.materialType || item.material_type || "",
      color: item.color || "",
      hasMiddleRail: Boolean(item.hasMiddleRail || item.has_middle_rail),
      middleRailPositionMm: Number(item.middleRailPositionMm || item.middle_rail_position_mm || 0),
      hingeType: item.hingeType || item.hinge_type || "",
      drillNote: item.drillNote || item.drill_note || "",
      productionNote: item.productionNote || item.production_note || "",
      m2: Number(item.m2 || 0),
    })) : [],
    cuts: Array.isArray(row.cuts) ? row.cuts.map((item) => ({
      id: item.id,
      itemId: item.itemId || item.item_id || null,
      cutType: item.cutType || item.cut_type || "",
      partName: item.partName || item.part_name || "",
      widthMm: Number(item.widthMm || item.width_mm || 0),
      heightMm: Number(item.heightMm || item.height_mm || 0),
      lengthMm: Number(item.lengthMm || item.length_mm || 0),
      quantity: Number(item.quantity || 0),
      materialType: item.materialType || item.material_type || "",
      note: item.note || "",
    })) : [],
    createdAt: row.createdAt || row.created_at || "",
    updatedAt: row.updatedAt || row.updated_at || "",
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
    costType: row.cost_type || row.unit || (Number(row.m2_price || 0) > 0 ? "M2" : "Adet"),
    costAmount: Number(row.cost_amount || row.m2_price || row.sale_price || 0),
    unit: row.unit || row.cost_type || "M2",
    calculationType: normalizeProductCalculationType(row.calculation_type),
    defaultWasteRate: Number(row.default_waste_rate || 0),
    materialType: row.material_type || "",
    thickness: row.thickness === null || row.thickness === undefined ? null : Number(row.thickness || 0),
    edgeBandDefault: row.edge_band_default || "",
    stockItemId: row.stock_item_id === null || row.stock_item_id === undefined ? null : Number(row.stock_item_id),
    hasVariants: Boolean(row.has_variants ?? row.hasVariants ?? ((row.variants || []).length > 0)),
    isActive: row.is_active === undefined ? true : Boolean(row.is_active),
    productionType: row.production_type || "standard",
    imageUrl: row.image_url || "",
    costNotes: row.cost_notes,
    variants: Array.isArray(row.variants) ? row.variants.map((variant, index) => normalizeProductVariantDraft(variant, index)) : [],
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
  const prefix = `SLV-TKF-${year}-`;
  const next = ((cache.offers || []).reduce((max, item) => {
    const offerNo = String(item.offerNo || "").trim();
    if (!offerNo.startsWith(prefix)) return max;
    const match = offerNo.match(/(\d+)\s*$/);
    const value = match ? Number(match[1]) : 0;
    return Math.max(max, value);
  }, 0) + 1).toString().padStart(4, "0");
  return `${prefix}${next}`;
}

function generateManualOfferNo() {
  const now = new Date();
  const year = now.getFullYear();
  const prefix = `MNL-TKF-${year}-`;
  const next = ((cache.offers || []).reduce((max, item) => {
    const offerNo = String(item.offerNo || "").trim();
    if (!offerNo.startsWith(prefix)) return max;
    const match = offerNo.match(/(\d+)\s*$/);
    const value = match ? Number(match[1]) : 0;
    return Math.max(max, value);
  }, 0) + 1).toString().padStart(4, "0");
  return `${prefix}${next}`;
}

function normalizeOrderStatus(status = "") {
  const value = String(status || "").trim();
  const legacyMap = new Map([
    ["Onayli", "Onaylandi"],
    ["Onaylı", "Onaylandi"],
    ["Uretim", "Uretimde"],
    ["Üretim", "Uretimde"],
    ["Tamamlandı", "Tamamlandi"],
    ["İptal", "Iptal"],
  ]);
  const mapped = legacyMap.get(value) || value;
  return ORDER_STATUSES.includes(mapped) ? mapped : "Yeni";
}

function getStatusClassName(status = "") {
  return String(status || "Yeni")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeStatus(status) {
  const rawStatus = String(status || "").trim();
  const knownOfferStatus = OFFER_STATUSES[rawStatus]
    || ["taslak", "gonderildi", "gönderildi", "beklemede", "revize", "onaylandi", "onaylandı", "reddedildi", "suresi gecti", "süresi geçti", "siparise donustu", "siparişe dönüştü", "iptal"].includes(rawStatus.toLocaleLowerCase("tr-TR"));
  if (knownOfferStatus) {
    const offerStatusKey = normalizeOfferStatusKey(status);
    if (offerStatusKey === "converted" || offerStatusKey === "approved") return "Onayli";
    if (["draft", "sent", "pending", "revised"].includes(offerStatusKey)) return "Yeni";
    if (["cancelled", "rejected", "expired"].includes(offerStatusKey)) return "Iptal";
  }
  if (status === "Onaylandı") return "Onayli";
  if (status === "Siparişe Dönüştü") return "Onayli";
  if (status === "Beklemede") return "Yeni";
  if (status === "Taslak") return "Yeni";
  if (status === "İptal") return "Iptal";
  return status || "Yeni";
}

function formatCurrencyLegacy(value) {
    return `${Number(value || 0).toLocaleString("tr-TR")} TL`;
  }

function formatCompactCurrencyLegacy(value) {
    return `${Number(value || 0).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} TL`;
  }

  function formatDateLegacy(value) {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? escapeHtml(String(value)) : date.toLocaleDateString("tr-TR");
  }

function shortenTextLegacy(value, limit = 20) {
    const text = String(value || "");
    if (text.length <= limit) return text;
    return `${text.slice(0, Math.max(0, limit - 3))}...`;
  }

function escapeHtmlLegacy(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
