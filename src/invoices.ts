export interface LineInput { description: string; amountPence: number; quantity?: number }
export interface InvoiceLine { description: string; amountPence: number; quantity: number; totalPence: number }
export interface Invoice { id: string; customer: string; lines: InvoiceLine[]; totalPence: number; vatRatePercent?: number }
export interface Page<T> { items: T[]; page: number; pageSize: number; total: number; totalPages: number }

export class InvalidAmountError extends Error {
  constructor(message = 'line amount must be a positive integer number of pence') {
    super(message);
    this.name = 'InvalidAmountError';
  }
}

export function resetStore(): void {
  throw new Error('not implemented');
}

export function createInvoice(_input: { customer: string; lines: LineInput[] }): Invoice {
  throw new Error('not implemented');
}

export function applyVat(_invoice: Invoice, _ratePercent: number): Invoice {
  throw new Error('not implemented');
}

export function listInvoices(_opts: { page: number; pageSize: number }): Page<Invoice> {
  throw new Error('not implemented');
}

/** R5: 123456 -> "£1,234.56" */
export function formatGBP(pence: number): string {
  const sign = pence < 0 ? '-' : '';
  const abs = Math.abs(pence);
  const pounds = Math.floor(abs / 100).toLocaleString('en-GB');
  const pennies = String(abs % 100).padStart(2, '0');
  return `${sign}£${pounds}.${pennies}`;
}
