import { z } from "zod";

export const templateFormSchema = z.object({
  name: z.string().min(1, "Le nom du modèle est requis."),
  sector: z.string().min(1, "Le secteur est requis."),
  projectTitle: z.string(),
  projectContext: z.string(),
  projectObjectives: z.string(),
  timeline: z.string(),
  terms: z.object({
    paymentTerms: z.string(),
    revisionsIncluded: z.string(),
    hostingDuration: z.string(),
    maintenanceSupport: z.string(),
    additionalNotes: z.string(),
  }),
  financialDefaults: z.object({
    tvaRate: z.number().min(0, "La TVA doit être comprise entre 0 et 100.").max(100, "La TVA doit être comprise entre 0 et 100."),
    depositType: z.enum(["amount", "percent"]),
    depositValue: z.number().min(0, "L'acompte recommandé ne peut pas être négatif."),
    showPriceDetails: z.boolean(),
  }),
});

export type TemplateFormValues = z.infer<typeof templateFormSchema>;
