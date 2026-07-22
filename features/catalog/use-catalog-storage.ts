"use client";

import { useCallback, useEffect, useState } from "react";

import type { CatalogStorage } from "@/features/catalog/services/catalog-storage";
import type { CatalogItem } from "@/features/catalog/types";

/**
 * Bridges a CatalogStorage (services or options library, same shape) into
 * React state so components re-render after mutations.
 */
export function useCatalogStorage(storage: CatalogStorage) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(() => {
    setItems(storage.getAll());
  }, [storage]);

  useEffect(() => {
    // Reading localStorage during the initial render (instead of here)
    // would make the client's first render diverge from the server-rendered
    // markup and trigger a hydration mismatch — this effect is the
    // synchronization point with that external system, by design.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsReady(true);
  }, [refresh]);

  const add = useCallback<CatalogStorage["add"]>(
    (input) => {
      const item = storage.add(input);
      refresh();
      return item;
    },
    [storage, refresh]
  );

  const update = useCallback<CatalogStorage["update"]>(
    (id, patch) => {
      const item = storage.update(id, patch);
      refresh();
      return item;
    },
    [storage, refresh]
  );

  const duplicate = useCallback<CatalogStorage["duplicate"]>(
    (id) => {
      const item = storage.duplicate(id);
      refresh();
      return item;
    },
    [storage, refresh]
  );

  const remove = useCallback<CatalogStorage["remove"]>(
    (id) => {
      storage.remove(id);
      refresh();
    },
    [storage, refresh]
  );

  const setActive = useCallback<CatalogStorage["setActive"]>(
    (id, isActive) => {
      storage.setActive(id, isActive);
      refresh();
    },
    [storage, refresh]
  );

  const reorder = useCallback<CatalogStorage["reorder"]>(
    (id, direction) => {
      storage.reorder(id, direction);
      refresh();
    },
    [storage, refresh]
  );

  const resetToDefaults = useCallback(() => {
    storage.resetToDefaults();
    refresh();
  }, [storage, refresh]);

  return { items, isReady, add, update, duplicate, remove, setActive, reorder, resetToDefaults, refresh };
}
