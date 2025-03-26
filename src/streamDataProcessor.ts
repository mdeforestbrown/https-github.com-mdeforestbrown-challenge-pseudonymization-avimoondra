import { parse } from "csv-parse";
import { stringify } from "csv-stringify";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  truncateSync,
} from "fs";
import path from "path";
import { calculateAgeAsString } from "./ageCalculator";
import { generatePid } from "./pidGenerator";
import { HealthRecord, PatientRecord, PiiRecord } from "./types";
import { Transform } from "stream";

export async function processPatientDataStream({
  inputFilePath,
  outputDir,
}: {
  inputFilePath: string;
  outputDir: string;
}) {
  return new Promise((resolve, reject) => {
    try {
      // clear outputs
      const piiDataPath = path.join(outputDir, "pii.csv");
      if (existsSync(piiDataPath)) {
        truncateSync(piiDataPath);
      }
      const healthDataPath = path.join(outputDir, "health.csv");
      if (existsSync(healthDataPath)) {
        truncateSync(healthDataPath);
      }

      // Pipe stringifiers to write streams
      const piiStringifier = stringify({ header: true });
      const piiDataWriteStream = createWriteStream(piiDataPath);
      piiStringifier.pipe(piiDataWriteStream);

      const healthStringifier = stringify({ header: true });
      const healthDataWriteStream = createWriteStream(healthDataPath);
      healthStringifier.pipe(healthDataWriteStream);

      const processor = new Transform({
        objectMode: true,
        transform(record: any, _encoding: string, callback: Function) {
          try {
            const patient: PatientRecord = {
              firstName: record["First name"],
              lastName: record["Last name"],
              dateOfBirth: record["Date of birth"],
              weight: record["Weight"],
              bloodGroup: record["Blood group"],
            };

            const pid = generatePid();

            const piiRecord: PiiRecord = {
              pid,
              firstName: patient.firstName,
              lastName: patient.lastName,
              dateOfBirth: patient.dateOfBirth,
            };

            const healthRecord: HealthRecord = {
              pid,
              weight: patient.weight,
              bloodGroup: patient.bloodGroup,
              age: calculateAgeAsString(patient.dateOfBirth),
            };

            piiStringifier.write(piiRecord);
            healthStringifier.write(healthRecord);

            callback();
          } catch (error) {
            callback(error);
          }
        },
        flush(callback: Function) {
          piiStringifier.end();
          healthStringifier.end();
          callback();
        },
      });

      const pipeline = createReadStream(inputFilePath)
        .pipe(
          parse({
            columns: true,
            skipEmptyLines: true,
            trim: true,
          })
        )
        .pipe(processor);

      pipeline.on("error", (error) => {
        console.error("Error processing patient data:", error);
        reject(error);
      });

      // Resolve the promise when both write streams are finished
      let completedStreams = 0;
      const checkCompletion = () => {
        completedStreams++;
        if (completedStreams === 2) {
          resolve(null);
        }
      };

      piiDataWriteStream.on("finish", () => {
        console.log(`PII data written to: ${piiDataPath}`);
        checkCompletion();
      });

      healthDataWriteStream.on("finish", () => {
        console.log(`Health data written to: ${healthDataPath}`);
        checkCompletion();
      });
    } catch (error) {
      console.error("Error processing patient data:", error);
      reject(error);
    }
  });
}
