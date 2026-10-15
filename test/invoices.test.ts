import { beforeEach, describe, expect, it } from 'vitest';
import { InvalidAmountError, applyVat, createInvoice, formatGBP, resetStore } from '../src/index.js';

beforeEach(() => resetStore());

describe('invoices', () => {
  it('R1 createInvoice returns id, line totals and grand total in pence', () => {
    const a = createInvoice({ customer: 'Greentask Ltd', lines: [{ description: 'Design', amountPence: 25000, quantity: 2 }, { description: 'Hosting', amountPence: 999 }] });
    const b = createInvoice({ customer: 'Greentask Ltd', lines: [{ description: 'Support', amountPence: 100 }] });
    expect(a.id).toMatch(/^inv_/);
    expect(a.id).not.toBe(b.id);
    expect(a.lines.map((l) => l.totalPence)).toEqual([50000, 999]);
    expect(a.totalPence).toBe(50999);
    expect(Number.isInteger(a.totalPence)).toBe(true);
  });

  it('R2 applyVat rounds half-up', () => {
    const inv = createInvoice({ customer: 'Greentask Ltd', lines: [{ description: 'A', amountPence: 1001 }, { description: 'B', amountPence: 1003 }] });
    const vat = applyVat(inv, 20);
    // 1001 * 1.2 = 1201.2 -> 1201 ; 1003 * 1.2 = 1203.6 -> 1204 ; 2004 * 1.2 = 2404.8 -> 2405
    expect(vat.lines.map((l) => l.totalPence)).toEqual([1201, 1204]);
    expect(vat.totalPence).toBe(2405);
    expect(vat.vatRatePercent).toBe(20);
    // exact half rounds up: 1 * 1.5 = 1.5 -> 2
    expect(applyVat(createInvoice({ customer: 'x', lines: [{ description: 'c', amountPence: 1 }] }), 50).totalPence).toBe(2);
    expect(inv.totalPence).toBe(2004); // original untouched
  });

  it('R3 rejects zero and negative amounts with InvalidAmountError', () => {
    expect(() => createInvoice({ customer: 'x', lines: [{ description: 'zero', amountPence: 0 }] })).toThrow(InvalidAmountError);
    expect(() => createInvoice({ customer: 'x', lines: [{ description: 'ok', amountPence: 500 }, { description: 'neg', amountPence: -5 }] })).toThrow(InvalidAmountError);
    expect(() => createInvoice({ customer: 'x', lines: [{ description: 'ok', amountPence: 500 }] })).not.toThrow();
  });

  it('R5 formatGBP renders £1,234.56', () => {
    expect(formatGBP(123456)).toBe('£1,234.56');
    expect(formatGBP(5)).toBe('£0.05');
    expect(formatGBP(100000000)).toBe('£1,000,000.00');
  });
});
