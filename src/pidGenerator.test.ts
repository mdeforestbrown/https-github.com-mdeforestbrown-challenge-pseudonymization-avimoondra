import { generatePid, isValidPid } from './pidGenerator';

describe('generatePid', () => {
  it('should generate valid PIDs', () => {
    const pid = generatePid();
    expect(isValidPid(pid)).toBe(true);
  });

  it('should generate unique PIDs', () => {
    const pids = new Set();
    for (let i = 0; i < 100_000; i++) {
      pids.add(generatePid());
    }
    expect(pids.size).toBe(100_000);
  });
});

describe('isValidPid', () => {
  it ('should return true when valid', () => {
    expect(isValidPid('4SK-SWY-2NW')).toBe(true)
  })

  it ('should return false when invalid', () => {
    expect(isValidPid('4S!-SWY-2NW')).toBe(false)
    expect(isValidPid('4SK-SWY-2N')).toBe(false)
    expect(isValidPid('4SK-SWY-2Nw')).toBe(false)
  })
})