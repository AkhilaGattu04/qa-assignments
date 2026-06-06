# Test Cases — Invoice Submission

**Module:** INV  
**Requirement:** REQ-002 — Vendors can submit invoices against purchase orders  
**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06

---

### INV-TC-001 — Successful Invoice Submission Against Valid PO

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | — |
| **Preconditions** | Vendor is logged in. PO-1001 exists, is open, and has not been fully invoiced. |
| **Test Data** | PO: PO-1001, Invoice No: INV-2026-001, Date: 2026-06-01, Amount: $5,000, Line items: 2 |
| **Steps** | 1. Navigate to "Submit Invoice". 2. Enter PO number PO-1001. 3. Fill in all invoice details and line items. 4. Upload a valid PDF attachment. 5. Click "Submit". |
| **Expected Result** | Invoice is created with status "Submitted". Confirmation message shown. Invoice appears in vendor's invoice list. AP team queue shows the new invoice. |

---

### INV-TC-002 — Invoice Against Non-Existent PO

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-B-01 (unvalidated PO allows invoice for goods never ordered) |
| **Test Data** | PO: PO-FAKE-9999 |
| **Steps** | 1. Enter a PO number that does not exist in the system. 2. Attempt to submit the invoice. |
| **Expected Result** | Error: "Purchase Order PO-FAKE-9999 does not exist or is not assigned to your account." Invoice not created. |

---

### INV-TC-003 — Invoice Against a PO Belonging to Another Vendor

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-02 (IDOR — vendor accessing another vendor's PO) |
| **Preconditions** | PO-2002 belongs to Vendor B; logged in as Vendor A |
| **Steps** | 1. Log in as Vendor A. 2. Attempt to submit invoice referencing PO-2002. |
| **Expected Result** | Access denied. Vendor A cannot submit invoices against POs assigned to Vendor B. Error: "This PO is not assigned to your account." |

---

### INV-TC-004 — Invoice Against Fully-Invoiced PO

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-B-01 (over-invoicing a closed PO leads to unauthorized payment) |
| **Preconditions** | PO-1002 has been fully invoiced (100% of PO value invoiced) |
| **Steps** | 1. Attempt to submit an invoice against PO-1002. |
| **Expected Result** | Error: "This PO has been fully invoiced. No further invoices can be submitted." |

---

### INV-TC-005 — Invoice Amount Exceeds Remaining PO Value

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-B-01 (over-invoicing risk — payment exceeds contracted PO value) |
| **Preconditions** | PO-1003 has a remaining value of $2,000 |
| **Test Data** | Invoice amount: $3,000 |
| **Steps** | 1. Submit invoice for $3,000 against PO-1003. |
| **Expected Result** | Warning or error: "Invoice amount ($3,000) exceeds the remaining PO value ($2,000)." System either blocks the submission or flags it for AP review, depending on configuration. |

---

### INV-TC-006 — Submit Invoice with Missing Mandatory Fields

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | — |
| **Test Data** | Leave "Invoice Date" blank |
| **Steps** | 1. Fill all mandatory fields except Invoice Date. 2. Click "Submit". |
| **Expected Result** | Validation error highlighted for Invoice Date. Invoice is NOT submitted. |

---

### INV-TC-007 — Duplicate Invoice Number for Same Vendor

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-01 (duplicate invoice number can lead to duplicate payment if not caught) |
| **Preconditions** | Invoice INV-2026-001 already exists for this vendor |
| **Steps** | 1. Submit a new invoice with Invoice Number INV-2026-001. |
| **Expected Result** | Error: "Invoice number INV-2026-001 already exists. Please use a unique invoice number." |

---

### INV-TC-008 — Upload Attachment — Valid PDF

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | — |
| **Test Data** | Valid PDF, 2MB |
| **Steps** | 1. Upload a valid PDF as invoice attachment. 2. Submit the invoice. |
| **Expected Result** | File uploads successfully. Invoice submitted. Attachment is downloadable from the invoice detail view. |

---

### INV-TC-009 — Upload Attachment — Unsupported File Format

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-C-01 (malicious file upload can compromise server if MIME type not validated server-side) |
| **Test Data** | .exe file, .js file, .zip file |
| **Steps** | 1. Attempt to upload an .exe file as the invoice attachment. |
| **Expected Result** | Error: "File type not supported. Please upload a PDF, JPG, or TIFF." File is rejected before it reaches the server. |

---

### INV-TC-010 — Upload Attachment Exceeding Maximum File Size

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | — |
| **Test Data** | PDF file of 51MB (assuming 50MB limit) |
| **Steps** | 1. Attempt to upload a file larger than the allowed maximum. |
| **Expected Result** | Error: "File size exceeds the maximum allowed size of 50MB." |

---

### INV-TC-011 — Save Invoice as Draft

| Field | Details |
|-------|---------|
| **Priority** | P2 |
| **Linked Risks** | — |
| **Steps** | 1. Begin filling in an invoice form. 2. Do not complete all fields. 3. Click "Save as Draft". |
| **Expected Result** | Invoice saved with status "Draft". Incomplete fields are allowed in draft state. Draft is visible in vendor's invoice list. |

---

### INV-TC-012 — Submit a Previously Saved Draft

| Field | Details |
|-------|---------|
| **Priority** | P2 |
| **Linked Risks** | — |
| **Preconditions** | Draft invoice exists |
| **Steps** | 1. Open the draft invoice. 2. Complete all required fields. 3. Click "Submit". |
| **Expected Result** | Invoice status changes from "Draft" to "Submitted". AP team can see it in their queue. |

---

### INV-TC-013 — Withdraw a Submitted Invoice Before AP Action

| Field | Details |
|-------|---------|
| **Priority** | P2 |
| **Linked Risks** | — |
| **Preconditions** | Invoice is in "Submitted" status and AP team has not yet acted |
| **Steps** | 1. Navigate to the submitted invoice. 2. Click "Withdraw". |
| **Expected Result** | Invoice status changes to "Withdrawn". It disappears from the AP queue. Vendor can edit and resubmit. |

---

### INV-TC-014 — Invoice with Zero-Value Line Item

| Field | Details |
|-------|---------|
| **Priority** | P2 |
| **Linked Risks** | — |
| **Test Data** | Line item with quantity = 1, unit price = 0 |
| **Steps** | 1. Add a line item with a unit price of $0. 2. Submit the invoice. |
| **Expected Result** | System either accepts (with a warning) or rejects with validation error: "Line item value cannot be zero." |

---

### INV-TC-015 — Invoice with Negative Line Item Amount

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-01 (negative invoice forwarded to payment system could trigger a reversal debit against the vendor) |
| **Test Data** | Unit price = -100 |
| **Steps** | 1. Enter a negative value for a line item's unit price. 2. Submit. |
| **Expected Result** | Validation error: "Unit price cannot be negative." |

---

### INV-TC-016 — Vendor Can Only See Their Own Invoices

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-02 (IDOR — Vendor B viewing Vendor A's invoice exposes confidential pricing data) |
| **Preconditions** | Vendor A and Vendor B both have submitted invoices |
| **Steps** | 1. Log in as Vendor A. 2. View the invoice list. |
| **Expected Result** | Only Vendor A's invoices are visible. No invoices from Vendor B appear. |
