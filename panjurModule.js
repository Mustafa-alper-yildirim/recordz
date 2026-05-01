(function () {
  const calculations = window.PanjurCalculations;
  const api = window.silvaApi;

  const state = {
    bridge: null,
    refs: null,
    bound: false,
    templatesLoaded: false,
    templatesLoading: false,
    cncTemplatesLoaded: false,
    cncTemplatesLoading: false,
    templates: [],
    cncTemplates: [],
    jobs: [],
    items: [],
    currentTab: "items",
    currentPanel: "overview",
    selectedItemIndex: -1,
    itemCardTabs: {},
    calculation: null,
    activeJobId: null,
    activeCncJob: null,
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function getRefs() {
    if (state.refs) return state.refs;
    state.refs = {
      root: qs("panjurTemplateRoot"),
      editId: qs("panjurTplEditId"),
      orderId: qs("panjurTplOrderId"),
      orderNo: qs("panjurTplOrderNo"),
      orderDate: qs("panjurTplOrderDate"),
      deliveryDate: qs("panjurTplDeliveryDate"),
      customerName: qs("panjurTplCustomerName"),
      status: qs("panjurTplStatus"),
      note: qs("panjurTplNote"),
      templateId: qs("panjurTplTemplateId"),
      templateName: qs("panjurTplTemplateName"),
      coverType: qs("panjurTplCoverType"),
      coverThickness: qs("panjurTplCoverThickness"),
      slatThickness: qs("panjurTplSlatThickness"),
      coverDirection: qs("panjurTplCoverDirection"),
      materialType: qs("panjurTplMaterialType"),
      finishType: qs("panjurTplFinishType"),
      calculationNote: qs("panjurTplCalculationNote"),
      leftSideStileWidth: qs("panjurTplLeftSideStileWidth"),
      rightSideStileWidth: qs("panjurTplRightSideStileWidth"),
      leftGap: qs("panjurTplLeftGap"),
      rightGap: qs("panjurTplRightGap"),
      topGap: qs("panjurTplTopGap"),
      bottomGap: qs("panjurTplBottomGap"),
      sideStileHeightMode: qs("panjurTplSideStileHeightMode"),
      manualSideStileLength: qs("panjurTplManualSideStileLength"),
      middleRailEnabled: qs("panjurTplMiddleRailEnabled"),
      middleRailCount: qs("panjurTplMiddleRailCount"),
      middleRailPositionType: qs("panjurTplMiddleRailPositionType"),
      middleRailSize: qs("panjurTplMiddleRailSize"),
      middleRailTopOffset: qs("panjurTplMiddleRailTopOffset"),
      middleRailBottomOffset: qs("panjurTplMiddleRailBottomOffset"),
      itemEditIndex: qs("panjurTplItemEditIndex"),
      itemName: qs("panjurTplItemName"),
      itemWidth: qs("panjurTplItemWidth"),
      itemHeight: qs("panjurTplItemHeight"),
      itemQuantity: qs("panjurTplItemQuantity"),
      itemHasMiddleRail: qs("panjurTplItemHasMiddleRail"),
      itemMiddleRailCount: qs("panjurTplItemMiddleRailCount"),
      itemMiddleRailSize: qs("panjurTplItemMiddleRailSize"),
      itemMiddleRailPositionType: qs("panjurTplItemMiddleRailPositionType"),
      itemMiddleRailPositionValue: qs("panjurTplItemMiddleRailPositionValue"),
      itemNote: qs("panjurTplItemNote"),
      summaryCards: qs("panjurTplSummaryCards"),
      preview: qs("panjurTplPreview"),
      itemsTable: qs("panjurTplItemsTable"),
      itemCards: qs("panjurTplItemCards"),
      tabContent: qs("panjurTplTabContent"),
      jobsTable: qs("panjurTplJobsTable"),
      panelButtons: [...document.querySelectorAll("[data-panjur-panel]")],
      tabs: [...document.querySelectorAll("[data-panjur-template-tab]")],
      headerOrderDate: qs("panjurTplHeaderOrderDate"),
      headerDeliveryDate: qs("panjurTplHeaderDeliveryDate"),
      headerTotalQty: qs("panjurTplHeaderTotalQty"),
      headerTotalM2: qs("panjurTplHeaderTotalM2"),
      headerStatus: qs("panjurTplHeaderStatus"),
      headerProjectNo: qs("panjurTplHeaderProjectNo"),
      previewLabel: qs("panjurTplPreviewLabel"),
      resetBtn: qs("panjurTplResetBtn"),
      saveBtnSecondary: qs("panjurTplSaveBtnSecondary"),
      saveAsBtn: qs("panjurTplSaveAsBtn"),
      quickAddBtn: qs("panjurTplQuickAddBtn"),
      menuBtn: qs("panjurTplMenuBtn"),
      calculateBtn: qs("panjurTplCalculateBtn"),
      generateCutsBtn: qs("panjurTplGenerateCutsBtn"),
      saveBtn: qs("panjurTplSaveBtn"),
      loadOrderItemsBtn: qs("panjurTplLoadOrderItemsBtn"),
      clearItemBtn: qs("panjurTplClearItemBtn"),
      copySelectedBtn: qs("panjurTplCopySelectedBtn"),
      deleteSelectedBtn: qs("panjurTplDeleteSelectedBtn"),
      templateLibraryBtn: qs("panjurTplTemplateLibraryBtn"),
      addItemBtn: qs("panjurTplAddItemBtn"),
      preview3dBtn: qs("panjurTpl3dBtn"),
      pdfBtn: qs("panjurTplPdfBtn"),
      excelBtn: qs("panjurTplExcelBtn"),
      printBtn: qs("panjurTplPrintBtn"),
      prevItemBtn: qs("panjurTplPrevItemBtn"),
      nextItemBtn: qs("panjurTplNextItemBtn"),
      templateSaveBtn: qs("panjurTplTemplateSaveBtn"),
      templateDeleteBtn: qs("panjurTplTemplateDeleteBtn"),
    };
    return state.refs;
  }

  function escapeHtml(value) {
    const text = String(value ?? "");
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatNumber(value, digits = 2) {
    return Number(value || 0).toLocaleString("tr-TR", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
  }

  function sumQuantities(rows = []) {
    return rows.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
  }

  function normalizeSelectedItemIndex() {
    if (!state.items.length) return -1;
    if (state.selectedItemIndex < 0 || state.selectedItemIndex >= state.items.length) return 0;
    return state.selectedItemIndex;
  }

  function getSelectedItem() {
    const index = normalizeSelectedItemIndex();
    return index >= 0 ? state.items[index] : null;
  }

  function setSelectedItem(index) {
    if (!state.items.length) {
      state.selectedItemIndex = -1;
      return;
    }
    state.selectedItemIndex = Math.max(0, Math.min(Number(index || 0), state.items.length - 1));
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function formatDateLabel(value) {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString("tr-TR");
  }

  function getOrders() {
    return typeof state.bridge?.getOrders === "function" ? (state.bridge.getOrders() || []) : [];
  }

  function getJobs() {
    return typeof state.bridge?.getPanjurJobs === "function" ? (state.bridge.getPanjurJobs() || []) : [];
  }

  function getSelectedOrder() {
    const refs = getRefs();
    return getOrders().find((order) => Number(order.id) === Number(refs.orderId?.value || 0)) || null;
  }

  function buildTemplatePayload() {
    const refs = getRefs();
    return {
      template_name: refs.templateName?.value?.trim() || "Yeni Panjur Sablonu",
      material_type: refs.materialType?.value?.trim() || "MDF",
      cover_thickness: Number(refs.coverThickness?.value || 18),
      slat_thickness: Number(refs.slatThickness?.value || 8),
      left_side_stile_width: Number(refs.leftSideStileWidth?.value || 70),
      right_side_stile_width: Number(refs.rightSideStileWidth?.value || 70),
      top_gap: Number(refs.topGap?.value || 0),
      bottom_gap: Number(refs.bottomGap?.value || 0),
      left_gap: Number(refs.leftGap?.value || 0),
      right_gap: Number(refs.rightGap?.value || 0),
      default_middle_rail_enabled: Boolean(refs.middleRailEnabled?.checked),
      default_middle_rail_count: Number(refs.middleRailCount?.value || 0),
      default_middle_rail_size: Number(refs.middleRailSize?.value || 70),
      calculation_note: refs.calculationNote?.value?.trim() || "",
    };
  }

  function buildPayload() {
    const refs = getRefs();
    const primaryItem = state.items[0] || {};
    return {
      order_id: refs.orderId?.value ? Number(refs.orderId.value) : null,
      order_item_id: primaryItem.order_item_id ?? primaryItem.orderItemId ?? null,
      product_id: primaryItem.product_id ?? primaryItem.productId ?? null,
      variant_id: primaryItem.variant_id ?? primaryItem.variantId ?? null,
      template_id: refs.templateId?.value ? Number(refs.templateId.value) : null,
      customer_name: refs.customerName?.value?.trim() || "",
      order_no: refs.orderNo?.value?.trim() || "",
      order_date: refs.orderDate?.value || today(),
      delivery_date: refs.deliveryDate?.value || "",
      material_type: refs.materialType?.value?.trim() || "MDF",
      cover_type: refs.coverType?.value?.trim() || "Panjur Kapak",
      cover_thickness: Number(refs.coverThickness?.value || 18),
      slat_thickness: Number(refs.slatThickness?.value || 8),
      cover_direction: refs.coverDirection?.value || "vertical",
      finish_type: refs.finishType?.value || "lake",
      left_side_stile_width: Number(refs.leftSideStileWidth?.value || 70),
      right_side_stile_width: Number(refs.rightSideStileWidth?.value || 70),
      left_gap: Number(refs.leftGap?.value || 0),
      right_gap: Number(refs.rightGap?.value || 0),
      top_gap: Number(refs.topGap?.value || 0),
      bottom_gap: Number(refs.bottomGap?.value || 0),
      side_stile_height_mode: refs.sideStileHeightMode?.value || "equal",
      manual_side_stile_length: Number(refs.manualSideStileLength?.value || 0),
      middle_rail_enabled: Boolean(refs.middleRailEnabled?.checked),
      middle_rail_count: Number(refs.middleRailCount?.value || 0),
      middle_rail_size: Number(refs.middleRailSize?.value || 70),
      middle_rail_position_type: refs.middleRailPositionType?.value || "center",
      middle_rail_top_offset: Number(refs.middleRailTopOffset?.value || 0),
      middle_rail_bottom_offset: Number(refs.middleRailBottomOffset?.value || 0),
      status: refs.status?.value || "draft",
      note: refs.note?.value?.trim() || "",
      items: state.items.map((item) => ({
        order_item_id: item.order_item_id ?? item.orderItemId ?? null,
        product_id: item.product_id ?? item.productId ?? null,
        variant_id: item.variant_id ?? item.variantId ?? null,
        product_name: item.product_name || item.productName || item.item_name || item.itemName || "",
        item_name: item.item_name || item.itemName || "",
        width_mm: Number(item.width_mm ?? item.widthMm ?? 0),
        height_mm: Number(item.height_mm ?? item.heightMm ?? 0),
        quantity: Number(item.quantity || 1),
        coating_type: item.coating_type || item.coatingType || refs.finishType?.value || "",
        thickness_mm: Number(item.thickness_mm ?? item.thicknessMm ?? refs.coverThickness?.value ?? 18),
        color: item.color || "",
        wood_type: item.wood_type || item.woodType || "",
        variant_summary: item.variant_summary || item.variantSummary || "",
        has_middle_rail: Boolean(item.has_middle_rail ?? item.hasMiddleRail),
        middle_rail_count: Number(item.middle_rail_count ?? item.middleRailCount ?? 0),
        middle_rail_size: Number(item.middle_rail_size ?? item.middleRailSize ?? 0),
        middle_rail_position_type: item.middle_rail_position_type ?? item.middleRailPositionType ?? "center",
        middle_rail_position_value: Number(item.middle_rail_position_value ?? item.middleRailPositionValue ?? 0),
        note: item.note || "",
        material_type: refs.materialType?.value?.trim() || "MDF",
      })),
    };
  }

  function resetItemEditor() {
    const refs = getRefs();
    refs.itemEditIndex.value = "";
    refs.itemName.value = "";
    refs.itemWidth.value = "";
    refs.itemHeight.value = "";
    refs.itemQuantity.value = "1";
    refs.itemHasMiddleRail.checked = Boolean(refs.middleRailEnabled?.checked);
    refs.itemMiddleRailCount.value = refs.middleRailCount?.value || "1";
    refs.itemMiddleRailSize.value = refs.middleRailSize?.value || "70";
    refs.itemMiddleRailPositionType.value = refs.middleRailPositionType?.value || "center";
    refs.itemMiddleRailPositionValue.value = "0";
    refs.itemNote.value = "";
    refs.addItemBtn.textContent = "Olcuyu Kaydet";
  }

  function resetForm() {
    const refs = getRefs();
    refs.editId.value = "";
    refs.orderId.value = "";
    refs.orderNo.value = "";
    refs.orderDate.value = today();
    refs.deliveryDate.value = "";
    refs.customerName.value = "";
    refs.status.value = "draft";
    refs.note.value = "";
    refs.templateId.value = "";
    refs.templateName.value = "";
    refs.coverType.value = "Panjur Kapak";
    refs.coverThickness.value = "18";
    refs.slatThickness.value = "8";
    refs.coverDirection.value = "vertical";
    refs.materialType.value = "MDF";
    refs.finishType.value = "lake";
    refs.calculationNote.value = "";
    refs.leftSideStileWidth.value = "70";
    refs.rightSideStileWidth.value = "70";
    refs.leftGap.value = "0";
    refs.rightGap.value = "0";
    refs.topGap.value = "0";
    refs.bottomGap.value = "0";
    refs.sideStileHeightMode.value = "equal";
    refs.manualSideStileLength.value = "0";
    refs.middleRailEnabled.checked = false;
    refs.middleRailCount.value = "1";
    refs.middleRailPositionType.value = "center";
    refs.middleRailSize.value = "70";
    refs.middleRailTopOffset.value = "0";
    refs.middleRailBottomOffset.value = "0";
    state.items = [];
    state.calculation = null;
    state.activeJobId = null;
    state.activeCncJob = null;
    state.selectedItemIndex = -1;
    state.itemCardTabs = {};
    state.currentTab = "items";
    state.currentPanel = "overview";
    resetItemEditor();
    renderAll();
  }

  function applyOrderInfo() {
    const refs = getRefs();
    const order = getSelectedOrder();
    if (!order) return;
    refs.orderNo.value = order.orderNo || order.trackingNo || refs.orderNo.value;
    refs.orderDate.value = order.orderDate || refs.orderDate.value || today();
    refs.deliveryDate.value = order.deliveryDate || refs.deliveryDate.value;
    refs.customerName.value = order.cariName || order.customerName || refs.customerName.value;
    const sourceItem = Array.isArray(order.panjurEligibleItems) ? order.panjurEligibleItems[0] : null;
    if (sourceItem) {
      refs.materialType.value = sourceItem.materialType || refs.materialType.value || "MDF";
      refs.coverThickness.value = String(sourceItem.thicknessMm || refs.coverThickness.value || 18);
      refs.finishType.value = sourceItem.coatingType || refs.finishType.value || "lake";
      if (!state.items.length) {
        state.items = (order.panjurEligibleItems || []).map((item, index) => ({
          order_item_id: item.id || item.orderItemId || null,
          product_id: item.productId || null,
          variant_id: item.variantId || null,
          product_name: item.productName || "",
          item_name: item.variantName || item.productName || `Kapak ${index + 1}`,
          width_mm: Number(item.widthMm || 0),
          height_mm: Number(item.heightMm || 0),
          quantity: Math.max(1, Number(item.quantity || 1)),
          material_type: item.materialType || refs.materialType.value || "MDF",
          coating_type: item.coatingType || refs.finishType.value || "",
            thickness_mm: Number(item.thicknessMm || refs.coverThickness.value || 18),
            color: item.color || "",
            wood_type: item.woodType || "",
            variant_summary: item.variantSummary || item.variant_name || item.variantName || "",
            note: item.note || "",
            template_id: null,
            cover_direction: refs.coverDirection.value || "vertical",
            slat_thickness: Number(refs.slatThickness.value || 8),
            has_middle_rail: false,
            middle_rail_count: 0,
            middle_rail_size: 0,
            middle_rail_position_type: "center",
            middle_rail_position_value: 0,
            m2: calculations.calculateItemM2(item.widthMm || 0, item.heightMm || 0, item.quantity || 1),
          }));
        }
      }
      setSelectedItem(0);
      recalculate();
    }

  function applyTemplateToForm(template) {
    if (!template) return;
    const refs = getRefs();
    refs.templateId.value = template.id || "";
    refs.templateName.value = template.templateName || template.template_name || "";
    refs.materialType.value = template.materialType || template.material_type || "MDF";
    refs.coverThickness.value = String(template.coverThickness ?? template.cover_thickness ?? 18);
    refs.slatThickness.value = String(template.slatThickness ?? template.slat_thickness ?? 8);
    refs.leftSideStileWidth.value = String(template.leftSideStileWidth ?? template.left_side_stile_width ?? 70);
    refs.rightSideStileWidth.value = String(template.rightSideStileWidth ?? template.right_side_stile_width ?? 70);
    refs.topGap.value = String(template.topGap ?? template.top_gap ?? 0);
    refs.bottomGap.value = String(template.bottomGap ?? template.bottom_gap ?? 0);
    refs.leftGap.value = String(template.leftGap ?? template.left_gap ?? 0);
    refs.rightGap.value = String(template.rightGap ?? template.right_gap ?? 0);
    refs.middleRailEnabled.checked = Boolean(template.defaultMiddleRailEnabled ?? template.default_middle_rail_enabled);
    refs.middleRailCount.value = String(template.defaultMiddleRailCount ?? template.default_middle_rail_count ?? 0);
    refs.middleRailSize.value = String(template.defaultMiddleRailSize ?? template.default_middle_rail_size ?? 70);
    refs.calculationNote.value = template.calculationNote || template.calculation_note || "";
    resetItemEditor();
    recalculate();
  }

  function loadTemplates() {
    if (state.templatesLoading || state.templatesLoaded || !api?.panjur?.templates) return;
    state.templatesLoading = true;
    api.panjur.templates.list()
      .then((templates) => {
        state.templates = Array.isArray(templates) ? templates : [];
        state.templatesLoaded = true;
        renderTemplateOptions();
      })
      .catch((error) => {
        console.error("Panjur sablonlari yuklenemedi", error);
      })
      .finally(() => {
        state.templatesLoading = false;
      });
  }

  function renderTemplateOptions() {
    const refs = getRefs();
    if (!refs.templateId) return;
    const current = refs.templateId.value;
    refs.templateId.innerHTML = `<option value="">Sablon secin</option>${state.templates.map((template) => `
      <option value="${template.id}" ${String(template.id) === String(current) ? "selected" : ""}>${escapeHtml(template.templateName || template.template_name || `Sablon ${template.id}`)}</option>
    `).join("")}`;
  }

  function loadCncTemplates() {
    if (state.cncTemplatesLoading || state.cncTemplatesLoaded || !api?.panjur?.cnc?.templates) return;
    state.cncTemplatesLoading = true;
    api.panjur.cnc.templates.list()
      .then((templates) => {
        state.cncTemplates = Array.isArray(templates) ? templates : [];
        state.cncTemplatesLoaded = true;
        renderAll();
      })
      .catch((error) => {
        console.error("CNC sablonlari yuklenemedi", error);
      })
      .finally(() => {
        state.cncTemplatesLoading = false;
      });
  }

  function getCncDefaultForm() {
    const job = buildPayload();
    const sideStiles = state.calculation?.sideStiles || [];
    const firstLeft = sideStiles.find((item) => item.side === "Sol");
    const firstRight = sideStiles.find((item) => item.side === "Sag");
    const reference = firstLeft || firstRight || {};

    return {
      template_id: "",
      template_name: "",
      side_type: "both",
      stile_length_mm: Number(reference.length_mm || calculations.resolveSideStileLength(state.items[0]?.height_mm || 0, job) || 0),
      stile_width_mm: Number(job.left_side_stile_width || 70),
      stile_thickness_mm: Number(job.cover_thickness || 18),
      hole_diameter_mm: 8,
      first_hole_offset_mm: 80,
      last_hole_offset_mm: 80,
      hole_spacing_mm: 120,
      hole_count: 0,
      start_from: "top",
      drilling_axis: "vertical",
      note: "",
    };
  }

  function getActiveCncDraft() {
    const cncJob = state.activeCncJob;
    if (cncJob) {
      return {
        template_id: cncJob.templateId || cncJob.template_id || "",
        side_type: cncJob.sideType || cncJob.side_type || "both",
        stile_length_mm: Number(cncJob.stileLengthMm ?? cncJob.stile_length_mm ?? 0),
        stile_width_mm: Number(cncJob.stileWidthMm ?? cncJob.stile_width_mm ?? 70),
        stile_thickness_mm: Number(cncJob.stileThicknessMm ?? cncJob.stile_thickness_mm ?? 18),
        hole_diameter_mm: Number(cncJob.holeDiameterMm ?? cncJob.hole_diameter_mm ?? 8),
        first_hole_offset_mm: Number(cncJob.firstHoleOffsetMm ?? cncJob.first_hole_offset_mm ?? 80),
        last_hole_offset_mm: Number(cncJob.lastHoleOffsetMm ?? cncJob.last_hole_offset_mm ?? 80),
        hole_spacing_mm: Number(cncJob.holeSpacingMm ?? cncJob.hole_spacing_mm ?? 0),
        hole_count: Number(cncJob.holeCount ?? cncJob.hole_count ?? 0),
        start_from: cncJob.startFrom || cncJob.start_from || "top",
        drilling_axis: cncJob.drillingAxis || cncJob.drilling_axis || "vertical",
        note: cncJob.note || "",
      };
    }
    return getCncDefaultForm();
  }

  function renderOrderOptions() {
    const refs = getRefs();
    if (!refs.orderId) return;
    const current = refs.orderId.value;
    refs.orderId.innerHTML = `<option value="">Siparis secin</option>${getOrders().map((order) => `
      <option value="${order.id}" ${String(order.id) === String(current) ? "selected" : ""}>${escapeHtml(order.trackingNo || order.orderNo || `#${order.id}`)} - ${escapeHtml(order.cariName || order.customerName || "-")}</option>
    `).join("")}`;
  }

  function recalculate() {
    if (!calculations) return null;
    state.calculation = calculations.calculatePanjurJob(buildPayload());
    renderAll();
    return state.calculation;
  }

  function renderSummary() {
    const refs = getRefs();
    if (!refs.summaryCards) return;
    const summary = state.calculation?.summary || {
      total_quantity: state.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      total_m2: state.items.reduce((sum, item) => sum + Number(item.m2 || 0), 0),
    };
    const payload = buildPayload();
    const cutGroups = calculations?.groupCutItemsByType?.(state.calculation?.cutList || []) || {};
    const templateCount = new Set(state.items.map((item) => Number(item.template_id || item.templateId || 0)).filter(Boolean)).size;
    const sideStileTotal = sumQuantities(cutGroups.side_stile_left || []) + sumQuantities(cutGroups.side_stile_right || []);
    const middleRailTotal = sumQuantities(cutGroups.middle_rail || []);
    const slatAndCargoTotal = sumQuantities(cutGroups.slat || []) + sumQuantities(cutGroups.cargo || []);
    const cards = [
      ["Toplam Kapak Adedi", `${formatNumber(summary.total_quantity || 0)} ADET`],
      ["Toplam m2", `${formatNumber(summary.total_m2 || 0, 2)} m2`],
      ["Farkli Sablon", `${formatNumber(templateCount || 0)} ADET`],
      ["Yan Seren Toplam", `${formatNumber(sideStileTotal || 0)} ADET`],
      ["Ara Kayit Toplam", `${formatNumber(middleRailTotal || 0)} ADET`],
      ["Cita / Kargo Toplam", `${formatNumber(slatAndCargoTotal || 0)} ADET`],
      ["Kapak Cinsi", payload.cover_type || "-"],
    ];
    refs.summaryCards.innerHTML = cards.map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("");
  }

  function renderHeaderSummary() {
    const refs = getRefs();
    const summary = state.calculation?.summary || {
      total_quantity: state.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      total_m2: state.items.reduce((sum, item) => sum + Number(item.m2 || 0), 0),
    };
    const projectNo = state.activeJobId
      ? (state.jobs.find((job) => Number(job.id) === Number(state.activeJobId))?.jobNo || refs.orderNo?.value || `PK-${String(state.activeJobId).padStart(4, "0")}`)
      : (refs.orderNo?.value?.trim() || "PK-TASLAK");
    if (refs.headerOrderDate) refs.headerOrderDate.textContent = formatDateLabel(refs.orderDate?.value || "");
    if (refs.headerDeliveryDate) refs.headerDeliveryDate.textContent = formatDateLabel(refs.deliveryDate?.value || "");
    if (refs.headerTotalQty) refs.headerTotalQty.textContent = `${formatNumber(summary.total_quantity || 0)} ADET`;
    if (refs.headerTotalM2) refs.headerTotalM2.textContent = `${formatNumber(summary.total_m2 || 0, 2)} m2`;
    if (refs.headerStatus) refs.headerStatus.textContent = refs.status?.selectedOptions?.[0]?.textContent || "Taslak";
    if (refs.headerProjectNo) refs.headerProjectNo.textContent = projectNo;
  }

  function renderPreview() {
    const refs = getRefs();
    if (!refs.preview || !calculations) return;
    const selectedItem = getSelectedItem();
    const payload = buildPayload();
    const selectedCalculation = selectedItem
      ? calculations.calculatePanjurJob({
        ...payload,
        items: [{
          ...payload.items[0],
          ...selectedItem,
          width_mm: Number(selectedItem.width_mm ?? selectedItem.widthMm ?? 0),
          height_mm: Number(selectedItem.height_mm ?? selectedItem.heightMm ?? 0),
          quantity: Number(selectedItem.quantity || 1),
        }],
      })
      : (state.calculation || { items: [] });
    refs.preview.innerHTML = calculations.buildPreviewSvg(selectedCalculation);
    if (refs.previewLabel) {
      refs.previewLabel.textContent = `Secili Kapak: ${selectedItem?.item_name || selectedItem?.itemName || "-"}`;
    }
  }

  function renderItemsTable() {
    const refs = getRefs();
    if (!refs.itemsTable) return;
    if (!state.items.length) {
      refs.itemsTable.innerHTML = `<div class="order-detail-empty">Kapak olcusu eklenmedi.</div>`;
      return;
    }

    refs.itemsTable.innerHTML = buildItemsTableMarkup(true);
  }

  function buildItemsTableMarkup(includeActions = false) {
    if (!state.items.length) {
      return `<div class="order-detail-empty">Kapak olcusu eklenmedi.</div>`;
    }

    const actionColumn = includeActions ? "<th>Islemler</th>" : "";
    const actionCells = includeActions
      ? (index) => `
              <td class="panjur-template-row-actions">
                <button class="ghost-action compact-action panjur-icon-btn" data-panjur-item-action="edit" data-index="${index}" type="button">D</button>
                <button class="ghost-action compact-action danger-action panjur-icon-btn" data-panjur-item-action="delete" data-index="${index}" type="button">X</button>
              </td>
            `
      : () => "";

    return `
      <table class="orders-data-table erp-modern-table panjur-template-data-table">
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>Kapak Adi</th>
            <th>En (mm)</th>
            <th>Boy (mm)</th>
            <th>Adet</th>
            <th>Sablon</th>
            <th>Kapak Cinsi</th>
            <th>Kapak Kalinligi</th>
            <th>Cita / Kargo</th>
            ${actionColumn}
          </tr>
        </thead>
        <tbody>
          ${state.items.map((item, index) => `
            <tr class="${index === normalizeSelectedItemIndex() ? "is-selected" : ""}" data-panjur-item-row="${index}">
              <td><input type="checkbox" ${index === normalizeSelectedItemIndex() ? "checked" : ""} data-panjur-item-select="${index}"></td>
              <td>${index + 1}</td>
              <td><strong>${escapeHtml(item.item_name || item.itemName || `Kapak ${index + 1}`)}</strong><small>${formatNumber(item.m2 || calculations.calculateItemM2(item.width_mm || item.widthMm, item.height_mm || item.heightMm, item.quantity), 4)} m2</small></td>
              <td>${formatNumber(item.width_mm ?? item.widthMm ?? 0)}</td>
              <td>${formatNumber(item.height_mm ?? item.heightMm ?? 0)}</td>
              <td>${formatNumber(item.quantity || 0)}</td>
              <td>${escapeHtml(item.template_name || item.templateName || item.variant_summary || "STD-D1")}</td>
              <td>${escapeHtml(item.material_type || "-")}</td>
              <td>${formatNumber(item.thickness_mm || 0)} mm</td>
              <td>${formatNumber(item.slat_thickness || getRefs().slatThickness?.value || 0)} mm</td>
              ${actionCells(index)}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function renderItemCards() {
    const refs = getRefs();
    if (!refs.itemCards) return;
    if (!state.items.length) {
      refs.itemCards.innerHTML = "";
      return;
    }

    const payload = buildPayload();
    refs.itemCards.innerHTML = state.items.map((item, index) => {
      const activeTab = state.itemCardTabs[index] || "basic";
      const selected = index === normalizeSelectedItemIndex();
      const previewCalc = calculations.calculatePanjurJob({
        ...payload,
        items: [{
          ...payload.items[0],
          ...item,
          width_mm: Number(item.width_mm ?? item.widthMm ?? 0),
          height_mm: Number(item.height_mm ?? item.heightMm ?? 0),
          quantity: Number(item.quantity || 1),
        }],
      });
      const tabContent = activeTab === "basic"
        ? `
          <div class="panjur-item-card-fields">
            <label><span>Kapak Cinsi</span><input data-item-card-field="material_type" data-index="${index}" value="${escapeHtml(item.material_type || "MDF")}"></label>
            <label><span>Kapak Kalinligi</span><input data-item-card-field="thickness_mm" data-index="${index}" type="number" min="0" value="${escapeHtml(item.thickness_mm || 18)}"></label>
            <label><span>Kapak Yonu</span>
              <div class="panjur-item-direction-switch">
                <button class="${(item.cover_direction || "vertical") === "vertical" ? "active" : ""}" type="button" data-item-card-field="cover_direction" data-index="${index}" data-value="vertical">Dikey</button>
                <button class="${(item.cover_direction || "vertical") === "horizontal" ? "active" : ""}" type="button" data-item-card-field="cover_direction" data-index="${index}" data-value="horizontal">Yatay</button>
              </div>
            </label>
            <label><span>Cita / Kargo Kalinligi</span><input data-item-card-field="slat_thickness" data-index="${index}" type="number" min="0" value="${escapeHtml(item.slat_thickness || getRefs().slatThickness?.value || 8)}"></label>
          </div>
        `
        : `
          <div class="panjur-item-card-note">
            <strong>${escapeHtml(activeTab === "side" ? "Yan Seren" : activeTab === "middle" ? "Ara Kayit" : activeTab === "slat" ? "Citalar / Kargo" : activeTab === "cnc" ? "Delik Programi" : "Notlar")}</strong>
            <p>${escapeHtml(item.note || "Bu sekme alanı secili kapaga ait detaylar icin ayrildi.")}</p>
          </div>
        `;

      return `
        <article class="panjur-item-card ${selected ? "is-selected" : ""}" data-item-card="${index}">
          <div class="panjur-item-card-head">
            <div>
              <strong>${escapeHtml(item.item_name || `Kapak ${index + 1}`)} (${formatNumber(item.width_mm || 0)} x ${formatNumber(item.height_mm || 0)} mm)</strong>
              <span>Sablon: ${escapeHtml(item.template_name || item.variant_summary || "STD-D1")}</span>
            </div>
            <button class="ghost-action compact-action panjur-item-card-open" type="button" data-panjur-item-action="edit" data-index="${index}">Ac</button>
          </div>
          <div class="panjur-item-card-tabs">
            <button class="${activeTab === "basic" ? "active" : ""}" type="button" data-item-card-tab="basic" data-index="${index}">Temel Ayarlar</button>
            <button class="${activeTab === "side" ? "active" : ""}" type="button" data-item-card-tab="side" data-index="${index}">Yan Seren</button>
            <button class="${activeTab === "middle" ? "active" : ""}" type="button" data-item-card-tab="middle" data-index="${index}">Ara Kayit</button>
            <button class="${activeTab === "slat" ? "active" : ""}" type="button" data-item-card-tab="slat" data-index="${index}">Citalar / Kargo</button>
            <button class="${activeTab === "cnc" ? "active" : ""}" type="button" data-item-card-tab="cnc" data-index="${index}">Delik Programi</button>
            <button class="${activeTab === "notes" ? "active" : ""}" type="button" data-item-card-tab="notes" data-index="${index}">Notlar</button>
          </div>
          <div class="panjur-item-card-body">
            <div class="panjur-item-card-content">${tabContent}</div>
            <div class="panjur-item-card-preview">${calculations.buildPreviewSvg(previewCalc)}</div>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderTable(columns, rows, emptyText = "Bu sekme icin kayit yok.") {
    if (!rows.length) return `<div class="order-detail-empty">${escapeHtml(emptyText)}</div>`;
    return `
      <table class="orders-data-table erp-modern-table panjur-template-data-table">
        <thead><tr>${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `
            <tr>${columns.map((column) => `<td>${column.render ? column.render(row) : escapeHtml(row[column.key] ?? "-")}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function buildCncTemplateOptions(selectedId = "") {
    return `
      <option value="">Sablon secin</option>
      ${state.cncTemplates.map((template) => `
        <option value="${template.id}" ${String(template.id) === String(selectedId) ? "selected" : ""}>${escapeHtml(template.templateName || template.template_name || `CNC ${template.id}`)}</option>
      `).join("")}
    `;
  }

  function renderCncTabContent() {
    const refs = getRefs();
    if (!state.activeJobId) {
      refs.tabContent.innerHTML = `<div class="order-detail-empty">CNC delik programi icin once panjur kaydini olusturun.</div>`;
      return;
    }

    const draft = getActiveCncDraft();
    const hasCncJob = Boolean(state.activeCncJob?.id);

    refs.tabContent.innerHTML = `
      <section class="panel settings-panel" data-panjur-cnc-scope="1">
        <div class="panel-header-row compact">
          <div>
            <h2>CNC Delik Programi</h2>
            <p>Yan seren olculerinden parametrik delik koordinati ve DXF cikti uretin.</p>
          </div>
          <div class="inline-form-actions">
            <button class="ghost-action compact-action" type="button" data-panjur-cnc-action="create">${hasCncJob ? "CNC Jobu Acik" : "Panjur Jobdan CNC Job Olustur"}</button>
            <button class="ghost-action compact-action" type="button" data-panjur-cnc-action="calculate" ${hasCncJob ? "" : "disabled"}>Delikleri Hesapla</button>
            <button class="primary-btn compact-action" type="button" data-panjur-cnc-action="dxf" ${hasCncJob ? "" : "disabled"}>DXF Indir</button>
          </div>
        </div>
        <div class="form-grid three-col">
          <label><span>Sablon</span><select id="panjurCncTemplateId">${buildCncTemplateOptions(draft.template_id || draft.templateId || "")}</select></label>
          <label><span>Seren Tipi</span>
            <select id="panjurCncSideType">
              <option value="left" ${(draft.side_type || draft.sideType) === "left" ? "selected" : ""}>Sol</option>
              <option value="right" ${(draft.side_type || draft.sideType) === "right" ? "selected" : ""}>Sag</option>
              <option value="both" ${(draft.side_type || draft.sideType) === "both" ? "selected" : ""}>Ikisi</option>
            </select>
          </label>
          <label><span>Seren Uzunlugu</span><input id="panjurCncStileLength" type="number" min="0" value="${escapeHtml(draft.stile_length_mm)}"></label>
          <label><span>Seren Genisligi</span><input id="panjurCncStileWidth" type="number" min="0" value="${escapeHtml(draft.stile_width_mm)}"></label>
          <label><span>Seren Kalinligi</span><input id="panjurCncStileThickness" type="number" min="0" value="${escapeHtml(draft.stile_thickness_mm)}"></label>
          <label><span>Delik Capi</span><input id="panjurCncHoleDiameter" type="number" min="1" value="${escapeHtml(draft.hole_diameter_mm)}"></label>
          <label><span>Ilk Delik Mesafesi</span><input id="panjurCncFirstOffset" type="number" min="0" value="${escapeHtml(draft.first_hole_offset_mm)}"></label>
          <label><span>Son Delik Mesafesi</span><input id="panjurCncLastOffset" type="number" min="0" value="${escapeHtml(draft.last_hole_offset_mm)}"></label>
          <label><span>Delik Araligi</span><input id="panjurCncSpacing" type="number" min="0" value="${escapeHtml(draft.hole_spacing_mm)}"></label>
          <label><span>Delik Adedi</span><input id="panjurCncHoleCount" type="number" min="0" value="${escapeHtml(draft.hole_count)}"></label>
          <label><span>Baslangic Yonu</span>
            <select id="panjurCncStartFrom">
              <option value="top" ${(draft.start_from || draft.startFrom) === "top" ? "selected" : ""}>Ustten</option>
              <option value="bottom" ${(draft.start_from || draft.startFrom) === "bottom" ? "selected" : ""}>Alttan</option>
            </select>
          </label>
          <label><span>Delik Ekseni</span>
            <select id="panjurCncAxis">
              <option value="vertical" ${(draft.drilling_axis || draft.drillingAxis) === "vertical" ? "selected" : ""}>Dikey</option>
              <option value="horizontal" ${(draft.drilling_axis || draft.drillingAxis) === "horizontal" ? "selected" : ""}>Yatay</option>
            </select>
          </label>
          <label class="receipt-wide"><span>Not</span><textarea id="panjurCncNote" rows="3">${escapeHtml(draft.note || "")}</textarea></label>
        </div>
        <div class="panjur-template-summary-grid" id="panjurCncSummaryCards"></div>
        <section class="panjur-template-preview-box">
          <div class="panel-header-row compact">
            <div>
              <h2>CNC Onizleme</h2>
              <p>Yan seren dis siniri, delik daireleri ve etiketler.</p>
            </div>
          </div>
          <div class="panjur-template-preview" id="panjurCncPreview"></div>
        </section>
        <div id="panjurCncHolesTable"></div>
      </section>
    `;
    updateCncLiveOutput();
  }

  function updateCncLiveOutput() {
    const summaryRoot = qs("panjurCncSummaryCards");
    const previewRoot = qs("panjurCncPreview");
    const tableRoot = qs("panjurCncHolesTable");
    if (!summaryRoot || !previewRoot || !tableRoot) return;

    const draft = collectCncDraftFromDom();
    const cncLayout = calculations.calculateCncHoleLayout(draft, buildPayload());

    summaryRoot.innerHTML = `
      <article><span>Toplam Delik</span><strong>${escapeHtml(formatNumber(cncLayout.total_holes || 0))}</strong></article>
      <article><span>Aktif Taraf</span><strong>${escapeHtml((draft.side_type || draft.sideType) === "both" ? "Ikisi" : (draft.side_type || draft.sideType) === "left" ? "Sol" : "Sag")}</strong></article>
      <article><span>Delik Capi</span><strong>${escapeHtml(formatNumber(draft.hole_diameter_mm || 0))} mm</strong></article>
      <article><span>Seren Uzunlugu</span><strong>${escapeHtml(formatNumber(draft.stile_length_mm || 0))} mm</strong></article>
    `;
    if (cncLayout.errors?.length) {
      summaryRoot.innerHTML += `<article class="order-summary-card order-summary-card-alert"><span>CNC Uyarisi</span><strong>${escapeHtml(cncLayout.errors[0])}</strong></article>`;
    }
    previewRoot.innerHTML = calculations.buildCncPreviewSvg(cncLayout);
    tableRoot.innerHTML = renderTable([
      { label: "Delik No", render: (row) => formatNumber(row.hole_no || row.holeNo || 0) },
      { label: "Taraf", render: (row) => (row.side_type || row.sideType) === "left" ? "Sol" : "Sag" },
      { label: "X", render: (row) => `${formatNumber(row.x_mm || row.xMm || 0)} mm` },
      { label: "Y", render: (row) => `${formatNumber(row.y_mm || row.yMm || 0)} mm` },
      { label: "Cap", render: (row) => `${formatNumber(row.diameter_mm || row.diameterMm || 0)} mm` },
    ], cncLayout.holes || [], "Delik koordinati yok.");
  }

  function renderTabContent() {
    const refs = getRefs();
    if (!refs.tabContent) return;
    const calculation = state.calculation || { cutList: [], sideStiles: [], middleRails: [], slatCuts: [], drillDrawings: [] };

    if (state.currentTab === "items") {
      refs.tabContent.innerHTML = buildItemsTableMarkup(false);
      return;
    }

    if (state.currentTab === "side-stiles") {
      refs.tabContent.innerHTML = renderTable([
        { label: "Kapak", key: "item_name" },
        { label: "Taraf", key: "side" },
        { label: "Genislik", render: (row) => formatNumber(row.width_mm) },
        { label: "Uzunluk", render: (row) => formatNumber(row.length_mm) },
        { label: "Adet", render: (row) => formatNumber(row.quantity) },
        { label: "Malzeme", key: "material_type" },
        { label: "Renk", key: "color" },
      ], calculation.sideStiles || [], "Yan seren listesi henuz olusmadi.");
      return;
    }

    if (state.currentTab === "middle-rails") {
      refs.tabContent.innerHTML = renderTable([
        { label: "Kapak", key: "item_name" },
        { label: "Hat", render: (row) => formatNumber(row.line_no) },
        { label: "Konum", render: (row) => `${formatNumber(row.position_mm)} mm` },
        { label: "Boy", render: (row) => `${formatNumber(row.length_mm)} mm` },
        { label: "Olcu", render: (row) => `${formatNumber(row.size_mm)} mm` },
        { label: "Adet", render: (row) => formatNumber(row.quantity) },
        { label: "Renk", key: "color" },
      ], calculation.middleRails || [], "Ara kayit hesabi yok.");
      return;
    }

    if (state.currentTab === "slats") {
      const rows = (calculation.slatCuts || []).filter((row) => ["slat", "cargo"].includes(row.cut_type));
      refs.tabContent.innerHTML = renderTable([
        { label: "Kapak", key: "item_name" },
        { label: "Parca", key: "part_name" },
        { label: "Boy", render: (row) => `${formatNumber(row.length_mm)} mm` },
        { label: "Genislik", render: (row) => `${formatNumber(row.width_mm)} mm` },
        { label: "Kalinlik", render: (row) => `${formatNumber(row.thickness_mm)} mm` },
        { label: "Adet", render: (row) => formatNumber(row.quantity) },
        { label: "Renk", key: "color" },
        { label: "Not", key: "note" },
      ], rows, "Cita / kargo listesi olusmadi.");
      return;
    }

    if (state.currentTab === "cnc") {
      renderCncTabContent();
      return;
    }

    if (state.currentTab === "summary") {
      const summary = calculation.summary || {};
      const cutGroups = calculations.groupCutItemsByType(calculation.cutList || []);
      refs.tabContent.innerHTML = `
        <div class="panjur-template-summary-grid">
          <article><span>Toplam Kapak</span><strong>${escapeHtml(formatNumber(summary.total_quantity || 0))}</strong></article>
          <article><span>Toplam m2</span><strong>${escapeHtml(formatNumber(summary.total_m2 || 0, 4))}</strong></article>
          <article><span>Brut m2</span><strong>${escapeHtml(formatNumber(summary.gross_m2 || 0, 4))}</strong></article>
          <article><span>Kapak Cinsi</span><strong>${escapeHtml(summary.cover_type || "-")}</strong></article>
          <article><span>Yan Seren Adedi</span><strong>${escapeHtml(formatNumber(sumQuantities(cutGroups.side_stile_left || []) + sumQuantities(cutGroups.side_stile_right || [])))}</strong></article>
          <article><span>Ara Kayit Adedi</span><strong>${escapeHtml(formatNumber(sumQuantities(cutGroups.middle_rail || [])))}</strong></article>
          <article><span>Cita Adedi</span><strong>${escapeHtml(formatNumber(sumQuantities(cutGroups.slat || [])))}</strong></article>
          <article><span>Kargo Adedi</span><strong>${escapeHtml(formatNumber(sumQuantities(cutGroups.cargo || [])))}</strong></article>
        </div>
        <section class="panjur-template-preview-box">
          <div class="panel-header-row compact">
            <div>
              <h2>Gorsel Onizleme</h2>
              <p>Secilen kapagin olcu ve seren yerlesimi.</p>
            </div>
          </div>
          <div class="panjur-template-preview">${calculations.buildPreviewSvg(calculation)}</div>
        </section>
      `;
      return;
    }

    refs.tabContent.innerHTML = renderTable([
      { label: "Tip", key: "cut_type" },
      { label: "Parca", key: "part_name" },
      { label: "Boy", render: (row) => `${formatNumber(row.length_mm)} mm` },
      { label: "Genislik", render: (row) => `${formatNumber(row.width_mm)} mm` },
      { label: "Kalinlik", render: (row) => `${formatNumber(row.thickness_mm)} mm` },
      { label: "Adet", render: (row) => formatNumber(row.quantity) },
      { label: "Malzeme", key: "material_type" },
      { label: "Renk", key: "color" },
      { label: "Not", key: "note" },
    ], calculation.cutList || [], "Kesim listesi henuz hesaplanmadi.");
  }

  function renderJobsTable() {
    const refs = getRefs();
    if (!refs.jobsTable) return;
    state.jobs = getJobs();
    if (!state.jobs.length) {
      refs.jobsTable.innerHTML = `<div class="order-detail-empty">Kayitli panjur isi bulunmuyor.</div>`;
      return;
    }
    refs.jobsTable.innerHTML = `
      <table class="orders-data-table erp-modern-table panjur-template-data-table">
        <thead>
          <tr>
            <th>Is No</th>
            <th>Musteri</th>
            <th>Siparis</th>
            <th>Toplam Kapak</th>
            <th>Toplam m2</th>
            <th>Kapak Cinsi</th>
            <th>Durum</th>
            <th>Islemler</th>
          </tr>
        </thead>
        <tbody>
          ${state.jobs.map((job) => `
            <tr class="${Number(job.id) === Number(state.activeJobId || 0) ? "is-selected" : ""}">
              <td><strong>${escapeHtml(job.jobNo || job.job_no || `#${job.id}`)}</strong><small>${escapeHtml(job.deliveryDate || job.delivery_date || "-")}</small></td>
              <td>${escapeHtml(job.customerName || job.customer_name || "-")}</td>
              <td>${escapeHtml(job.orderNo || job.order_no || "-")}</td>
              <td>${formatNumber(job.totalQuantity || job.total_quantity || 0)}</td>
              <td>${formatNumber(job.totalM2 || job.total_m2 || 0, 4)}</td>
              <td>${escapeHtml(job.coverType || job.cover_type || "-")}</td>
              <td>${escapeHtml(job.status || "-")}</td>
              <td class="panjur-template-row-actions">
                <button class="ghost-action compact-action" data-panjur-job-action="open" data-id="${job.id}" type="button">Ac</button>
                <button class="ghost-action compact-action" data-panjur-job-action="calculate" data-id="${job.id}" type="button">Hesapla</button>
                <button class="ghost-action compact-action" data-panjur-job-action="cuts" data-id="${job.id}" type="button">Kesim</button>
                <button class="ghost-action compact-action" data-panjur-job-action="pdf" data-id="${job.id}" type="button">PDF</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function renderAll() {
    const refs = getRefs();
    refs.panelButtons.forEach((button) => button.classList.toggle("active", button.dataset.panjurPanel === state.currentPanel));
    refs.tabs.forEach((button) => button.classList.toggle("active", button.dataset.panjurTemplateTab === state.currentTab));
    renderHeaderSummary();
    renderSummary();
    renderPreview();
    renderItemsTable();
    renderItemCards();
    renderTabContent();
    renderJobsTable();
  }

  function setActivePanel(panel = "overview", scrollIntoView = true) {
    const sectionMap = {
      overview: "panjurOverviewSection",
      items: "panjurMeasurementsSection",
      templates: "panjurMeasurementsSection",
      cuts: "panjurCutsSection",
      "side-stiles": "panjurCutsSection",
      "middle-rails": "panjurCutsSection",
      slats: "panjurCutsSection",
      cnc: "panjurCutsSection",
      preview: "panjurPreviewSection",
      reports: "panjurProjectsSection",
      projects: "panjurProjectsSection",
      settings: "panjurTemplatesSection",
    };
    const nextPanel = String(panel || "overview");
    state.currentPanel = nextPanel;
    if (nextPanel === "cuts") state.currentTab = "side-stiles";
    if (["side-stiles", "middle-rails", "slats", "cnc"].includes(nextPanel)) state.currentTab = nextPanel;
    renderAll();
    if (scrollIntoView) {
      qs(sectionMap[nextPanel] || sectionMap.overview)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function upsertItemFromEditor() {
    const refs = getRefs();
    const width = Number(refs.itemWidth.value || 0);
    const height = Number(refs.itemHeight.value || 0);
    if (!width || !height) {
      window.alert("Kapak genisligi ve yuksekligi zorunludur.");
      return;
    }

    const editIndex = Number(refs.itemEditIndex.value || -1);
    const sourceItem = editIndex >= 0 ? state.items[editIndex] : null;
      const item = {
      order_item_id: sourceItem?.order_item_id ?? sourceItem?.orderItemId ?? null,
      product_id: sourceItem?.product_id ?? sourceItem?.productId ?? null,
      variant_id: sourceItem?.variant_id ?? sourceItem?.variantId ?? null,
      product_name: sourceItem?.product_name || sourceItem?.productName || refs.itemName.value.trim() || `Kapak ${state.items.length + 1}`,
      item_name: refs.itemName.value.trim() || `Kapak ${state.items.length + 1}`,
      width_mm: width,
      height_mm: height,
      quantity: Math.max(1, Number(refs.itemQuantity.value || 1)),
      color: sourceItem?.color || "",
      coating_type: sourceItem?.coating_type || sourceItem?.coatingType || refs.finishType.value || "",
        thickness_mm: Number(sourceItem?.thickness_mm ?? sourceItem?.thicknessMm ?? refs.coverThickness?.value ?? 18),
        wood_type: sourceItem?.wood_type || sourceItem?.woodType || "",
        variant_summary: sourceItem?.variant_summary || sourceItem?.variantSummary || "",
        template_id: sourceItem?.template_id ?? sourceItem?.templateId ?? (refs.templateId?.value ? Number(refs.templateId.value) : null),
        cover_direction: sourceItem?.cover_direction || sourceItem?.coverDirection || refs.coverDirection.value || "vertical",
        slat_thickness: Number(sourceItem?.slat_thickness ?? sourceItem?.slatThickness ?? refs.slatThickness?.value ?? 8),
        has_middle_rail: Boolean(refs.itemHasMiddleRail.checked),
      middle_rail_count: Math.max(0, Number(refs.itemMiddleRailCount.value || 0)),
      middle_rail_size: Math.max(0, Number(refs.itemMiddleRailSize.value || 0)),
      middle_rail_position_type: refs.itemMiddleRailPositionType.value || "center",
      middle_rail_position_value: Math.max(0, Number(refs.itemMiddleRailPositionValue.value || 0)),
      note: refs.itemNote.value.trim(),
      material_type: getRefs().materialType.value || "MDF",
    };
    item.m2 = calculations.calculateItemM2(item.width_mm, item.height_mm, item.quantity);

      if (editIndex >= 0) state.items.splice(editIndex, 1, item);
      else state.items.push(item);

      setSelectedItem(editIndex >= 0 ? editIndex : state.items.length - 1);

      resetItemEditor();
      recalculate();
  }

  function loadItemIntoEditor(index) {
    const refs = getRefs();
    const item = state.items[index];
    if (!item) return;
    refs.itemEditIndex.value = String(index);
    refs.itemName.value = item.item_name || item.itemName || "";
    refs.itemWidth.value = String(item.width_mm ?? item.widthMm ?? "");
    refs.itemHeight.value = String(item.height_mm ?? item.heightMm ?? "");
    refs.itemQuantity.value = String(item.quantity || 1);
    refs.itemHasMiddleRail.checked = Boolean(item.has_middle_rail ?? item.hasMiddleRail);
    refs.itemMiddleRailCount.value = String(item.middle_rail_count ?? item.middleRailCount ?? 0);
    refs.itemMiddleRailSize.value = String(item.middle_rail_size ?? item.middleRailSize ?? 0);
    refs.itemMiddleRailPositionType.value = item.middle_rail_position_type ?? item.middleRailPositionType ?? "center";
      refs.itemMiddleRailPositionValue.value = String(item.middle_rail_position_value ?? item.middleRailPositionValue ?? 0);
      refs.itemNote.value = item.note || "";
      refs.addItemBtn.textContent = "Secili Olcuyu Guncelle";
      setSelectedItem(index);
      renderAll();
    }

  function collectCncDraftFromDom() {
    const current = getActiveCncDraft();
    const templateField = qs("panjurCncTemplateId");
    if (!templateField) return current;

    return {
      template_id: templateField.value || "",
      side_type: qs("panjurCncSideType")?.value || current.side_type || "both",
      stile_length_mm: Number(qs("panjurCncStileLength")?.value || current.stile_length_mm || 0),
      stile_width_mm: Number(qs("panjurCncStileWidth")?.value || current.stile_width_mm || 0),
      stile_thickness_mm: Number(qs("panjurCncStileThickness")?.value || current.stile_thickness_mm || 0),
      hole_diameter_mm: Number(qs("panjurCncHoleDiameter")?.value || current.hole_diameter_mm || 8),
      first_hole_offset_mm: Number(qs("panjurCncFirstOffset")?.value || current.first_hole_offset_mm || 80),
      last_hole_offset_mm: Number(qs("panjurCncLastOffset")?.value || current.last_hole_offset_mm || 80),
      hole_spacing_mm: Number(qs("panjurCncSpacing")?.value || current.hole_spacing_mm || 0),
      hole_count: Number(qs("panjurCncHoleCount")?.value || current.hole_count || 0),
      start_from: qs("panjurCncStartFrom")?.value || current.start_from || "top",
      drilling_axis: qs("panjurCncAxis")?.value || current.drilling_axis || "vertical",
      note: qs("panjurCncNote")?.value?.trim() || current.note || "",
    };
  }

  function applyCncTemplateToDom(templateId) {
    const template = state.cncTemplates.find((item) => Number(item.id) === Number(templateId || 0));
    if (!template) return;
    const fields = {
      panjurCncStileWidth: template.stileWidthMm ?? template.stile_width_mm ?? 70,
      panjurCncStileThickness: template.stileThicknessMm ?? template.stile_thickness_mm ?? 18,
      panjurCncHoleDiameter: template.holeDiameterMm ?? template.hole_diameter_mm ?? 8,
      panjurCncFirstOffset: template.firstHoleOffsetMm ?? template.first_hole_offset_mm ?? 80,
      panjurCncLastOffset: template.lastHoleOffsetMm ?? template.last_hole_offset_mm ?? 80,
      panjurCncSpacing: template.holeSpacingMm ?? template.hole_spacing_mm ?? 0,
      panjurCncHoleCount: template.defaultHoleCount ?? template.default_hole_count ?? 0,
      panjurCncAxis: template.drillingAxis ?? template.drilling_axis ?? "vertical",
      panjurCncNote: template.note || "",
    };

    Object.entries(fields).forEach(([id, value]) => {
      const field = qs(id);
      if (!field) return;
      field.value = String(value ?? "");
    });
  }

  async function createCncJobFromPanjurJob() {
    if (!state.activeJobId) {
      window.alert("CNC job olusturmak icin once panjur kaydini secin.");
      return;
    }
    try {
      const payload = collectCncDraftFromDom();
      const response = await api.panjur.jobs.createCncJob(state.activeJobId, payload);
      state.activeCncJob = response.job || null;
      await loadJob(state.activeJobId, false);
      state.currentTab = "cnc";
      renderAll();
      window.alert(response.message || "CNC delik programi hazirlandi.");
    } catch (error) {
      window.alert(`CNC job olusturulamadi: ${error?.message || "Bilinmeyen hata"}`);
    }
  }

  async function calculateCncHoles() {
    if (!state.activeCncJob?.id) {
      window.alert("Delik hesabi icin once CNC job olusturun.");
      return;
    }
    try {
      const response = await api.panjur.cnc.jobs.calculateHoles(state.activeCncJob.id, collectCncDraftFromDom());
      state.activeCncJob = response.job || state.activeCncJob;
      await loadJob(state.activeJobId, false);
      state.currentTab = "cnc";
      renderAll();
      window.alert(response.message || "CNC delik koordinatlari guncellendi.");
    } catch (error) {
      window.alert(`CNC delikleri hesaplanamadi: ${error?.message || "Bilinmeyen hata"}`);
    }
  }

  function downloadCncDxf() {
    if (!state.activeCncJob?.id) {
      window.alert("DXF cikti icin once CNC job olusturun.");
      return;
    }
    const liveLayout = calculations.calculateCncHoleLayout(collectCncDraftFromDom(), buildPayload());
    if (!liveLayout.isValid) {
      window.alert(`DXF olusturulamadi: ${(liveLayout.errors || []).join(" | ")}`);
      return;
    }
    window.open(api.panjur.cnc.jobs.dxfUrl(state.activeCncJob.id), "_blank", "noopener");
  }

  async function saveJob() {
    if (!state.items.length) {
      window.alert("Kaydetmeden once en az bir kapak satiri ekleyin.");
      return;
    }
    const id = Number(getRefs().editId.value || 0);
    const payload = buildPayload();
    try {
      const response = id ? await api.panjur.jobs.update(id, payload) : await api.panjur.jobs.create(payload);
      const job = response.job || response;
      await loadJob(job.id || id, false);
      if (typeof state.bridge?.refreshUI === "function") await state.bridge.refreshUI();
      window.alert(id ? "Panjur kaydi guncellendi." : "Panjur kaydi olusturuldu.");
    } catch (error) {
      window.alert(`Panjur kaydi kaydedilemedi: ${error?.message || "Bilinmeyen hata"}`);
    }
  }

  async function runCalculation() {
    const id = Number(getRefs().editId.value || 0);
    if (!id) {
      recalculate();
      window.alert("Canli hesaplama guncellendi. Kalici hesap kaydi icin once kaydi olusturun.");
      return;
    }
    try {
      const response = await api.panjur.jobs.recalculate(id, buildPayload());
      const job = response.job || response;
      await loadJob(job.id || id, false);
      if (typeof state.bridge?.refreshUI === "function") await state.bridge.refreshUI();
      window.alert("Parametrik hesaplama guncellendi.");
    } catch (error) {
      window.alert(`Hesaplama yapilamadi: ${error?.message || "Bilinmeyen hata"}`);
    }
  }

  async function generateCutList() {
    let id = Number(getRefs().editId.value || 0);
    if (!id) {
      await saveJob();
      id = Number(getRefs().editId.value || 0);
      if (!id) return;
    }
    try {
      const response = await api.panjur.jobs.generateCutList(id, buildPayload());
      const job = response.job || response;
      await loadJob(job.id || id, false);
      if (typeof state.bridge?.refreshUI === "function") await state.bridge.refreshUI();
      state.currentTab = "side-stiles";
      renderAll();
      window.alert("Kesim listesi olusturuldu.");
    } catch (error) {
      window.alert(`Kesim listesi olusturulamadi: ${error?.message || "Bilinmeyen hata"}`);
    }
  }

  function openPdf() {
    if (!state.activeJobId) {
      window.alert("PDF olusturmak icin once kaydi kaydedin.");
      return;
    }
    window.open(api.panjur.jobs.pdfUrl(state.activeJobId), "_blank", "noopener");
  }

  function openExcel() {
    if (!state.activeJobId) {
      window.alert("Excel cikti icin once kaydi kaydedin.");
      return;
    }
    window.open(api.panjur.jobs.excelUrl(state.activeJobId), "_blank", "noopener");
  }

  function printCutList() {
    if (!state.activeJobId) {
      window.alert("Yazdirma icin once kaydi kaydedin.");
      return;
    }
    const popup = window.open(api.panjur.jobs.pdfUrl(state.activeJobId), "_blank", "noopener");
    if (popup) popup.focus();
  }

  async function saveTemplate() {
    try {
      const refs = getRefs();
      const currentId = Number(refs.templateId.value || 0);
      const payload = buildTemplatePayload();
      const response = currentId
        ? await api.panjur.templates.update(currentId, payload)
        : await api.panjur.templates.create(payload);
      const template = response.template || response;
      state.templatesLoaded = false;
      state.templates = [];
      loadTemplates();
      refs.templateId.value = String(template.id || currentId || "");
      refs.templateName.value = template.templateName || template.template_name || payload.template_name;
      window.alert(currentId ? "Sablon guncellendi." : "Sablon kaydedildi.");
    } catch (error) {
      window.alert(`Sablon kaydedilemedi: ${error?.message || "Bilinmeyen hata"}`);
    }
  }

  async function deleteTemplate() {
    const refs = getRefs();
    const currentId = Number(refs.templateId.value || 0);
    if (!currentId) {
      window.alert("Silinecek sablon secin.");
      return;
    }
    if (!window.confirm("Secili panjur sablonu silinsin mi?")) return;
    try {
      await api.panjur.templates.delete(currentId);
      refs.templateId.value = "";
      refs.templateName.value = "";
      state.templatesLoaded = false;
      state.templates = [];
      loadTemplates();
      window.alert("Sablon silindi.");
    } catch (error) {
      window.alert(`Sablon silinemedi: ${error?.message || "Bilinmeyen hata"}`);
    }
  }

  function applyJobToForm(job) {
    const refs = getRefs();
    refs.editId.value = job.id || "";
    refs.orderId.value = job.orderId || job.order_id || "";
    refs.orderNo.value = job.orderNo || job.order_no || "";
    refs.orderDate.value = job.orderDate || job.order_date || today();
    refs.deliveryDate.value = job.deliveryDate || job.delivery_date || "";
    refs.customerName.value = job.customerName || job.customer_name || "";
    refs.status.value = job.status || "draft";
    refs.note.value = job.note || "";
    refs.templateId.value = job.templateId || job.template_id || "";
    refs.templateName.value = job.templateName || job.template_name || refs.templateName.value;
    refs.coverType.value = job.coverType || job.cover_type || "Panjur Kapak";
    refs.coverThickness.value = String(job.coverThickness ?? job.cover_thickness ?? 18);
    refs.slatThickness.value = String(job.slatThickness ?? job.slat_thickness ?? 8);
    refs.coverDirection.value = job.coverDirection || job.cover_direction || "vertical";
    refs.materialType.value = job.materialType || job.material_type || "MDF";
    refs.finishType.value = job.finishType || job.finish_type || "lake";
    refs.leftSideStileWidth.value = String(job.leftSideStileWidth ?? job.left_side_stile_width ?? 70);
    refs.rightSideStileWidth.value = String(job.rightSideStileWidth ?? job.right_side_stile_width ?? 70);
    refs.leftGap.value = String(job.leftGap ?? job.left_gap ?? 0);
    refs.rightGap.value = String(job.rightGap ?? job.right_gap ?? 0);
    refs.topGap.value = String(job.topGap ?? job.top_gap ?? 0);
    refs.bottomGap.value = String(job.bottomGap ?? job.bottom_gap ?? 0);
    refs.sideStileHeightMode.value = job.sideStileHeightMode || job.side_stile_height_mode || "equal";
    refs.manualSideStileLength.value = String(job.manualSideStileLength ?? job.manual_side_stile_length ?? 0);
    refs.middleRailEnabled.checked = Boolean(job.middleRailEnabled ?? job.middle_rail_enabled);
    refs.middleRailCount.value = String(job.middleRailCount ?? job.middle_rail_count ?? 0);
    refs.middleRailPositionType.value = job.middleRailPositionType || job.middle_rail_position_type || "center";
    refs.middleRailSize.value = String(job.middleRailSize ?? job.middle_rail_size ?? 70);
    refs.middleRailTopOffset.value = String(job.middleRailTopOffset ?? job.middle_rail_top_offset ?? 0);
    refs.middleRailBottomOffset.value = String(job.middleRailBottomOffset ?? job.middle_rail_bottom_offset ?? 0);
    refs.calculationNote.value = job.calculationNote || job.calculation_note || refs.calculationNote.value;
    state.items = Array.isArray(job.items) ? job.items.map((item) => ({
      item_name: item.itemName || item.item_name || "",
      product_name: item.productName || item.product_name || item.itemName || item.item_name || "",
      order_item_id: item.orderItemId || item.order_item_id || null,
      product_id: item.productId || item.product_id || null,
      variant_id: item.variantId || item.variant_id || null,
      width_mm: Number(item.widthMm ?? item.width_mm ?? 0),
      height_mm: Number(item.heightMm ?? item.height_mm ?? 0),
      quantity: Number(item.quantity || 1),
      has_middle_rail: Boolean(item.hasMiddleRail ?? item.has_middle_rail),
      middle_rail_count: Number(item.middleRailCount ?? item.middle_rail_count ?? 0),
      middle_rail_size: Number(item.middleRailSize ?? item.middle_rail_size ?? 0),
      middle_rail_position_type: item.middleRailPositionType || item.middle_rail_position_type || "center",
      middle_rail_position_value: Number(item.middleRailPositionValue ?? item.middle_rail_position_value ?? 0),
      note: item.note || "",
      m2: Number(item.m2 || 0),
      material_type: item.materialType || item.material_type || refs.materialType.value || "MDF",
      coating_type: item.coatingType || item.coating_type || refs.finishType.value || "",
      thickness_mm: Number(item.thicknessMm ?? item.thickness_mm ?? refs.coverThickness.value ?? 18),
        color: item.color || "",
        wood_type: item.woodType || item.wood_type || "",
        variant_summary: item.variantSummary || item.variant_summary || "",
        template_id: item.templateId || item.template_id || null,
        cover_direction: item.coverDirection || item.cover_direction || refs.coverDirection.value || "vertical",
        slat_thickness: Number(item.slatThickness ?? item.slat_thickness ?? refs.slatThickness.value ?? 8),
      })) : [];
      state.selectedItemIndex = state.items.length ? 0 : -1;
      state.itemCardTabs = {};
      state.activeJobId = job.id || null;
    state.activeCncJob = job.cncJob || job.cnc_job || null;
    state.calculation = job.calculation ? {
      summary: job.calculation.summary || {},
      sideStiles: job.calculation.side_stiles || job.calculation.sideStiles || [],
      middleRails: job.calculation.middle_rails || job.calculation.middleRails || [],
      slatCuts: job.calculation.slat_cuts || job.calculation.slatCuts || [],
      drillDrawings: job.calculation.drill_drawings || job.calculation.drillDrawings || [],
      cutList: job.calculation.cut_list || job.calculation.cutList || [],
      settings: calculations.calculatePanjurJob(buildPayload()).settings,
      items: state.items,
    } : calculations.calculatePanjurJob(buildPayload());
    resetItemEditor();
    renderAll();
  }

  async function loadJob(id, scrollIntoView = true) {
    try {
      const job = await api.panjur.jobs.detail(id);
      applyJobToForm(job);
      state.currentPanel = "overview";
      renderAll();
      if (scrollIntoView) qs("view-panjur")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      window.alert(`Panjur kaydi acilamadi: ${error?.message || "Bilinmeyen hata"}`);
    }
  }

  function bindDelegates() {
    const refs = getRefs();

    const liveRecalculate = (event) => {
      if (event.target.closest("[data-panjur-cnc-scope]")) return;
      if (event.target.matches("input, textarea, select")) recalculate();
    };
    refs.root.addEventListener("input", liveRecalculate);
    refs.root.addEventListener("change", liveRecalculate);

      refs.orderId?.addEventListener("change", applyOrderInfo);
    refs.templateId?.addEventListener("change", () => {
      const template = state.templates.find((item) => Number(item.id) === Number(refs.templateId.value || 0));
      if (template) applyTemplateToForm(template);
    });

      refs.resetBtn?.addEventListener("click", resetForm);
      refs.saveBtnSecondary?.addEventListener("click", saveJob);
      refs.saveAsBtn?.addEventListener("click", async () => {
        getRefs().editId.value = "";
        state.activeJobId = null;
        await saveJob();
      });
      refs.quickAddBtn?.addEventListener("click", upsertItemFromEditor);
      refs.menuBtn?.addEventListener("click", runCalculation);
      refs.calculateBtn?.addEventListener("click", runCalculation);
      refs.generateCutsBtn?.addEventListener("click", generateCutList);
      refs.saveBtn?.addEventListener("click", saveJob);
      refs.loadOrderItemsBtn?.addEventListener("click", applyOrderInfo);
      refs.clearItemBtn?.addEventListener("click", resetItemEditor);
      refs.copySelectedBtn?.addEventListener("click", () => {
        const index = normalizeSelectedItemIndex();
        if (index < 0 || !state.items[index]) return;
        state.items.splice(index + 1, 0, { ...state.items[index], item_name: `${state.items[index].item_name || `Kapak ${index + 1}`} Kopya` });
        setSelectedItem(index + 1);
        recalculate();
      });
      refs.deleteSelectedBtn?.addEventListener("click", () => {
        const index = normalizeSelectedItemIndex();
        if (index < 0) return;
        state.items.splice(index, 1);
        setSelectedItem(Math.max(0, index - 1));
        resetItemEditor();
        recalculate();
      });
      refs.templateLibraryBtn?.addEventListener("click", () => setActivePanel("templates"));
      refs.addItemBtn?.addEventListener("click", upsertItemFromEditor);
      refs.preview3dBtn?.addEventListener("click", () => setActivePanel("preview"));
      refs.pdfBtn?.addEventListener("click", openPdf);
      refs.excelBtn?.addEventListener("click", openExcel);
      refs.printBtn?.addEventListener("click", printCutList);
      refs.prevItemBtn?.addEventListener("click", () => {
        if (!state.items.length) return;
        setSelectedItem((normalizeSelectedItemIndex() - 1 + state.items.length) % state.items.length);
        renderAll();
      });
      refs.nextItemBtn?.addEventListener("click", () => {
        if (!state.items.length) return;
        setSelectedItem((normalizeSelectedItemIndex() + 1) % state.items.length);
        renderAll();
      });
      refs.templateSaveBtn?.addEventListener("click", saveTemplate);
      refs.templateDeleteBtn?.addEventListener("click", deleteTemplate);

    refs.panelButtons.forEach((button) => button.addEventListener("click", () => {
      setActivePanel(button.dataset.panjurPanel || "overview");
    }));

    refs.tabs.forEach((button) => button.addEventListener("click", () => {
      state.currentTab = button.dataset.panjurTemplateTab || "items";
      state.currentPanel = ["side-stiles", "middle-rails", "slats", "cnc"].includes(state.currentTab) ? state.currentTab : "cuts";
      renderAll();
    }));

      refs.itemsTable?.addEventListener("click", (event) => {
        const row = event.target.closest("[data-panjur-item-row]");
        if (row) {
          setSelectedItem(Number(row.dataset.panjurItemRow || 0));
          renderAll();
        }
        const button = event.target.closest("[data-panjur-item-action]");
        if (!button) return;
        const index = Number(button.dataset.index || -1);
        const action = button.dataset.panjurItemAction;
        if (action === "edit") loadItemIntoEditor(index);
        if (action === "copy" && state.items[index]) {
          state.items.push({ ...state.items[index] });
          setSelectedItem(state.items.length - 1);
          recalculate();
        }
        if (action === "delete") {
          state.items.splice(index, 1);
          setSelectedItem(Math.max(0, index - 1));
          resetItemEditor();
          recalculate();
        }
      });

      refs.itemCards?.addEventListener("click", (event) => {
        const tab = event.target.closest("[data-item-card-tab]");
        if (tab) {
          state.itemCardTabs[Number(tab.dataset.index || 0)] = tab.dataset.itemCardTab || "basic";
          renderItemCards();
          return;
        }
        const switchButton = event.target.closest("[data-item-card-field][data-value]");
        if (switchButton) {
          const index = Number(switchButton.dataset.index || 0);
          const field = switchButton.dataset.itemCardField;
          state.items[index] = { ...state.items[index], [field]: switchButton.dataset.value || "" };
          setSelectedItem(index);
          recalculate();
        }
      });

      refs.itemCards?.addEventListener("change", (event) => {
        const field = event.target.closest("[data-item-card-field]");
        if (!field || field.dataset.value) return;
        const index = Number(field.dataset.index || 0);
        const key = field.dataset.itemCardField;
        const value = field.type === "number" ? Number(field.value || 0) : field.value;
        state.items[index] = { ...state.items[index], [key]: value };
        setSelectedItem(index);
        recalculate();
      });

    refs.tabContent?.addEventListener("change", (event) => {
      if (!event.target.closest("[data-panjur-cnc-scope]")) return;
      if (event.target.id === "panjurCncTemplateId") {
        applyCncTemplateToDom(event.target.value);
      }
      updateCncLiveOutput();
    });

    refs.tabContent?.addEventListener("input", (event) => {
      if (!event.target.closest("[data-panjur-cnc-scope]")) return;
      updateCncLiveOutput();
    });

    refs.tabContent?.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-panjur-cnc-action]");
      if (!button) return;
      const action = button.dataset.panjurCncAction;
      if (action === "create") await createCncJobFromPanjurJob();
      if (action === "calculate") await calculateCncHoles();
      if (action === "dxf") downloadCncDxf();
    });

    refs.jobsTable?.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-panjur-job-action]");
      if (!button) return;
      const id = Number(button.dataset.id || 0);
      const action = button.dataset.panjurJobAction;
      if (action === "open") await loadJob(id);
      if (action === "calculate") {
        try {
          await api.panjur.jobs.recalculate(id, {});
          if (typeof state.bridge?.refreshUI === "function") await state.bridge.refreshUI();
          await loadJob(id, false);
        } catch (error) {
          window.alert(`Kayit hesaplanamadi: ${error?.message || "Bilinmeyen hata"}`);
        }
      }
      if (action === "cuts") {
        try {
          await api.panjur.jobs.generateCutList(id, {});
          if (typeof state.bridge?.refreshUI === "function") await state.bridge.refreshUI();
          await loadJob(id, false);
          state.currentTab = "side-stiles";
          renderAll();
        } catch (error) {
          window.alert(`Kesim listesi uretilemedi: ${error?.message || "Bilinmeyen hata"}`);
        }
      }
      if (action === "pdf") window.open(api.panjur.jobs.pdfUrl(id), "_blank", "noopener");
    });
  }

  function openJob(id) {
    return loadJob(id);
  }

  function navigateToSection(section = "projects") {
    const sectionKey = String(section || "projects");
    setActivePanel(sectionKey, true);
  }

  function sync(bridge) {
    state.bridge = bridge || state.bridge;
    const refs = getRefs();
    if (!refs.root || !api?.panjur?.jobs || !calculations) return;

    renderOrderOptions();
    loadTemplates();
    loadCncTemplates();

    if (!state.bound) {
      bindDelegates();
      state.bound = true;
      resetForm();
    }

    state.jobs = getJobs();
    renderJobsTable();
  }

  window.PanjurTemplateModule = { sync, openJob, navigateToSection };
})();
