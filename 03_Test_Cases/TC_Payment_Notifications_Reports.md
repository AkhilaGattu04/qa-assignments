# Test Cases — Payment Forwarding, Notifications & Reports

**Modules:** PAY, NOTIF, RPT  
**Requirements:** REQ-004, REQ-005, REQ-006  
**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06

---

## REQ-004 — Approved Invoices Forwarded for Payment Processing

### PAY-TC-001 — Approved Invoice Forwarded to Payment System

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-01 (forwarding failure can lead to missed payment), RISK-C-01 (vendor bank account data must be encrypted in transit) |
| **Preconditions** | Invoice INV-2026-005 is in "Approved" status |
| **Steps** | 1. Approve invoice INV-2026-005. 2. Check the payment system (or mock API log) for the forwarded invoice. |
| **Expected Result** | Invoice data is sent to the payment system with correct vendor bank details, invoice amount, PO reference, and invoice number. Invoice status in the portal updates to "Forwarded for Payment" or "Payment Initiated". |

---

### PAY-TC-002 — Payment System Unavailable at Forwarding Time

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-01 (retry without idempotency key = double payment when system recovers) |
| **Preconditions** | Payment system endpoint is down (simulated in QA environment) |
| **Steps** | 1. Approve an invoice while payment system is offline. 2. Monitor the portal for error handling. |
| **Expected Result** | Forwarding fails gracefully. Error is logged. Invoice stays in "Approved" status (not lost). Retry mechanism activates automatically. AP team receives an alert about the failed forwarding. |

---

### PAY-TC-003 — Payment Status Update Reflected in Portal

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | — |
| **Preconditions** | Invoice was forwarded and payment system sends back a "Payment Completed" callback |
| **Steps** | 1. Simulate a "Payment Completed" callback from the payment system. 2. Check invoice status in the portal. |
| **Expected Result** | Invoice status updates to "Payment Completed". Vendor can see the updated status on their invoice. |

---

### PAY-TC-004 — Payment Data Accuracy Verification

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-01 (data truncation or rounding error results in incorrect payment amount), RISK-C-01 (bank account number must not be exposed in logs or UI) |
| **Steps** | 1. Approve an invoice with Amount = $12,345.67, Vendor Bank Account = XXXXXX1234. 2. Inspect the payload sent to the payment system. |
| **Expected Result** | Amount matches exactly. Bank account number is correct. Invoice number and PO number are included. No data truncation or rounding errors. |

---

### PAY-TC-005 — Duplicate Invoice Not Forwarded Twice

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-01 (duplicate forwarding = vendor paid twice, financial loss to the company) |
| **Steps** | 1. Simulate a scenario where the forwarding is triggered twice for the same invoice (e.g., due to a retry on a transient error). |
| **Expected Result** | Idempotency check prevents the invoice from being forwarded twice. Payment system receives it exactly once. |

---

## REQ-005 — Both Parties Receive Email Notifications on Status Changes

### NOTIF-TC-001 — Vendor Receives Email When Invoice is Submitted

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-04 (notification silently dropped if email service is down at submission time) |
| **Steps** | 1. Submit an invoice as a vendor. 2. Check vendor's email inbox. |
| **Expected Result** | Email received with subject line referencing the invoice number. Email includes invoice details and current status "Submitted". |

---

### NOTIF-TC-002 — Vendor and AP Team Receive Email When Invoice is Approved

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-04 (silent failure means vendor never knows invoice was approved and may chase the AP team unnecessarily) |
| **Steps** | 1. AP team approves an invoice. 2. Check both vendor and AP team email inboxes. |
| **Expected Result** | Both parties receive notification. Vendor email confirms "Your invoice [number] has been approved." AP email confirms action taken. |

---

### NOTIF-TC-003 — Vendor Receives Rejection Email with Reason

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-04 (notification failure = vendor doesn't know invoice was rejected and doesn't resubmit; payment never happens) |
| **Steps** | 1. AP team rejects invoice with reason "Tax ID mismatch". 2. Check vendor's inbox. |
| **Expected Result** | Vendor receives email with rejection reason clearly stated in the body: "Reason: Tax ID mismatch." |

---

### NOTIF-TC-004 — Notification Email Contains Correct Invoice Data

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-04 (unfilled template variables confuse vendors and erode trust), RISK-B-03 (email with wrong invoice data could go to wrong contact) |
| **Steps** | 1. Submit invoice INV-2026-006 for $7,500. 2. Check notification email content. |
| **Expected Result** | Email shows: Invoice Number = INV-2026-006, Amount = $7,500, PO = [correct PO], Vendor Name = [correct name]. No placeholder tokens like "{{invoice_number}}" are visible. |

---

### NOTIF-TC-005 — No Notification Sent for Draft Invoices

| Field | Details |
|-------|---------|
| **Priority** | P2 |
| **Linked Risks** | — |
| **Steps** | 1. Save an invoice as a draft. 2. Check email inboxes of vendor and AP team. |
| **Expected Result** | No notification email is sent for draft saves. Notification only fires on explicit Submit action. |

---

### NOTIF-TC-006 — Notification Sent When Payment is Completed

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-04 (vendor not informed of payment completion may raise disputes or re-submit invoices) |
| **Steps** | 1. Simulate payment completion callback from payment system. 2. Check vendor email. |
| **Expected Result** | Vendor receives email: "Payment has been processed for invoice [number]." |

---

### NOTIF-TC-007 — Notification Delivery Within SLA

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-04 (delayed notifications from a backed-up queue may indicate the queue is growing unbounded) |
| **Steps** | 1. Trigger an invoice approval at a known time. 2. Record when the notification email is received. |
| **Expected Result** | Email is received within the agreed SLA (e.g., within 5 minutes of the trigger event). |

---

### NOTIF-TC-008 — Invalid Vendor Email Does Not Cause Application Error

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-04 (unhandled bounce = notification permanently lost), RISK-B-03 (bounce with no fallback leaves vendor uninformed) |
| **Preconditions** | Vendor account has an email address that is known to bounce |
| **Steps** | 1. Approve an invoice for a vendor with an invalid email. 2. Observe system behavior. |
| **Expected Result** | Email bounces but the portal continues to function normally. The bounce is logged. Invoice status is unaffected. AP team may receive an alert about the delivery failure. |

---

## REQ-006 — Monthly Invoice Activity Reports

### RPT-TC-001 — Monthly Report Generated Successfully

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-06 (non-transactional read during concurrent writes can produce inconsistent report totals), RISK-B-04 (month boundary depends on timezone — must be documented) |
| **Steps** | 1. Navigate to Reports section. 2. Select month: May 2026. 3. Click "Generate Report". |
| **Expected Result** | Report is generated and downloadable. Contains data for May 2026 invoices only. |

---

### RPT-TC-002 — Report Includes All Expected Data Points

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-06 (concurrent inserts during report generation can cause count/value mismatch) |
| **Steps** | 1. Generate report for a month with known data. 2. Cross-verify report totals against individual invoice records. |
| **Expected Result** | Total submitted count, total approved count, total rejected count, total invoice value, and average processing time all match manual calculation from the invoice data. |

---

### RPT-TC-003 — Vendor Can Only See Their Own Data in Reports

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-02 (IDOR — vendor accessing another vendor's invoice data via report endpoint) |
| **Preconditions** | Multiple vendors have submitted invoices |
| **Steps** | 1. Log in as Vendor A. 2. Generate/view the monthly report. |
| **Expected Result** | Report shows only Vendor A's invoice data. Vendor B's data is NOT visible or included. |

---

### RPT-TC-004 — Report for a Month With Zero Invoices

| Field | Details |
|-------|---------|
| **Priority** | P2 |
| **Linked Risks** | — |
| **Steps** | 1. Select a month that has no invoice activity. 2. Generate report. |
| **Expected Result** | Report shows zero values or an empty state message. Application does not crash or return an error. |

---

### RPT-TC-005 — Report Download in All Supported Formats

| Field | Details |
|-------|---------|
| **Priority** | P2 |
| **Linked Risks** | — |
| **Steps** | 1. Generate a report. 2. Download as PDF. 3. Download as CSV. 4. Download as Excel. |
| **Expected Result** | Each format downloads successfully. File is not corrupted. Data is formatted correctly in each format. |

---

### RPT-TC-006 — Unauthorized User Cannot Access Reports

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-02 (broken access control on report endpoint exposes all vendor data to an unauthorized role) |
| **Preconditions** | A vendor user (if reports are AP-only) |
| **Steps** | 1. Log in as a vendor. 2. Attempt to access the reports URL directly. |
| **Expected Result** | Access denied. Vendor is not authorized to view organizational-wide reports (only their own, if applicable). |
