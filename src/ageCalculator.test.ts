import { calculateAge, calculateAgeAsString, DateParseError } from "./ageCalculator";

describe("calculateAge", () => {
  it("calculates age from date", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2020-01-01"));
    expect(calculateAge("1993-10-07")).toBe(26);

    jest.setSystemTime(new Date("2020-10-10"));
    expect(calculateAge("1993-10-07")).toBe(27);
  });

  it("throws error for invalid date format", () => {
    expect(() => calculateAge("invalid-date")).toThrow(DateParseError);
    expect(() => calculateAge("")).toThrow(DateParseError);
    expect(() => calculateAge("10-10-2011")).toThrow(DateParseError);
  });
});

describe("calculateAgeAsString", () => {
  it("calculates age from date as string", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2020-01-01"));
    expect(calculateAgeAsString("1993-10-07")).toBe("26");
  });

  it("returns empty string on parsing errors", () => {
    expect(calculateAgeAsString("invalid-date")).toBe("");
    expect(calculateAgeAsString("")).toBe("");
    expect(calculateAgeAsString("10-10-2011")).toBe("");
  });
});
