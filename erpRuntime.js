(function () {
  function sortRecordsByCreatedAt(records) {
    if (!Array.isArray(records)) return [];
    return [...records].sort((left, right) => {
      const leftTime = getRecordTimestamp(left);
      const rightTime = getRecordTimestamp(right);
      return rightTime - leftTime;
    });
  }

  function getRecordTimestamp(record = {}) {
    const candidates = [
      record.createdAt,
      record.created_at,
      record.updatedAt,
      record.updated_at,
      record.orderDate,
      record.order_date,
      record.date,
    ];
    for (const candidate of candidates) {
      if (typeof candidate === "number" && Number.isFinite(candidate)) {
        return candidate;
      }
      const parsed = Date.parse(candidate || "");
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return 0;
  }

  async function loadStoreEntries(entries, loader, onError) {
    const settledEntries = await Promise.all(entries.map(async ([key, storeName]) => {
      try {
        const rows = await loader(storeName);
        return [key, Array.isArray(rows) ? rows : []];
      } catch (error) {
        if (typeof onError === "function") {
          onError(key, storeName, error);
        }
        return [key, []];
      }
    }));
    return Object.fromEntries(settledEntries);
  }

  function runRenderQueue(steps, onError) {
    for (const [label, render] of steps) {
      try {
        render();
      } catch (error) {
        if (typeof onError === "function") {
          onError(label, error);
        }
      }
    }
  }

  function registerGlobalDiagnostics(notify) {
    window.addEventListener("error", (event) => {
      if (typeof notify === "function") {
        notify("window-error", event.error || event.message || "Bilinmeyen istemci hatasi");
      }
    });
    window.addEventListener("unhandledrejection", (event) => {
      if (typeof notify === "function") {
        notify("unhandled-rejection", event.reason || "Beklenmeyen promise hatasi");
      }
    });
  }

  window.erpRuntime = {
    loadStoreEntries,
    registerGlobalDiagnostics,
    runRenderQueue,
    sortRecordsByCreatedAt,
  };
})();
