"use client";

import { useFormContext } from "react-hook-form";

import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/ui/section-card";
import { Textarea } from "@/components/ui/textarea";
import type { ProposalFormValues } from "@/lib/proposal-schema";

export function ProjectSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProposalFormValues>();

  return (
    <SectionCard title="Présentation du projet">
      <FormField
        label="Intitulé du projet"
        htmlFor="project.title"
        required
        error={errors.project?.title?.message}
      >
        <Input id="project.title" {...register("project.title")} />
      </FormField>
      <FormField label="Contexte ou besoin du client" htmlFor="project.context">
        <Textarea id="project.context" rows={5} {...register("project.context")} />
      </FormField>
      <FormField label="Objectifs du projet" htmlFor="project.objectives">
        <Textarea id="project.objectives" rows={5} {...register("project.objectives")} />
      </FormField>
      <FormField label="Délai estimatif" htmlFor="project.timeline">
        <Input id="project.timeline" placeholder="ex. 6 à 8 semaines" {...register("project.timeline")} />
      </FormField>
    </SectionCard>
  );
}
