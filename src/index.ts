import { processPatientData } from "./dataProcessor";
import { existsSync } from "fs";

import { Flags, Parser } from "@oclif/core";
import path from "path";
import { processPatientDataStream } from "./streamDataProcessor";

async function main() {
  const { flags } = await Parser.parse(process.argv.slice(2), {
    flags: {
      inputFile: Flags.string({char: 'f', default: './sampleData/patients.csv'}),
      outputDir: Flags.string({char: 'o', default: './sampleData'}),
      stream: Flags.boolean({char: 's', default: true, allowNo: true }),
    },
  });

  try {
    const inputFile = path.join(flags.inputFile, "");

    if (!existsSync(inputFile)) {
      console.error(
        `Error: Input file '${inputFile}' not found. Please ensure patients.csv exists in the root directory.`
      );
      process.exit(1);
    }

    if (flags.stream) {
      await processPatientDataStream({
        inputFilePath: inputFile,
        outputDir: flags.outputDir,
      })
    } else {
      await processPatientData({
        inputFilePath: inputFile,
        outputDir: flags.outputDir,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
