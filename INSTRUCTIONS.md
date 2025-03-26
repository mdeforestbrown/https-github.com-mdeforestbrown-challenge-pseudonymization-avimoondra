# Patient Data Pseudonymizer

This script processes patient data by splitting it into separate PII (Personally Identifiable Information) and health data files, using pseudonymous IDs (PIDs) to maintain the relationship between records.

## Features

- Splits patient data into separate PII and health data files
- Generates unique PIDs in the format XXX-XXX-XXX (where X is [1-9A-Z])
- Calculates patient ages based on date of birth

## Prerequisites

- Node.js (v18.20.4 or higher)
- [pnpm](https://pnpm.io/installation)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/mdeforestbrown/https-github.com-mdeforestbrown-challenge-pseudonymization-avimoondra.git
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Usage

```
pnpm ts-node src/index.ts --inputFile='./sampleData/patients.csv' --outputDir='./sampleData'
Read and parsed data from: sampleData/patients.csv
PII data written to: sampleData/pii.csv
Health data written to: sampleData/health.csv
```

The inputFile CSV should have the following columns (with capitalization and spacing):
- First name
- Last name
- Date of birth
- Weight
- Blood group

The outputDir will be the folder where two CSVs will be written (over overwritten if they already exist):
- `pii.csv`: Contains PII data (first name, last name, date of birth) with Pseudonymized IDs (PIDs). The output file will have columns: pid,firstName,lastName,dateOfBirth
- `health.csv`: Contains health data (weight, blood group, age) with Pseudonymized IDs. The output file will have columns: pid,weight,bloodGroup,age

## Running Tests

Run the test suite:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

## Future Improvements

- Add data validation rules for blood type
- Add batch/stream processing for larger files, with progress logs if streaming or batching
- Better CLI flags (e.g. help, configuration options for batching or streaming, etc.)
- Package as executable for easier distribution and use