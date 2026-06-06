# Test Cases — AP Team Invoice Review (Approve / Reject)

**Module:** AP  
**Requirement:** REQ-003 — The AP team can view, approve, or reject invoices  
**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06

---

### AP-TC-001 — AP Team Can View Invoice Queue

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | — |
| **Preconditions** | One or more invoices are in "Submitted" status |
| **Steps** | 1. Log in as an AP team user. 2. Navigate to the invoice queue/review page. |
| **Expected Result** | All submitted invoices are listed with key fields: vendor name, invoice number, PO number, amount, submission date, status. |

---

### AP-TC-002 — AP Team Can View Invoice Details

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-C-02 (audit trail must record who viewed sensitive invoice data) |
| **Steps** | 1. From the invoice queue, click on a specific invoice. |
| **Expected Result** | Full invoice details are shown: all line items, attachment downloadable, PO reference, history of status changes. |

---

### AP-TC-003 — AP Team Approves a Valid Invoice

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-03 (race condition if two AP users approve simultaneously), RISK-T-01 (approval triggers payment forwarding — double-forward risk), RISK-C-02 (audit trail of approval must be recorded) |
| **Preconditions** | Invoice INV-2026-001 is in "Submitted" status |
| **Steps** | 1. Open invoice INV-2026-001. 2. Click "Approve". 3. Confirm the approval action. |
| **Expected Result** | Invoice status changes to "Approved". Invoice is forwarded to payment processing. Vendor and AP team receive notification emails. Audit log records: who approved, timestamp, notes. |

---

### AP-TC-004 — AP Team Rejects an Invoice with a Reason

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-C-02 (rejection reason and actor must be in the audit trail) |
| **Preconditions** | Invoice INV-2026-002 is in "Submitted" status |
| **Steps** | 1. Open invoice INV-2026-002. 2. Click "Reject". 3. Enter rejection reason: "Incorrect PO number referenced." 4. Confirm. |
| **Expected Result** | Invoice status changes to "Rejected". Rejection reason is stored and visible. Vendor receives notification with the rejection reason. Audit log updated. |

---

### AP-TC-005 — AP Team Rejects Without Providing a Reason (If Mandatory)

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-C-02 (audit trail without a reason makes rejections unaccountable) |
| **Preconditions** | Rejection reason is a mandatory field |
| **Steps** | 1. Click "Reject" on an invoice. 2. Leave the reason field blank. 3. Click "Confirm". |
| **Expected Result** | Validation error: "Rejection reason is required." Invoice is NOT rejected until a reason is provided. |

---

### AP-TC-006 — Vendor Cannot Approve or Reject Invoices

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-02 (broken access control — vendor reaching AP endpoints), RISK-B-02 (vendor self-approving their own invoice) |
| **Steps** | 1. Log in as a vendor. 2. Attempt to navigate to AP approval URL. 3. Attempt API call to approve endpoint without AP session token. |
| **Expected Result** | Both UI and API return 403 Forbidden. Vendor has no approve/reject capability. |

---

### AP-TC-007 — AP User Cannot Approve Their Own Submitted Invoice (Segregation of Duties)

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-B-02 (segregation of duties gap — self-approval enables fraudulent invoice scheme) |
| **Preconditions** | Applicable if AP users can also submit invoices (scenario to confirm via clarification CQ-3.1) |
| **Steps** | 1. Submit an invoice as User A (AP role). 2. Attempt to approve the same invoice as User A. |
| **Expected Result** | System prevents self-approval. A different AP user must approve. |

---

### AP-TC-008 — Audit Log Captures Approval Action

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-C-02 (missing audit trail = no legal/compliance defence if a payment is disputed) |
| **Steps** | 1. Approve invoice INV-2026-003 as AP user "john.smith". 2. Check the audit log for this invoice. |
| **Expected Result** | Audit entry shows: action = "Approved", user = "john.smith", timestamp = exact time of approval, previous status = "Submitted". |

---

### AP-TC-009 — AP Team Can Filter Invoice Queue by Status

| Field | Details |
|-------|---------|
| **Priority** | P2 |
| **Linked Risks** | — |
| **Steps** | 1. On the invoice queue, apply filter "Status = Submitted". 2. Apply filter "Status = Rejected". |
| **Expected Result** | Each filter returns only invoices matching that status. |

---

### AP-TC-010 — AP Team Can Search Invoice by Invoice Number

| Field | Details |
|-------|---------|
| **Priority** | P2 |
| **Linked Risks** | — |
| **Steps** | 1. Enter invoice number INV-2026-001 in the search bar. |
| **Expected Result** | Only the matching invoice is returned. |

---

### AP-TC-011 — AP Team Cannot See Invoices in Draft Status

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | — |
| **Preconditions** | Vendor has a draft invoice |
| **Steps** | 1. Log in as AP team. 2. Check the invoice queue. |
| **Expected Result** | Draft invoices do NOT appear in the AP queue. Only "Submitted" invoices are visible. |

---

### AP-TC-012 — Approve an Already-Approved Invoice (Idempotency)

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-03 (race condition between two concurrent approvals), RISK-T-01 (second approval triggers a second payment forward) |
| **Preconditions** | Invoice INV-2026-004 is already in "Approved" status |
| **Steps** | 1. Navigate to INV-2026-004. 2. Attempt to click "Approve" again. |
| **Expected Result** | Approve button is disabled or hidden for already-approved invoices. Action is blocked. |

---

### AP-TC-013 — Second-Level Approval for High-Value Invoice (If Applicable)

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-B-02 (without threshold-based approval, a single clerk can approve large fraudulent invoices) |
| **Preconditions** | Clarification CQ-3.2 confirmed: invoices > $50,000 require manager approval |
| **Steps** | 1. AP Clerk approves an invoice for $75,000. 2. Check invoice status after clerk approval. |
| **Expected Result** | Invoice status changes to "Pending Manager Approval", not "Approved". AP Manager receives notification to review. |
