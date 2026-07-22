export function numberFieldOptions() {
  return {
    setValueAs: (value: unknown): number => {
      if (value === "" || value === null || value === undefined) return 0;
      const parsed = typeof value === "number" ? value : Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    },
  };
}
