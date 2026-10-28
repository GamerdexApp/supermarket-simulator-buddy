import { describe, expect, it } from "vitest";
import { overviewFigures } from "@/service/overview";
import { barePlaythrough, playthroughWithUnknownFields } from "./fixtures";

describe("overview figures", () => {
  it("matches the board sample for two loans", () => {
    const figures = overviewFigures({
      ...barePlaythrough(),
      activeLoans: [
        {
          loanIndex: 1,
          termLength: 10,
          activatedDate: "2026-03-01T00:00:00.000Z",
        },
        {
          loanIndex: 2,
          termLength: 15,
          activatedDate: "2026-03-01T00:00:00.000Z",
        },
      ],
    });

    expect(figures.loans.totalDebt).toBe(9275);
    expect(figures.loans.dailyPayment).toBeCloseTo(698.33, 2);
  });

  it("counts only ids the game data knows, so counts and sums agree", () => {
    const figures = overviewFigures(playthroughWithUnknownFields());

    expect(figures.licenses).toEqual({ owned: 1, total: 30 });
    expect(figures.spent.total).toBe(
      figures.spent.management + figures.spent.market,
    );
  });

  it("is all zero for an empty playthrough", () => {
    const figures = overviewFigures(barePlaythrough());

    expect(figures.spent.total).toBe(0);
    expect(figures.loans).toEqual({ active: 0, dailyPayment: 0, totalDebt: 0 });
    expect(figures.productsAvailable).toBe(0);
    expect(figures.furniture).toBe(28);
  });
});
