export const bankText = {
  title: "Bank Loans",
  subline: (name: string) => `Manage your loans for ${name}`,
  emptyDescription: "Pick or create a playthrough to track its loans.",
  loanTitle: (number: number) => `Loan #${number}`,
  states: { active: "Active", available: "Available", locked: "Locked" },
  principal: "Principal Amount",
  rate: "Daily Interest Rate",
  level: "Store Level Required",
  term: (days: number) => `Term Length: ${days} days`,
  days: (days: number) => `${days} days`,
  termFixed: "The term is fixed until the loan is removed.",
  details: "Loan Details",
  totalInterest: "Total Interest",
  totalPayment: "Total Payment",
  dailyPayment: "Daily Payment",
  activate: "Activate Loan",
  activatedOn: (date: string) => `Activated on: ${date}`,
  remove: "Remove loan",
  requiresLevel: (level: number, current: number) =>
    `Requires store level ${level} (you are level ${current})`,
  locked: "Locked",
  activated: (number: number) => `Loan #${number} activated`,
  removed: (number: number) => `Loan #${number} removed`,
  undo: "Undo",
  yourLoans: {
    title: "Your loans",
    activeLoans: "Active loans",
    dailyPayment: "Daily payment",
    totalDebt: "Total loan debt",
    none: "No active loans. Pick a term on a loan below and activate it.",
    line: (principal: string, rate: string, days: number) =>
      `${principal} at ${rate} a day for ${days} days`,
    payments: (daily: string, total: string) =>
      `${daily} a day · ${total} in total`,
    formula:
      "Interest is the principal times the daily rate times the term in days.",
  },
} as const;
