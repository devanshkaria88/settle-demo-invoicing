import { describe, expect, it } from 'vitest';
import { formatGBP } from '../src/index.js';

describe('invoices', () => {
  it('R5 formatGBP renders £1,234.56', () => {
    expect(formatGBP(123456)).toBe('£1,234.56');
    expect(formatGBP(5)).toBe('£0.05');
    expect(formatGBP(100000000)).toBe('£1,000,000.00');
  });
});
