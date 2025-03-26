import { differenceInYears, parse, isValid } from 'date-fns';

export class DateParseError extends Error {
  name = 'DateParseError'
}

export function calculateAgeAsString(dateOfBirth: string): string {
  try {
    return String(calculateAge(dateOfBirth))
  } catch (e) {
    if (e instanceof DateParseError) {
      console.warn(`${e.name} for ${dateOfBirth}`, e.message)
      return ''
    }
  }
  return ''
}

export function calculateAge(dateOfBirth: string): number {
  const parsedDate = parse(dateOfBirth, 'yyyy-MM-dd', new Date());
  
  if (!isValid(parsedDate)) {
    throw new DateParseError(`Invalid date format: ${dateOfBirth}. Expected format: YYYY-MM-DD`);
  }
  
  return differenceInYears(new Date(), parsedDate);
}