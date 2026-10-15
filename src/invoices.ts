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

const store: Invoice[] = [];
let seq = 0;

export function resetStore(): void {
  store.length = 0;
  seq = 0;
}

/** R1 + R3: validates every line before storing anything. */
export function createInvoice(input: { customer: string; lines: LineInput[] }): Invoice {
  const lines: InvoiceLine[] = input.lines.map((l) => {
    const quantity = l.quantity ?? 1;
    if (!Number.isInteger(l.amountPence) || l.amountPence <= 0) throw new InvalidAmountError();
    if (!Number.isInteger(quantity) || quantity <= 0) throw new InvalidAmountError('quantity must be a positive integer');
    return { description: l.description, amountPence: l.amountPence, quantity, totalPence: l.amountPence * quantity };
  });
  const invoice: Invoice = {
    id: `inv_${++seq}_${Math.random().toString(36).slice(2, 8)}`,
    customer: input.customer,
    lines,
    totalPence: lines.reduce((sum, l) => sum + l.totalPence, 0),
  };
  store.push(invoice);
  return invoice;
}

/** Half-up rounding to the penny using integer arithmetic only, so exact halves (x.5p) always round up and no float error can creep in. */
function addVat(pence: number, ratePercent: number): number {
  return Math.floor((pence * (100 + ratePercent) + 50) / 100);
}

/** R2: returns a new invoice with VAT applied to every line (rounded half-up per line); the grand total is the sum of the VAT-inclusive lines, so lines and total always reconcile. */
export function applyVat(invoice: Invoice, ratePercent: number): Invoice {
  const lines = invoice.lines.map((l) => ({ ...l, totalPence: addVat(l.totalPence, ratePercent) }));
  const totalPence = lines.reduce((sum, l) => sum + l.totalPence, 0);
  return { ...invoice, lines, totalPence, vatRatePercent: ratePercent };
}

/** R4: creation-order pagination over the in-memory store (page is 1-based). */
export function listInvoices(opts: { page: number; pageSize: number }): Page<Invoice> {
  const pageSize = Math.max(1, Math.floor(opts.pageSize));
  const page = Math.max(1, Math.floor(opts.page));
  const total = store.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return { items: store.slice(start, start + pageSize), page, pageSize, total, totalPages };
}

/** R5: 123456 -> "£1,234.56" */
export function formatGBP(pence: number): string {
  const sign = pence < 0 ? '-' : '';
  const abs = Math.abs(pence);
  const pounds = Math.floor(abs / 100).toLocaleString('en-GB');
  const pennies = String(abs % 100).padStart(2, '0');
  return `${sign}£${pounds}.${pennies}`;
}
