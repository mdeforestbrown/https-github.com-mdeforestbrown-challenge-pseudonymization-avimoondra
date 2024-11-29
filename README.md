# Coding Challenge: Patient pseudonymization

## Overview

This is a coding challenge to evaluate programming skills, based on the real-world domain we deal with at Lindus Health.

You may do this at your own pace at home. The challenge is designed to take no more than 2 hours. If you find yourself spending more time than that, you may stop and document where you got stuck.

## Instructions

This repo contains a csv file `patients.csv` with patient data. Each row corresponds to one patient and consists of both personally identifiable information (PII) and some health data. The goal is to pseudonymize the health data by splitting the file into two separate CSV files:

1. `pii.csv`: Contains only the PII columns from `patients.csv` (first name, last name, date of birth), plus a new column containing a pseudo-ID (PID) for each patient. A PID is string of the format `XXX-XXX-XXX` where each `X` is a random character from the class `[1-9A-Z]` (example PID: `4SK-SWY-2NW`).
2. `health.csv`: Contains only the health data columns (weight, blood group), plus a new columns of PIDs such that corresponding rows between the two CSV files have matching PIDs, plus a column for the patient's current age. The current age is calculated based on a patient's date of birth.

Your specific instructions are:

- Write a script that generates the two files as explained above from `patients.csv` (you can use any programming language & you may use any open source libraries you like)
- Include instructions for running the script for somebody who knows nothing about the code
- Write at least 2 unit tests for relevant parts of your code, and include instructions for how to run the unit tests as well
- Push your completed code to this GitHub repo and let us know you're done - we will set up a chat with you to discuss your code

## Evaluation

Treat this as if it were a script that will be maintained going forward, not just throwaway code. Your code will be evaluated based on readability, maintainability and quality of design/tradeoffs, as well as how it would handle the messier realities of a production environment.

Note that while we expect submitted code to run, we don't expect it to be ready to deploy! Leaving comments about things you would like to do given more time is totally fine.
