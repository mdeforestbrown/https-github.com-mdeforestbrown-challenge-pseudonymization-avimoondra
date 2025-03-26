import { parse } from "csv-parse";
import { stringify } from "csv-stringify";
import { createReadStream, createWriteStream, existsSync, truncateSync } from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { calculateAgeAsString } from "./ageCalculator";
import { generatePid } from "./pidGenerator";
import { HealthRecord, PatientRecord, PiiRecord } from "./types";

export async function processPatientData({
  inputFilePath,
  outputDir,
}: {
  inputFilePath: string;
  outputDir: string;
}): Promise<void> {
  try {
    const patients: PatientRecord[] = [];

    const parser = createReadStream(inputFilePath).pipe(
      parse({
        columns: true,
        skipEmptyLines: true,
        trim: true,
      })
    );

    for await (const record of parser) {
      patients.push({
        firstName: record["First name"],
        lastName: record["Last name"],
        dateOfBirth: record["Date of birth"],
        weight: record["Weight"],
        bloodGroup: record["Blood group"],
      });
    }
    console.log(`Read and parsed data from: ${inputFilePath}`);

    const piiData: PiiRecord[] = [];
    const healthData: HealthRecord[] = [];

    for (const patient of patients) {
      const pid = generatePid();

      piiData.push({
        pid,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
      });

      healthData.push({
        pid,
        weight: patient.weight,
        bloodGroup: patient.bloodGroup,
        age: calculateAgeAsString(patient.dateOfBirth),
      });
    }

    const piiDataPath = path.join(outputDir, "pii.csv");
    if (existsSync(piiDataPath)) {
      truncateSync(piiDataPath)
    }
    await pipeline(
      stringify(piiData, { header: true }),
      createWriteStream(piiDataPath)
    );
    console.log(`PII data written to: ${piiDataPath}`);

    const healthDataPath = path.join(outputDir, "health.csv");
    if (existsSync(healthDataPath)) {
      truncateSync(healthDataPath)
    }
    await pipeline(
      stringify(healthData, { header: true }),
      createWriteStream(healthDataPath)
    );
    console.log(`Health data written to: ${healthDataPath}`);
  } catch (error) {
    console.error("Error processing patient data:", error);
    throw error;
  }
}
