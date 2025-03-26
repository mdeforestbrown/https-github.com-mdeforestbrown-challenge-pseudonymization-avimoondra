import { randomInt } from 'crypto';

const VALID_CHARS = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateRandomChar(): string {
  return VALID_CHARS[randomInt(0, VALID_CHARS.length)];
}

export function generatePid(): string {
  const part1 = Array.from({ length: 3 }, generateRandomChar).join('');
  const part2 = Array.from({ length: 3 }, generateRandomChar).join('');
  const part3 = Array.from({ length: 3 }, generateRandomChar).join('');
  return `${part1}-${part2}-${part3}`;
}

export function isValidPid(pid: string): boolean {
  if (!/^[1-9A-Z]{3}-[1-9A-Z]{3}-[1-9A-Z]{3}$/.test(pid)) {
    return false;
  }
  return true;
}
