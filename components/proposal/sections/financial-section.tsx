"use client";

import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { SegmentedToggle } from "@/components/ui/segmented-toggle";
import { Select } from "@/components/ui/select";
import { ToggleField } from "@/components/ui/toggle-field";
import type { ProposalTotals } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { numberFieldOptions } from "@/lib/form-helpers";
import type { ProposalFormValues } from "@/lib/proposal-schema";

function SummaryRow({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={emphasis ? "font-semibold text-foreground" : "text-muted-foreground"}>
        {label}
      </dt>
      <dd className={emphasis ? "font-semibold text-foreground" : "text-foreground"}>
        {formatCurrency(value)}
      </dd>
    </div>
  );
}

export function FinancialSection({ totals }: { totals: ProposalTotals }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProposalFormValues>();
  const discountType = watch("financial.discountType");
  const showPriceDetails = watch("financial.showPriceDetails");

  return (
    <SectionCard title="Récapitulatif financier">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Type de remise" htmlFor="financial.discountType">
          <Select id="financial.discountType" {...register("financial.discountType")}>
            <option value="percent">Pourcentage (%)</option>
            <option value="amount">Montant (MAD)</option>
          </Select>
        </FormField>
        <FormField
          label={discountType === "amount" ? "Remise (MAD)" : "Remise (%)"}
          htmlFor="financial.discountValue"
          error={errors.financial?.discountValue?.message}
        >
          <Input
            id="financial.discountValue"
            type="number"
            min={0}
            step={0.01}
            {...register("financial.discountValue", numberFieldOptions())}
          />
        </FormField>
        <FormField
          label="Taux de TVA (%)"
          htmlFor="financial.tvaRate"
          error={errors.financial?.tvaRate?.message}
        >
          <Input
            id="financial.tvaRate"
            type="number"
            min={0}
            max={100}
            step={0.1}
            {...register("financial.tvaRate", numberFieldOptions())}
          />
        </FormField>
        <FormField
          label="Acompte (MAD)"
          htmlFor="financial.depositAmount"
          error={errors.financial?.depositAmount?.message}
        >
          <Input
            id="financial.depositAmount"
            type="number"
            min={0}
            step={0.01}
            {...register("financial.depositAmount", numberFieldOptions())}
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-4 border-t border-border pt-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-foreground">Affichage des prix dans le PDF</span>
          <SegmentedToggle
            label="Affichage des prix dans le PDF"
            value={showPriceDetails ? "detailed" : "global"}
            onChange={(value) => setValue("financial.showPriceDetails", value === "detailed")}
            options={[
              { value: "detailed", label: "Prix détaillés" },
              { value: "global", label: "Montant global" },
            ]}
          />
        </div>
        <ToggleField
          label="Afficher les options non incluses comme possibilités futures"
          description="Ajoute une liste des options non incluses dans le PDF, à titre indicatif."
          {...register("financial.showFutureOptionsInPdf")}
        />
      </div>

      <dl
        id="financial-summary"
        className="flex flex-col gap-2 rounded-lg bg-muted/60 p-4 text-sm"
      >
        <SummaryRow label="Offre principale" value={totals.servicesSubtotal} />
        <SummaryRow label="Options incluses" value={totals.optionsTotal} />
        <SummaryRow label="Remise" value={-totals.discountAmount} />
        <div className="border-t border-border pt-2">
          <SummaryRow label="Total HT" value={totals.totalHT} emphasis />
        </div>
        <SummaryRow label="TVA" value={totals.tvaAmount} />
        <SummaryRow label="Total TTC" value={totals.totalTTC} emphasis />
        <SummaryRow label="Acompte" value={totals.depositAmount} />
        <SummaryRow label="Solde" value={totals.balanceDue} emphasis />
      </dl>
    </SectionCard>
  );
}
