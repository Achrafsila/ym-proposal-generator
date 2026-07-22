export interface ServiceLike {
  quantity: number;
  unitPrice: number;
}

export interface OptionLike {
  selected: boolean;
  price: number;
}

export interface FinancialLike {
  discountType: "percent" | "amount";
  discountValue: number;
  tvaRate: number;
  depositAmount: number;
}

export interface ProposalTotals {
  servicesSubtotal: number;
  optionsTotal: number;
  baseHT: number;
  discountAmount: number;
  totalHT: number;
  tvaAmount: number;
  totalTTC: number;
  depositAmount: number;
  balanceDue: number;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function computeServiceTotal(service: ServiceLike): number {
  return round2(Math.max(0, service.quantity) * Math.max(0, service.unitPrice));
}

export function computeTotals(
  services: ServiceLike[],
  options: OptionLike[],
  financial: FinancialLike
): ProposalTotals {
  const servicesSubtotal = round2(
    services.reduce((sum, service) => sum + computeServiceTotal(service), 0)
  );
  const optionsTotal = round2(
    options
      .filter((option) => option.selected)
      .reduce((sum, option) => sum + Math.max(0, option.price), 0)
  );
  const baseHT = round2(servicesSubtotal + optionsTotal);

  const discountAmount = round2(
    financial.discountType === "percent"
      ? baseHT * (clamp(financial.discountValue, 0, 100) / 100)
      : Math.min(Math.max(financial.discountValue, 0), baseHT)
  );

  const totalHT = round2(Math.max(0, baseHT - discountAmount));
  const tvaAmount = round2(totalHT * (clamp(financial.tvaRate, 0, 100) / 100));
  const totalTTC = round2(totalHT + tvaAmount);
  const depositAmount = round2(clamp(financial.depositAmount, 0, totalTTC));
  const balanceDue = round2(Math.max(0, totalTTC - depositAmount));

  return {
    servicesSubtotal,
    optionsTotal,
    baseHT,
    discountAmount,
    totalHT,
    tvaAmount,
    totalTTC,
    depositAmount,
    balanceDue,
  };
}
