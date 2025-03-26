export interface PatientRecord {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  weight: string;
  bloodGroup: string;
}

export interface PiiRecord {
  pid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface HealthRecord {
  pid: string;
  weight: string;
  bloodGroup: string;
  age: string;
}