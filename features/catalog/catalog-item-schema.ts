import { z } from "zod";

export const catalogItemFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  category: z.string().min(1, "La catégorie est requise."),
  shortDescription: z.string(),
  pdfDescription: z.string(),
  recommendedPrice: z.number().min(0, "Le prix ne peut pas être négatif."),
  unit: z.enum(["fixed", "page", "month", "year", "item"]),
  isActive: z.boolean(),
});

export type CatalogItemFormValues = z.infer<typeof catalogItemFormSchema>;
