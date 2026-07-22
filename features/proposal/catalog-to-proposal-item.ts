import type { CatalogItem } from "@/features/catalog/types";
import type { OptionItem, ServiceItem } from "@/lib/proposal-schema";

function resolveDescription(item: CatalogItem): string {
  return item.pdfDescription || item.shortDescription;
}

export function catalogItemToServiceItem(item: CatalogItem): ServiceItem {
  return {
    name: item.name,
    description: resolveDescription(item),
    quantity: 1,
    unitPrice: item.recommendedPrice,
    catalogId: item.id,
  };
}

export function catalogItemToOptionItem(item: CatalogItem, selected: boolean): OptionItem {
  return {
    selected,
    name: item.name,
    description: resolveDescription(item),
    price: item.recommendedPrice,
    catalogId: item.id,
  };
}
