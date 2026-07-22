"use client";

import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import type { ProposalFormValues } from "@/lib/proposal-schema";

export function ClientSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProposalFormValues>();

  return (
    <SectionCard title="Informations du client">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Nom du client"
          htmlFor="client.name"
          required
          error={errors.client?.name?.message}
        >
          <Input id="client.name" {...register("client.name")} />
        </FormField>
        <FormField
          label="Société ou cabinet"
          htmlFor="client.company"
          required
          error={errors.client?.company?.message}
        >
          <Input id="client.company" {...register("client.company")} />
        </FormField>
        <FormField label="Email" htmlFor="client.email" error={errors.client?.email?.message}>
          <Input id="client.email" type="email" {...register("client.email")} />
        </FormField>
        <FormField label="Téléphone" htmlFor="client.phone">
          <Input id="client.phone" {...register("client.phone")} />
        </FormField>
        <FormField label="Adresse" htmlFor="client.address" className="sm:col-span-2">
          <Input id="client.address" {...register("client.address")} />
        </FormField>
        <FormField label="Date du devis" htmlFor="client.quoteDate">
          <Input id="client.quoteDate" type="date" {...register("client.quoteDate")} />
        </FormField>
        <FormField label="Durée de validité" htmlFor="client.validityPeriod">
          <Input
            id="client.validityPeriod"
            placeholder="ex. 30 jours"
            {...register("client.validityPeriod")}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
