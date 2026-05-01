(function () {
  const DEFAULT_WASTE_RATE = 8;

  function toNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  function round(value, fractionDigits = 4) {
    const factor = 10 ** fractionDigits;
    return Math.round(Number(value || 0) * factor) / factor;
  }

  function normalizeBoolean(value) {
    return value === true || value === 1 || value === "1" || value === "true" || value === "on";
  }

  function calculateItemM2(widthMm, heightMm, quantity) {
    return round((toNumber(widthMm) / 1000) * (toNumber(heightMm) / 1000) * toNumber(quantity, 1));
  }

  function resolveSideStileLength(heightMm, settings = {}) {
    const height = Math.max(0, toNumber(heightMm));
    const topGap = Math.max(0, toNumber(settings.top_gap ?? settings.topGap, 0));
    const bottomGap = Math.max(0, toNumber(settings.bottom_gap ?? settings.bottomGap, 0));
    const mode = String(settings.side_stile_height_mode ?? settings.sideStileHeightMode ?? "equal").trim();
    const manualLength = Math.max(0, toNumber(settings.manual_side_stile_length ?? settings.manualSideStileLength, height));

    if (mode === "minus_gaps") return Math.max(0, height - topGap - bottomGap);
    if (mode === "manual") return manualLength;
    return height;
  }

  function resolveMiddleRailPositions(item = {}, settings = {}) {
    const count = Math.max(0, Math.round(toNumber(item.middle_rail_count ?? item.middleRailCount, settings.middle_rail_count ?? settings.middleRailCount ?? 0)));
    if (!count) return [];

    const topGap = Math.max(0, toNumber(settings.top_gap ?? settings.topGap, 0));
    const bottomGap = Math.max(0, toNumber(settings.bottom_gap ?? settings.bottomGap, 0));
    const height = Math.max(0, toNumber(item.height_mm ?? item.heightMm, 0));
    const usableHeight = Math.max(0, height - topGap - bottomGap);
    const positionType = String(item.middle_rail_position_type ?? item.middleRailPositionType ?? settings.middle_rail_position_type ?? settings.middleRailPositionType ?? "center").trim();
    const positionValue = Math.max(0, toNumber(item.middle_rail_position_value ?? item.middleRailPositionValue, 0));
    const topOffset = Math.max(0, toNumber(settings.middle_rail_top_offset ?? settings.middleRailTopOffset, positionValue));
    const bottomOffset = Math.max(0, toNumber(settings.middle_rail_bottom_offset ?? settings.middleRailBottomOffset, positionValue));

    if (count === 1) {
      if (positionType === "top") return [round(topGap + topOffset, 2)];
      if (positionType === "bottom") return [round(Math.max(topGap, height - bottomGap - bottomOffset), 2)];
      return [round(topGap + usableHeight / 2, 2)];
    }

    if (positionType === "top") {
      const remaining = Math.max(0, usableHeight - topOffset);
      const step = count > 1 ? remaining / count : 0;
      return Array.from({ length: count }, (_, index) => round(topGap + topOffset + (index * step), 2));
    }

    if (positionType === "bottom") {
      const remaining = Math.max(0, usableHeight - bottomOffset);
      const step = count > 1 ? remaining / count : 0;
      return Array.from({ length: count }, (_, index) => round(height - bottomGap - bottomOffset - (index * step), 2)).sort((left, right) => left - right);
    }

    const gap = usableHeight / (count + 1);
    return Array.from({ length: count }, (_, index) => round(topGap + (gap * (index + 1)), 2));
  }

  function calculateSlatCuts(item = {}, settings = {}) {
    const width = Math.max(0, toNumber(item.width_mm ?? item.widthMm, 0));
    const height = Math.max(0, toNumber(item.height_mm ?? item.heightMm, 0));
    const quantity = Math.max(1, Math.round(toNumber(item.quantity, 1)));
    const leftWidth = Math.max(0, toNumber(settings.left_side_stile_width ?? settings.leftSideStileWidth, 0));
    const rightWidth = Math.max(0, toNumber(settings.right_side_stile_width ?? settings.rightSideStileWidth, 0));
    const leftGap = Math.max(0, toNumber(settings.left_gap ?? settings.leftGap, 0));
    const rightGap = Math.max(0, toNumber(settings.right_gap ?? settings.rightGap, 0));
    const topGap = Math.max(0, toNumber(settings.top_gap ?? settings.topGap, 0));
    const bottomGap = Math.max(0, toNumber(settings.bottom_gap ?? settings.bottomGap, 0));
    const slatThickness = Math.max(1, toNumber(settings.slat_thickness ?? settings.slatThickness, 8));
    const direction = String(settings.cover_direction ?? settings.coverDirection ?? "vertical").trim().toLowerCase();
    const material = String(item.material_type ?? item.materialType ?? settings.material_type ?? settings.materialType ?? "MDF").trim();

    const clearWidth = Math.max(0, width - leftWidth - rightWidth - leftGap - rightGap);
    const clearHeight = Math.max(0, height - topGap - bottomGap);
    const baseLength = direction === "horizontal" ? clearWidth : clearHeight;
    const distributionMeasure = direction === "horizontal" ? clearHeight : clearWidth;
    const slatCount = Math.max(1, Math.ceil(distributionMeasure / slatThickness));

    return {
      slatCount,
      clearWidth,
      clearHeight,
      cuts: [
        {
          cut_type: "slat",
          part_name: direction === "horizontal" ? "Yatay Cita" : "Dikey Cita",
          length_mm: round(baseLength, 2),
          width_mm: round(slatThickness, 2),
          thickness_mm: round(slatThickness, 2),
          quantity: quantity * slatCount,
          material_type: material,
          note: `${slatCount} adet / kapak`,
        },
        {
          cut_type: "cargo",
          part_name: "Kargo Koruma",
          length_mm: round(Math.max(width, height), 2),
          width_mm: 0,
          thickness_mm: round(slatThickness, 2),
          quantity,
          material_type: material,
          note: "Paketleme / sevkiyat kesimi",
        },
      ],
    };
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function validateCncHoleLayout(payload = {}, panjurJob = null) {
    const sideType = String(payload.side_type ?? payload.sideType ?? "both").trim().toLowerCase();
    const startFrom = String(payload.start_from ?? payload.startFrom ?? "top").trim().toLowerCase();
    const drillingAxis = String(payload.drilling_axis ?? payload.drillingAxis ?? "vertical").trim().toLowerCase();
    const stileLength = Math.max(0, toNumber(payload.stile_length_mm ?? payload.stileLengthMm, 0));
    const stileThickness = Math.max(0, toNumber(payload.stile_thickness_mm ?? payload.stileThicknessMm, 18));
    const holeDiameter = Math.max(1, toNumber(payload.hole_diameter_mm ?? payload.holeDiameterMm, 8));
    const firstOffset = Math.max(0, toNumber(payload.first_hole_offset_mm ?? payload.firstHoleOffsetMm, 80));
    const lastOffset = Math.max(0, toNumber(payload.last_hole_offset_mm ?? payload.lastHoleOffsetMm, 80));
    const holeSpacing = Math.max(0, toNumber(payload.hole_spacing_mm ?? payload.holeSpacingMm, 0));
    const holeCount = Math.max(0, Math.round(toNumber(payload.hole_count ?? payload.holeCount, 0)));
    const baseWidth = Math.max(0, toNumber(payload.stile_width_mm ?? payload.stileWidthMm, 70));
    const jobLeftWidth = Math.max(0, toNumber(panjurJob?.left_side_stile_width ?? panjurJob?.leftSideStileWidth, baseWidth));
    const jobRightWidth = Math.max(0, toNumber(panjurJob?.right_side_stile_width ?? panjurJob?.rightSideStileWidth, baseWidth));
    const selectedSides = sideType === "left"
      ? ["left"]
      : sideType === "right"
        ? ["right"]
        : ["left", "right"];
    const errors = [];
    const usableLength = Math.max(0, stileLength - firstOffset - lastOffset);

    if (!selectedSides.length) errors.push("Seren tipi secin.");
    if (stileLength <= 0) errors.push("Seren uzunlugu sifirdan buyuk olmali.");
    if (baseWidth <= 0) errors.push("Seren genisligi sifirdan buyuk olmali.");
    if (holeDiameter <= 0) errors.push("Delik capi sifirdan buyuk olmali.");
    if (holeDiameter >= Math.min(stileLength || Infinity, baseWidth || Infinity)) errors.push("Delik capi seren olcusunden buyuk veya esit olamaz.");
    if (firstOffset + lastOffset >= stileLength) errors.push("Ilk ve son delik mesafeleri seren boyunu asmamali.");
    if (!holeCount && holeSpacing <= 0) errors.push("Delik adedi veya delik araligi tanimlanmali.");
    if (holeCount > 1 && holeSpacing > 0 && (firstOffset + lastOffset + ((holeCount - 1) * holeSpacing)) > stileLength) {
      errors.push("Delik araligi ve adet kombinasyonu seren boyuna sigmiyor.");
    }

    selectedSides.forEach((side) => {
      const sideWidth = side === "left" ? jobLeftWidth : jobRightWidth;
      if (holeDiameter >= sideWidth) errors.push(`${side === "left" ? "Sol" : "Sag"} seren genisligi delik capinden buyuk olmali.`);
    });

    return {
      isValid: errors.length === 0,
      errors,
      settings: {
        side_type: sideType,
        start_from: startFrom,
        drilling_axis: drillingAxis,
        stile_length_mm: round(stileLength, 2),
        stile_width_mm: round(baseWidth, 2),
        stile_thickness_mm: round(stileThickness, 2),
        hole_diameter_mm: round(holeDiameter, 2),
        first_hole_offset_mm: round(firstOffset, 2),
        last_hole_offset_mm: round(lastOffset, 2),
        hole_spacing_mm: round(holeSpacing, 2),
        hole_count: holeCount,
        usable_length_mm: round(usableLength, 2),
      },
      selectedSides,
      widths: {
        left: round(jobLeftWidth, 2),
        right: round(jobRightWidth, 2),
      },
    };
  }

  function resolveCncHolePositions(lengthMm, firstOffsetMm, lastOffsetMm, holeCount, holeSpacingMm) {
    const length = Math.max(0, toNumber(lengthMm, 0));
    const firstOffset = Math.max(0, toNumber(firstOffsetMm, 0));
    const lastOffset = Math.max(0, toNumber(lastOffsetMm, 0));
    const usableLength = Math.max(0, length - firstOffset - lastOffset);
    const explicitCount = Math.max(0, Math.round(toNumber(holeCount, 0)));
    const spacing = Math.max(0, toNumber(holeSpacingMm, 0));

    if (!length || usableLength < 0) return [];

    const count = explicitCount > 0
      ? explicitCount
      : spacing > 0
        ? Math.max(1, Math.floor(usableLength / spacing) + 1)
        : 0;

    if (count === 1) return [round(firstOffset, 2)];
    if (count <= 0) return [];

    const step = explicitCount > 0
      ? (count > 1 ? usableLength / (count - 1) : 0)
      : spacing;

    return Array.from({ length: count }, (_, index) => round(firstOffset + (step * index), 2))
      .filter((position) => position <= (length - lastOffset + 0.001));
  }

  function calculateCncHoleLayout(payload = {}, panjurJob = null) {
    const validation = validateCncHoleLayout(payload, panjurJob);
    if (!validation.isValid) {
      return {
        settings: validation.settings,
        holes: [],
        sides: validation.selectedSides.map((side) => ({
          side_type: side,
          sideType: side,
          stile_width_mm: side === "left" ? validation.widths.left : validation.widths.right,
          stileWidthMm: side === "left" ? validation.widths.left : validation.widths.right,
          stile_length_mm: validation.settings.stile_length_mm,
          stileLengthMm: validation.settings.stile_length_mm,
        })),
        total_holes: 0,
        totalHoles: 0,
        is_valid: false,
        isValid: false,
        errors: validation.errors,
      };
    }

    const {
      side_type: sideType,
      start_from: startFrom,
      drilling_axis: drillingAxis,
      stile_length_mm: stileLength,
      stile_width_mm: baseWidth,
      stile_thickness_mm: stileThickness,
      hole_diameter_mm: holeDiameter,
      first_hole_offset_mm: firstOffset,
      last_hole_offset_mm: lastOffset,
      hole_spacing_mm: holeSpacing,
      hole_count: holeCount,
    } = validation.settings;
    const jobLeftWidth = validation.widths.left;
    const jobRightWidth = validation.widths.right;
    const selectedSides = validation.selectedSides;

    const basePositions = resolveCncHolePositions(stileLength, firstOffset, lastOffset, holeCount, holeSpacing);
    const radius = holeDiameter / 2;
    const holes = [];

    selectedSides.forEach((side) => {
      const stileWidth = side === "left" ? jobLeftWidth : jobRightWidth;
      basePositions.forEach((position, index) => {
        const distanceFromStart = startFrom === "bottom"
          ? Math.max(0, stileLength - position)
          : position;
        const centerAcrossWidth = side === "right"
          ? round(stileWidth - clamp(stileWidth / 2, radius, Math.max(radius, stileWidth - radius)), 2)
          : round(clamp(stileWidth / 2, radius, Math.max(radius, stileWidth - radius)), 2);
        const axisPosition = round(clamp(distanceFromStart, radius, Math.max(radius, stileLength - radius)), 2);
        const x = drillingAxis === "horizontal" ? axisPosition : centerAcrossWidth;
        const y = drillingAxis === "horizontal" ? centerAcrossWidth : axisPosition;

        holes.push({
          side_type: side,
          sideType: side,
          hole_no: index + 1,
          holeNo: index + 1,
          x_mm: round(x, 2),
          xMm: round(x, 2),
          y_mm: round(y, 2),
          yMm: round(y, 2),
          diameter_mm: round(holeDiameter, 2),
          diameterMm: round(holeDiameter, 2),
          stile_width_mm: round(stileWidth, 2),
          stileWidthMm: round(stileWidth, 2),
        });
      });
    });

    return {
      settings: {
        side_type: sideType,
        start_from: startFrom,
        drilling_axis: drillingAxis,
        stile_length_mm: round(stileLength, 2),
        stile_width_mm: round(baseWidth, 2),
        stile_thickness_mm: round(stileThickness, 2),
        hole_diameter_mm: round(holeDiameter, 2),
        first_hole_offset_mm: round(firstOffset, 2),
        last_hole_offset_mm: round(lastOffset, 2),
        hole_spacing_mm: round(holeSpacing, 2),
        hole_count: basePositions.length,
      },
      holes,
      sides: selectedSides.map((side) => ({
        side_type: side,
        sideType: side,
        stile_width_mm: round(side === "left" ? jobLeftWidth : jobRightWidth, 2),
        stileWidthMm: round(side === "left" ? jobLeftWidth : jobRightWidth, 2),
        stile_length_mm: round(stileLength, 2),
        stileLengthMm: round(stileLength, 2),
      })),
      total_holes: holes.length,
      totalHoles: holes.length,
      is_valid: true,
      isValid: true,
      errors: [],
    };
  }

  function buildCncPreviewSvg(layout = {}) {
    const sides = Array.isArray(layout.sides) ? layout.sides : [];
    const holes = Array.isArray(layout.holes) ? layout.holes : [];
    if (!sides.length) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 260"><rect width="720" height="260" fill="#f8fafc"/><text x="360" y="130" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="18">CNC delik onizlemesi icin once bir CNC programi olusturun</text></svg>`;
    }

    const maxLength = Math.max(...sides.map((side) => Number(side.stile_length_mm || 0)), 100);
    const totalWidth = sides.reduce((sum, side) => sum + Number(side.stile_width_mm || 0), 0) + (Math.max(0, sides.length - 1) * 40);
    const viewWidth = 720;
    const viewHeight = 360;
    const margin = 50;
    const scale = Math.min((viewWidth - (margin * 2)) / Math.max(120, totalWidth), (viewHeight - (margin * 2)) / Math.max(120, maxLength));
    let cursorX = margin;

    const sideBlocks = sides.map((side) => {
      const width = Number(side.stile_width_mm || 0) * scale;
      const height = Number(side.stile_length_mm || 0) * scale;
      const block = {
        ...side,
        x: cursorX,
        y: (viewHeight - height) / 2,
        drawWidth: width,
        drawHeight: height,
      };
      cursorX += width + (40 * scale);
      return block;
    });

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewWidth} ${viewHeight}">
        <rect width="${viewWidth}" height="${viewHeight}" fill="#f8fafc"/>
        ${sideBlocks.map((side) => `
          <rect x="${side.x}" y="${side.y}" width="${side.drawWidth}" height="${side.drawHeight}" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
          <text x="${side.x + (side.drawWidth / 2)}" y="${side.y - 12}" text-anchor="middle" font-family="Arial" font-size="12" fill="#1e293b">${side.sideType === "left" ? "Sol Seren" : "Sag Seren"}</text>
          <text x="${side.x + (side.drawWidth / 2)}" y="${side.y + side.drawHeight + 18}" text-anchor="middle" font-family="Arial" font-size="11" fill="#475569">${round(side.stile_width_mm, 2)} mm</text>
        `).join("")}
        ${holes.map((hole) => {
          const side = sideBlocks.find((block) => block.sideType === hole.sideType);
          if (!side) return "";
          return `
            <circle cx="${side.x + (Number(hole.x_mm || 0) * scale)}" cy="${side.y + (Number(hole.y_mm || 0) * scale)}" r="${Math.max(3, (Number(hole.diameter_mm || 0) / 2) * scale)}" fill="rgba(30, 64, 175, 0.16)" stroke="#1d4ed8" stroke-width="2"/>
            <text x="${side.x + (Number(hole.x_mm || 0) * scale) + 10}" y="${side.y + (Number(hole.y_mm || 0) * scale) - 6}" font-family="Arial" font-size="10" fill="#1e293b">#${hole.hole_no}</text>
          `;
        }).join("")}
      </svg>
    `;
  }

  function calculatePanjurJob(payload = {}) {
    const settings = {
      left_side_stile_width: Math.max(0, toNumber(payload.left_side_stile_width ?? payload.leftSideStileWidth, 70)),
      right_side_stile_width: Math.max(0, toNumber(payload.right_side_stile_width ?? payload.rightSideStileWidth, 70)),
      top_gap: Math.max(0, toNumber(payload.top_gap ?? payload.topGap, 0)),
      bottom_gap: Math.max(0, toNumber(payload.bottom_gap ?? payload.bottomGap, 0)),
      left_gap: Math.max(0, toNumber(payload.left_gap ?? payload.leftGap, 0)),
      right_gap: Math.max(0, toNumber(payload.right_gap ?? payload.rightGap, 0)),
      side_stile_height_mode: String(payload.side_stile_height_mode ?? payload.sideStileHeightMode ?? "equal"),
      manual_side_stile_length: Math.max(0, toNumber(payload.manual_side_stile_length ?? payload.manualSideStileLength, 0)),
      middle_rail_enabled: normalizeBoolean(payload.middle_rail_enabled ?? payload.middleRailEnabled ?? false),
      middle_rail_count: Math.max(0, Math.round(toNumber(payload.middle_rail_count ?? payload.middleRailCount, 0))),
      middle_rail_size: Math.max(0, toNumber(payload.middle_rail_size ?? payload.middleRailSize, 70)),
      middle_rail_position_type: String(payload.middle_rail_position_type ?? payload.middleRailPositionType ?? "center"),
      middle_rail_top_offset: Math.max(0, toNumber(payload.middle_rail_top_offset ?? payload.middleRailTopOffset, 0)),
      middle_rail_bottom_offset: Math.max(0, toNumber(payload.middle_rail_bottom_offset ?? payload.middleRailBottomOffset, 0)),
      slat_thickness: Math.max(1, toNumber(payload.slat_thickness ?? payload.slatThickness, 8)),
      cover_direction: String(payload.cover_direction ?? payload.coverDirection ?? "vertical"),
      material_type: String(payload.material_type ?? payload.materialType ?? "MDF"),
      cover_thickness: Math.max(0, toNumber(payload.cover_thickness ?? payload.coverThickness, 18)),
      finish_type: String(payload.finish_type ?? payload.finishType ?? "lake"),
      cover_type: String(payload.cover_type ?? payload.coverType ?? "Panjur Kapak"),
    };

    const items = Array.isArray(payload.items) ? payload.items : [];
    const sideStiles = [];
    const middleRails = [];
    const slatCuts = [];
    const drillDrawings = [];
    const cutList = [];

    const normalizedItems = items.map((item, index) => {
      const width = Math.max(0, toNumber(item.width_mm ?? item.widthMm, 0));
      const height = Math.max(0, toNumber(item.height_mm ?? item.heightMm, 0));
      const quantity = Math.max(1, Math.round(toNumber(item.quantity, 1)));
      const hasMiddleRail = normalizeBoolean(item.has_middle_rail ?? item.hasMiddleRail ?? settings.middle_rail_enabled);
      const middleRailCount = hasMiddleRail
        ? Math.max(1, Math.round(toNumber(item.middle_rail_count ?? item.middleRailCount, settings.middle_rail_count || 1)))
        : 0;
      const middleRailSize = hasMiddleRail
        ? Math.max(0, toNumber(item.middle_rail_size ?? item.middleRailSize, settings.middle_rail_size))
        : 0;
      const materialType = String(item.material_type ?? item.materialType ?? settings.material_type).trim();
      const itemName = String(item.item_name ?? item.itemName ?? `Kapak ${index + 1}`).trim();
      const note = String(item.note || item.production_note || item.productionNote || "").trim();
      const m2 = calculateItemM2(width, height, quantity);
      const sideLength = resolveSideStileLength(height, settings);
      const railLength = Math.max(0, width - settings.left_side_stile_width - settings.right_side_stile_width - settings.left_gap - settings.right_gap);

      const positions = hasMiddleRail
        ? resolveMiddleRailPositions({
          ...item,
          height_mm: height,
          middle_rail_count: middleRailCount,
        }, settings)
        : [];

      const normalized = {
        item_name: itemName,
        itemName,
        width_mm: width,
        widthMm: width,
        height_mm: height,
        heightMm: height,
        quantity,
        has_middle_rail: hasMiddleRail ? 1 : 0,
        hasMiddleRail: hasMiddleRail ? 1 : 0,
        middle_rail_count: middleRailCount,
        middleRailCount,
        middle_rail_size: middleRailSize,
        middleRailSize,
        middle_rail_position_type: String(item.middle_rail_position_type ?? item.middleRailPositionType ?? settings.middle_rail_position_type ?? "center"),
        middleRailPositionType: String(item.middle_rail_position_type ?? item.middleRailPositionType ?? settings.middle_rail_position_type ?? "center"),
        middle_rail_position_value: Math.max(0, toNumber(item.middle_rail_position_value ?? item.middleRailPositionValue, 0)),
        middleRailPositionValue: Math.max(0, toNumber(item.middle_rail_position_value ?? item.middleRailPositionValue, 0)),
        note,
        m2,
        material_type: materialType,
        materialType,
        color: String(item.color || "").trim(),
      };

      sideStiles.push(
        {
          item_name: itemName,
          cut_type: "side_stile_left",
          side: "Sol",
          width_mm: settings.left_side_stile_width,
          length_mm: sideLength,
          thickness_mm: settings.cover_thickness,
          quantity,
          material_type: materialType,
          color: String(item.color || "").trim(),
          note: note || "Sol yan seren",
        },
        {
          item_name: itemName,
          cut_type: "side_stile_right",
          side: "Sag",
          width_mm: settings.right_side_stile_width,
          length_mm: sideLength,
          thickness_mm: settings.cover_thickness,
          quantity,
          material_type: materialType,
          color: String(item.color || "").trim(),
          note: note || "Sag yan seren",
        }
      );

      cutList.push(
        {
          item_name: itemName,
          cut_type: "side_stile_left",
          part_name: "Sol Yan Seren",
          length_mm: round(sideLength, 2),
          width_mm: round(settings.left_side_stile_width, 2),
          thickness_mm: round(settings.cover_thickness, 2),
          quantity,
          material_type: materialType,
          color: String(item.color || "").trim(),
          source_width_mm: width,
          source_height_mm: height,
          note: note || "",
        },
        {
          item_name: itemName,
          cut_type: "side_stile_right",
          part_name: "Sag Yan Seren",
          length_mm: round(sideLength, 2),
          width_mm: round(settings.right_side_stile_width, 2),
          thickness_mm: round(settings.cover_thickness, 2),
          quantity,
          material_type: materialType,
          color: String(item.color || "").trim(),
          source_width_mm: width,
          source_height_mm: height,
          note: note || "",
        }
      );

      positions.forEach((position, positionIndex) => {
        middleRails.push({
          item_name: itemName,
          line_no: positionIndex + 1,
          position_mm: position,
          size_mm: middleRailSize,
          length_mm: round(railLength, 2),
          quantity,
          material_type: materialType,
          color: String(item.color || "").trim(),
          note: note || "",
        });
        cutList.push({
          item_name: itemName,
          cut_type: "middle_rail",
          part_name: `Ara Kayit ${positionIndex + 1}`,
          length_mm: round(railLength, 2),
          width_mm: round(middleRailSize, 2),
          thickness_mm: round(settings.cover_thickness, 2),
          quantity,
          material_type: materialType,
          color: String(item.color || "").trim(),
          source_width_mm: width,
          source_height_mm: height,
          note: `Konum: ${position} mm`,
        });
      });

      const slatData = calculateSlatCuts({
        ...item,
        width_mm: width,
        height_mm: height,
        quantity,
        material_type: materialType,
      }, settings);
      slatData.cuts.forEach((cut) => {
        slatCuts.push({ item_name: itemName, color: String(item.color || "").trim(), ...cut });
        cutList.push({ item_name: itemName, color: String(item.color || "").trim(), source_width_mm: width, source_height_mm: height, ...cut });
      });

      drillDrawings.push({
        item_name: itemName,
        width_mm: width,
        height_mm: height,
        quantity,
        top_hole_mm: round(Math.max(35, settings.top_gap + 35), 2),
        bottom_hole_mm: round(Math.max(35, settings.bottom_gap + 35), 2),
        note: note || "Standart delik cizimi",
      });

      return normalized;
    });

    const totalQuantity = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalM2 = round(normalizedItems.reduce((sum, item) => sum + item.m2, 0));
    const wasteRate = Math.max(0, toNumber(payload.waste_rate ?? payload.wasteRate, DEFAULT_WASTE_RATE));

    return {
      settings,
      items: normalizedItems,
      sideStiles,
      middleRails,
      slatCuts,
      drillDrawings,
      cutList,
      summary: {
        total_quantity: totalQuantity,
        total_m2: totalM2,
        gross_m2: round(totalM2 + (totalM2 * (wasteRate / 100))),
        cover_type: settings.cover_type,
        cover_thickness: settings.cover_thickness,
        slat_thickness: settings.slat_thickness,
        finish_type: settings.finish_type,
      },
    };
  }

  function groupCutItemsByType(cutList = []) {
    return cutList.reduce((groups, item) => {
      const key = item.cut_type || "other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});
  }

  function buildPreviewSvg(calculated = {}) {
    const items = calculated.items || [];
    if (!items.length) {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#f8fafc"/><text x="320" y="180" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="18">Kapak olculeri eklendikce onizleme burada olusur</text></svg>`;
    }

    const first = items[0];
    const width = Math.max(100, toNumber(first.width_mm, 0));
    const height = Math.max(100, toNumber(first.height_mm, 0));
    const settings = calculated.settings || {};
    const svgWidth = 640;
    const svgHeight = 420;
    const margin = 70;
    const scale = Math.min((svgWidth - (margin * 2)) / width, (svgHeight - (margin * 2)) / height);
    const bodyWidth = width * scale;
    const bodyHeight = height * scale;
    const x = (svgWidth - bodyWidth) / 2;
    const y = (svgHeight - bodyHeight) / 2;
    const leftStile = toNumber(settings.left_side_stile_width, 0) * scale;
    const rightStile = toNumber(settings.right_side_stile_width, 0) * scale;
    const topGap = toNumber(settings.top_gap, 0) * scale;
    const bottomGap = toNumber(settings.bottom_gap, 0) * scale;
    const leftGap = toNumber(settings.left_gap, 0) * scale;
    const rightGap = toNumber(settings.right_gap, 0) * scale;
    const positions = resolveMiddleRailPositions(first, settings).map((value) => y + (value * scale));

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}">
        <rect width="${svgWidth}" height="${svgHeight}" fill="#f8fafc"/>
        <rect x="${x}" y="${y}" width="${bodyWidth}" height="${bodyHeight}" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        <rect x="${x}" y="${y}" width="${leftStile}" height="${bodyHeight}" fill="#dbeafe" stroke="#1d4ed8"/>
        <rect x="${x + bodyWidth - rightStile}" y="${y}" width="${rightStile}" height="${bodyHeight}" fill="#dbeafe" stroke="#1d4ed8"/>
        <line x1="${x + leftGap}" y1="${y}" x2="${x + leftGap}" y2="${y + bodyHeight}" stroke="#f97316" stroke-dasharray="6 4"/>
        <line x1="${x + bodyWidth - rightGap}" y1="${y}" x2="${x + bodyWidth - rightGap}" y2="${y + bodyHeight}" stroke="#f97316" stroke-dasharray="6 4"/>
        <line x1="${x}" y1="${y + topGap}" x2="${x + bodyWidth}" y2="${y + topGap}" stroke="#fb923c" stroke-dasharray="6 4"/>
        <line x1="${x}" y1="${y + bodyHeight - bottomGap}" x2="${x + bodyWidth}" y2="${y + bodyHeight - bottomGap}" stroke="#fb923c" stroke-dasharray="6 4"/>
        ${positions.map((position, index) => `
          <rect x="${x + leftStile}" y="${position - 4}" width="${bodyWidth - leftStile - rightStile}" height="8" fill="#93c5fd" stroke="#1d4ed8"/>
          <text x="${x + bodyWidth + 12}" y="${position + 4}" font-family="Arial" font-size="12" fill="#1e293b">Ara Kayit ${index + 1}</text>
        `).join("")}
        <line x1="${x}" y1="${y + bodyHeight + 28}" x2="${x + bodyWidth}" y2="${y + bodyHeight + 28}" stroke="#0f172a"/>
        <line x1="${x}" y1="${y + bodyHeight + 20}" x2="${x}" y2="${y + bodyHeight + 36}" stroke="#0f172a"/>
        <line x1="${x + bodyWidth}" y1="${y + bodyHeight + 20}" x2="${x + bodyWidth}" y2="${y + bodyHeight + 36}" stroke="#0f172a"/>
        <text x="${x + (bodyWidth / 2)}" y="${y + bodyHeight + 52}" text-anchor="middle" font-family="Arial" font-size="13" fill="#0f172a">${width} mm</text>
        <line x1="${x - 28}" y1="${y}" x2="${x - 28}" y2="${y + bodyHeight}" stroke="#0f172a"/>
        <line x1="${x - 20}" y1="${y}" x2="${x - 36}" y2="${y}" stroke="#0f172a"/>
        <line x1="${x - 20}" y1="${y + bodyHeight}" x2="${x - 36}" y2="${y + bodyHeight}" stroke="#0f172a"/>
        <text x="${x - 42}" y="${y + (bodyHeight / 2)}" text-anchor="middle" transform="rotate(-90 ${x - 42} ${y + (bodyHeight / 2)})" font-family="Arial" font-size="13" fill="#0f172a">${height} mm</text>
        <text x="${x + 12}" y="${y - 16}" font-family="Arial" font-size="12" fill="#1d4ed8">Sol Seren ${toNumber(settings.left_side_stile_width, 0)} mm</text>
        <text x="${x + bodyWidth - 12}" y="${y - 16}" text-anchor="end" font-family="Arial" font-size="12" fill="#1d4ed8">Sag Seren ${toNumber(settings.right_side_stile_width, 0)} mm</text>
      </svg>
    `;
  }

  window.PanjurCalculations = {
    calculateItemM2,
    resolveSideStileLength,
    resolveMiddleRailPositions,
    calculateSlatCuts,
    calculatePanjurJob,
    validateCncHoleLayout,
    calculateCncHoleLayout,
    buildCncPreviewSvg,
    groupCutItemsByType,
    buildPreviewSvg,
    resolveCncHolePositions,
    toNumber,
    round,
    normalizeBoolean,
  };
})();
