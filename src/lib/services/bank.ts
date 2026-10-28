import type { Loan } from "@/types";
import type { ActiveLoan, AppData, Playthrough } from "@/types/playthrough";
import { bank } from "@/data/supermarket-simulator/bank";
import { changePlaythrough } from "./appData";

export const loanDetails = (loan: Loan, termLength: number) => {
  const totalInterest = loan.originalAmount * loan.dailyInterest * termLength;
  const totalPayment = loan.originalAmount + totalInterest;
  return {
    totalInterest,
    totalPayment,
    dailyPayment: totalPayment / termLength,
  };
};

export interface ActiveLoanEntry {
  entry: ActiveLoan;
  loan: Loan;
  details: ReturnType<typeof loanDetails>;
}

/** Entries whose `loanIndex` no longer matches a loan stay in storage and are left out here. */
export const activeLoanEntries = (
  playthrough: Playthrough,
): ActiveLoanEntry[] =>
  (playthrough.activeLoans ?? []).flatMap((entry) => {
    const loan = bank.loans[entry.loanIndex];
    return loan
      ? [{ entry, loan, details: loanDetails(loan, entry.termLength) }]
      : [];
  });

export const loanTotals = (playthrough: Playthrough) => {
  const entries = activeLoanEntries(playthrough);
  return {
    active: entries.length,
    dailyPayment: entries.reduce(
      (sum, { details }) => sum + details.dailyPayment,
      0,
    ),
    totalDebt: entries.reduce(
      (sum, { details }) => sum + details.totalPayment,
      0,
    ),
  };
};

export const activateLoan = (
  current: AppData,
  playthroughId: string,
  loanIndex: number,
  termLength: number,
  now = new Date(),
): AppData =>
  changePlaythrough(
    current,
    playthroughId,
    (playthrough) => {
      const loans = playthrough.activeLoans ?? [];
      if (loans.some((loan) => loan.loanIndex === loanIndex)) return {};
      return {
        activeLoans: [
          ...loans,
          { loanIndex, termLength, activatedDate: now.toISOString() },
        ],
      };
    },
    now,
  );

export const removeLoan = (
  current: AppData,
  playthroughId: string,
  loanIndex: number,
  now = new Date(),
): AppData =>
  changePlaythrough(
    current,
    playthroughId,
    (playthrough) => ({
      activeLoans: (playthrough.activeLoans ?? []).filter(
        (loan) => loan.loanIndex !== loanIndex,
      ),
    }),
    now,
  );
