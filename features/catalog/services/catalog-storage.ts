import type { CatalogItem } from "@/features/catalog/types";

type NewCatalogItemInput = Omit<CatalogItem, "id" | "order" | "createdAt" | "updatedAt">;
type SeedCatalogItemInput = Omit<CatalogItem, "order" | "createdAt" | "updatedAt">;

export interface CatalogStorage {
  getAll(): CatalogItem[];
  getActive(): CatalogItem[];
  getById(id: string): CatalogItem | undefined;
  getByIds(ids: string[]): CatalogItem[];
  add(input: NewCatalogItemInput): CatalogItem;
  update(id: string, patch: Partial<NewCatalogItemInput>): CatalogItem | undefined;
  duplicate(id: string): CatalogItem | undefined;
  remove(id: string): void;
  setActive(id: string, isActive: boolean): void;
  reorder(id: string, direction: "up" | "down"): void;
  resetToDefaults(): void;
  /**
   * Idempotently makes sure an item with this exact id exists, appending it
   * if missing — used to introduce a new seed item (with a stable,
   * referenceable id) into libraries that were already seeded before it
   * existed, without ever creating a duplicate.
   */
  ensureItem(input: SeedCatalogItemInput): CatalogItem;
}

function nowISO(): string {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${random}`;
}

function readAll(storageKey: string, defaults: CatalogItem[]): CatalogItem[] {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      window.localStorage.setItem(storageKey, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaults;
    return parsed as CatalogItem[];
  } catch {
    return defaults;
  }
}

function writeAll(storageKey: string, items: CatalogItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(items));
}

/**
 * Generic localStorage-backed CRUD layer shared by the services and options
 * libraries — they have identical shapes, so one factory covers both.
 */
export function createCatalogStorage(
  storageKey: string,
  defaultItems: CatalogItem[],
  idPrefix: string
): CatalogStorage {
  function getAll(): CatalogItem[] {
    return [...readAll(storageKey, defaultItems)].sort((a, b) => a.order - b.order);
  }

  function getActive(): CatalogItem[] {
    return getAll().filter((item) => item.isActive);
  }

  function getById(id: string): CatalogItem | undefined {
    return getAll().find((item) => item.id === id);
  }

  function getByIds(ids: string[]): CatalogItem[] {
    const all = getAll();
    return ids
      .map((id) => all.find((item) => item.id === id))
      .filter((item): item is CatalogItem => Boolean(item));
  }

  function add(input: NewCatalogItemInput): CatalogItem {
    const items = getAll();
    const timestamp = nowISO();
    const item: CatalogItem = {
      ...input,
      id: generateId(idPrefix),
      order: items.length,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    writeAll(storageKey, [...items, item]);
    return item;
  }

  function update(id: string, patch: Partial<NewCatalogItemInput>): CatalogItem | undefined {
    const items = getAll();
    let updated: CatalogItem | undefined;
    const next = items.map((item) => {
      if (item.id !== id) return item;
      updated = { ...item, ...patch, updatedAt: nowISO() };
      return updated;
    });
    writeAll(storageKey, next);
    return updated;
  }

  function duplicate(id: string): CatalogItem | undefined {
    const source = getById(id);
    if (!source) return undefined;
    return add({
      name: `${source.name} (copie)`,
      category: source.category,
      shortDescription: source.shortDescription,
      pdfDescription: source.pdfDescription,
      recommendedPrice: source.recommendedPrice,
      unit: source.unit,
      isActive: source.isActive,
    });
  }

  function remove(id: string): void {
    const items = getAll().filter((item) => item.id !== id);
    writeAll(storageKey, items);
  }

  function setActive(id: string, isActive: boolean): void {
    update(id, { isActive });
  }

  function reorder(id: string, direction: "up" | "down"): void {
    const items = getAll();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    const withOrder = reordered.map((item, orderIndex) => ({ ...item, order: orderIndex }));
    writeAll(storageKey, withOrder);
  }

  function resetToDefaults(): void {
    writeAll(storageKey, defaultItems);
  }

  function ensureItem(input: SeedCatalogItemInput): CatalogItem {
    const items = getAll();
    const existing = items.find((item) => item.id === input.id);
    if (existing) return existing;

    const timestamp = nowISO();
    const item: CatalogItem = {
      ...input,
      order: items.length,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    writeAll(storageKey, [...items, item]);
    return item;
  }

  return {
    getAll,
    getActive,
    getById,
    getByIds,
    add,
    update,
    duplicate,
    remove,
    setActive,
    reorder,
    resetToDefaults,
    ensureItem,
  };
}
