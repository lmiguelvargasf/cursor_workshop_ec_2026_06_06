import { describe, expect, it } from "vitest";

import {
  calculateMarketStats,
  calculateSettlementPayout,
  parseDollarAmountToCents,
  validateTradeAmount,
} from "@/lib/marketlab";

describe("calculateMarketStats", () => {
  it("starts markets at even odds", () => {
    expect(calculateMarketStats([])).toEqual({
      noPoolCents: 0,
      noPrice: 50,
      volumeCents: 0,
      yesPoolCents: 0,
      yesPrice: 50,
    });
  });

  it("prices each side from stake pools", () => {
    const stats = calculateMarketStats([
      { amount_cents: 7500, side: "yes" },
      { amount_cents: 2500, side: "no" },
    ]);

    expect(stats.yesPrice).toBe(75);
    expect(stats.noPrice).toBe(25);
    expect(stats.volumeCents).toBe(10000);
  });

  it("keeps active market prices inside 1 and 99 percent", () => {
    const stats = calculateMarketStats([{ amount_cents: 1000, side: "yes" }]);

    expect(stats.yesPrice).toBe(99);
    expect(stats.noPrice).toBe(1);
  });
});

describe("trade amount validation", () => {
  it("parses dollars to cents", () => {
    const formData = new FormData();
    formData.set("amount", "12.34");

    expect(parseDollarAmountToCents(formData.get("amount"))).toBe(1234);
  });

  it("rejects malformed and out-of-range values", () => {
    expect(validateTradeAmount(parseDollarAmountToCents("abc"))).toBe(
      "Enter a valid dollar amount.",
    );
    expect(validateTradeAmount(parseDollarAmountToCents("0.50"))).toBe(
      "Minimum trade is $1.00.",
    );
    expect(validateTradeAmount(parseDollarAmountToCents("501"))).toBe(
      "Maximum trade is $500.00.",
    );
  });
});

describe("calculateSettlementPayout", () => {
  it("returns stake plus proportional losing pool", () => {
    expect(
      calculateSettlementPayout({
        noPoolCents: 3000,
        side: "yes",
        stakeCents: 2000,
        yesPoolCents: 6000,
      }),
    ).toBe(3000);
  });

  it("returns zero when nobody backed the winning side", () => {
    expect(
      calculateSettlementPayout({
        noPoolCents: 3000,
        side: "yes",
        stakeCents: 1000,
        yesPoolCents: 0,
      }),
    ).toBe(0);
  });
});
