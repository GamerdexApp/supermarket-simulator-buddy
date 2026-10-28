import { describe, expect, it } from "vitest";
import { closestPath } from "@/lib/utils/closestPath";

const known = [
  "/overview",
  "/market",
  "/management",
  "/bank",
  "/shopping-list",
  "/settings",
];

describe("closestPath", () => {
  it.each([
    ["/markt", "/market"],
    ["/Settings/", "/settings"],
    ["/shoping-list", "/shopping-list"],
  ])("suggests %s as %s", (typed, expected) => {
    expect(closestPath(typed, known)).toBe(expected);
  });

  it("suggests nothing for a path far from every page", () => {
    expect(closestPath("/completely-unknown", known)).toBeNull();
  });
});
