import { z } from "zod";

import { computeTotals } from "@/lib/calculations";

export const serviceItemSchema = z.object({
  name: z.string().min(1, "Le nom de la prestation est requis."),
  description: z.string(),
  quantity: z.number().min(0.01, "La quantité doit être supérieure à 0."),
  unitPrice: z.number().min(0, "Le prix ne peut pas être négatif."),
});

export const optionItemSchema = z.object({
  selected: z.boolean(),
  name: z.string().min(1, "Le nom de l'option est requis."),
  description: z.string(),
  price: z.number().min(0, "Le prix ne peut pas être négatif."),
});

export const clientSchema = z.object({
  name: z.string().min(1, "Le nom du client est requis."),
  company: z.string().min(1, "La société ou le cabinet est requis."),
  email: z.union([z.literal(""), z.string().email("Adresse email invalide.")]),
  phone: z.string(),
  address: z.string(),
  quoteDate: z.string(),
  validityPeriod: z.string(),
});

export const projectSchema = z.object({
  title: z.string().min(1, "L'intitulé du projet est requis."),
  context: z.string(),
  objectives: z.string(),
  timeline: z.string(),
});

export const financialSchema = z.object({
  discountType: z.enum(["percent", "amount"]),
  discountValue: z.number().min(0, "La remise ne peut pas être négative."),
  tvaRate: z
    .number()
    .min(0, "La TVA doit être comprise entre 0 et 100.")
    .max(100, "La TVA doit être comprise entre 0 et 100."),
  depositAmount: z.number().min(0, "L'acompte ne peut pas être négatif."),
  showPriceDetails: z.boolean(),
  showFutureOptionsInPdf: z.boolean(),
});

export const termsSchema = z.object({
  completionTime: z.string(),
  paymentTerms: z.string(),
  revisionsIncluded: z.string(),
  hostingDuration: z.string(),
  maintenanceSupport: z.string(),
  additionalNotes: z.string(),
});

export const proposalSchema = z
  .object({
    client: clientSchema,
    project: projectSchema,
    services: z.array(serviceItemSchema),
    options: z.array(optionItemSchema),
    financial: financialSchema,
    terms: termsSchema,
  })
  .superRefine((data, ctx) => {
    const totals = computeTotals(data.services, data.options, data.financial);
    if (data.financial.depositAmount > totals.totalTTC) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "L'acompte ne peut pas dépasser le total TTC.",
        path: ["financial", "depositAmount"],
      });
    }
  });

export type ClientValues = z.infer<typeof clientSchema>;
export type ProjectValues = z.infer<typeof projectSchema>;
export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type OptionItem = z.infer<typeof optionItemSchema>;
export type FinancialValues = z.infer<typeof financialSchema>;
export type TermsValues = z.infer<typeof termsSchema>;
export type ProposalFormValues = z.infer<typeof proposalSchema>;
