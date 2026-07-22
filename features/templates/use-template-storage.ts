"use client";

import { useCallback, useEffect, useState } from "react";

import { templateStorage } from "@/features/templates/services/template-storage";
import type { ProposalTemplate } from "@/features/templates/types";

export function useTemplateStorage() {
  const [templates, setTemplates] = useState<ProposalTemplate[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refresh = useCallback(() => {
    setTemplates(templateStorage.getAll());
  }, []);

  useEffect(() => {
    // Same rationale as use-catalog-storage.ts: reading localStorage here
    // (rather than during the initial render) avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    setIsReady(true);
  }, [refresh]);

  const add = useCallback<typeof templateStorage.add>(
    (input) => {
      const template = templateStorage.add(input);
      refresh();
      return template;
    },
    [refresh]
  );

  const update = useCallback<typeof templateStorage.update>(
    (id, patch) => {
      const template = templateStorage.update(id, patch);
      refresh();
      return template;
    },
    [refresh]
  );

  const duplicate = useCallback<typeof templateStorage.duplicate>(
    (id) => {
      const template = templateStorage.duplicate(id);
      refresh();
      return template;
    },
    [refresh]
  );

  const remove = useCallback<typeof templateStorage.remove>(
    (id) => {
      templateStorage.remove(id);
      refresh();
    },
    [refresh]
  );

  return { templates, isReady, add, update, duplicate, remove, refresh };
}
