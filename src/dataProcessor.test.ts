import { processPatientData } from "./dataProcessor";
import fs from "fs";
import path from "path";
import { generatePid } from "./pidGenerator";
import { calculateAgeAsString } from "./ageCalculator";

// Mock the pid generator to return predictable values
jest.mock("./pidGenerator", () => {
  const originalModule = jest.requireActual("./pidGenerator");
  return {
    ...originalModule,
    generatePid: jest.fn(() => {
      const calls = (generatePid as jest.Mock).mock.calls.length;
      return `TEST-PID-${calls + 1}`;
    }),
  };
});

describe("processPatientData", () => {
  const testInputPath = path.join(
    __dirname,
    "__fixtures__",
    "test-patients.csv"
  );
  const testOutputDir = path.join(__dirname, "__fixtures__", "output");

  it("should process patient data and create PII and health CSV files", async () => {
    await processPatientData({
      inputFilePath: testInputPath,
      outputDir: testOutputDir,
    });

    const piiFilePath = path.join(testOutputDir, "pii.csv");
    const piiFileContents = fs.readFileSync(piiFilePath, "utf-8");
    expect(piiFileContents).toBe(`pid,firstName,lastName,dateOfBirth
TEST-PID-2,James,Lind,1716-10-04
TEST-PID-3,Liz,Lime,1994-04-05
`);

    const healthFilePath = path.join(testOutputDir, "health.csv");
    const healthFileContents = fs.readFileSync(healthFilePath, "utf-8");

    // Note: seems like fake timers mess with node js file async ops, just calculate age inline (age requires freezing time in test context)
    expect(healthFileContents).toBe(`pid,weight,bloodGroup,age
TEST-PID-2,84,A,${calculateAgeAsString("1716-10-04")}
TEST-PID-3,65,B,${calculateAgeAsString("1994-04-05")}
`);
  });
});
