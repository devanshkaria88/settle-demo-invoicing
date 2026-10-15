# Milestone M1 — Invoice module for Greentask

**Client:** Greentask Ltd · **Freelancer:** @devanshkaria88 · **Amount:** £1,200.00 · **Repo:** devanshkaria88/settle-demo-invoicing · **Base:** main

## Requirements

- **R1.** `createInvoice({ customer, lines })` returns an invoice with a unique id, a total per line and a grand total, all in pence.
- **R2.** `applyVat(invoice, ratePercent)` adds VAT at the given rate to every line and the grand total, rounding half-up to the penny.
- **R3.** A line with a zero or negative amount is rejected by throwing `InvalidAmountError`; no invoice is created.
- **R4.** `listInvoices({ page, pageSize })` returns invoices in creation order, paginated, with `total` (count of all invoices) and page metadata.
- **R5.** `formatGBP(pence)` renders amounts as pounds with thousands separators and two decimals, e.g. `123456 → "£1,234.56"`.

## Acceptance

All tests green on the PR head. Each requirement is covered by at least one passing test whose name references it (e.g. `R4 lists invoices paginated`). Test count must not decrease versus `main`. Payment is released automatically by Settle under the escrow policy v1.0 when every requirement is verified.
