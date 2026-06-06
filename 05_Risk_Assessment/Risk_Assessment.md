# Risk Assessment — Hidden Risks & Mitigation Plan

**Document:** RA-001  
**Project:** B2B Vendor Invoice Management Portal  
**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06

---

## Risk Scoring Matrix

| Likelihood | Impact | Risk Score |
|-----------|--------|-----------|
| High | High | Critical |
| High | Medium | High |
| Medium | High | High |
| Medium | Medium | Medium |
| Low | High | Medium |
| Low | Medium | Low |
| Any | Low | Low |

---

## Technical Risks

### RISK-T-01 — Double Payment Due to Duplicate Invoice Forwarding

| Attribute | Detail |
|-----------|--------|
| **Category** | Data Integrity / Integration |
| **Likelihood** | Medium |
| **Impact** | Critical |
| **Risk Score** | Critical |
| **Hidden Nature** | This risk is invisible if only the happy path is tested. It surfaces under retry scenarios, network timeouts, or concurrent approvals. |
| **Scenario** | Invoice forwarding to the payment system times out. The portal retries. Both the original and retry message are processed, resulting in the vendor being paid twice. |
| **Mitigation** | Implement idempotency keys on all payment forwarding requests. Payment system must reject requests with a duplicate idempotency key. Test with simulated network timeouts. |

---

### RISK-T-02 — IDOR (Insecure Direct Object Reference) Allows Cross-Vendor Data Access

| Attribute | Detail |
|-----------|--------|
| **Category** | Security |
| **Likelihood** | High |
| **Impact** | Critical |
| **Risk Score** | Critical |
| **Hidden Nature** | Not visible in happy-path testing. Requires specific adversarial test: guess another vendor's invoice ID. |
| **Scenario** | Invoice IDs are sequential integers (e.g., /invoices/1001). Vendor B increments the ID in the URL to access Vendor A's invoice (/invoices/1000), seeing confidential pricing data. |
| **Mitigation** | Use non-guessable IDs (UUIDs) for all resources. Server-side authorization must verify resource ownership on every request — not just check if the user is logged in. Add IDOR-specific test cases to the security suite. |

---

### RISK-T-03 — Race Condition on Concurrent AP Approvals Leading to Inconsistent State

| Attribute | Detail |
|-----------|--------|
| **Category** | Concurrency |
| **Likelihood** | Medium |
| **Impact** | High |
| **Risk Score** | High |
| **Hidden Nature** | Invisible in single-user functional testing. Requires concurrent test execution to surface. |
| **Scenario** | Two AP users open the same invoice simultaneously. Both see "Submitted" status. Both click "Approve" within milliseconds of each other. The system processes both, resulting in the invoice being approved twice and forwarded to payment twice. |
| **Mitigation** | Implement optimistic or pessimistic locking on invoice state transitions. Use a database-level constraint or compare-and-swap: transition is only allowed from the expected prior state. |

---

### RISK-T-04 — Notification Service Failure Silently Swallows Notifications

| Attribute | Detail |
|-----------|--------|
| **Category** | Reliability |
| **Likelihood** | Medium |
| **Impact** | Medium |
| **Risk Score** | Medium |
| **Hidden Nature** | Invoice state changes correctly but emails are silently dropped. No functional test will fail; only end-to-end testing with email verification catches this. |
| **Scenario** | Email delivery service is temporarily unavailable. Notifications are not queued for retry; they are simply dropped. Vendors never know their invoice was approved or rejected. |
| **Mitigation** | Use a message queue (e.g., SQS, RabbitMQ) between the portal and the email service. Implement dead-letter queues for failed notifications. Alert on dead-letter queue depth. |

---

### RISK-T-05 — Session Fixation / Session Token Not Rotated After Login

| Attribute | Detail |
|-----------|--------|
| **Category** | Security |
| **Likelihood** | Medium |
| **Impact** | High |
| **Risk Score** | High |
| **Hidden Nature** | Standard functional testing never checks the session token value before and after login. |
| **Scenario** | An attacker obtains a pre-authentication session token (e.g., from a shared computer). If the application reuses the same token after login, the attacker can hijack the authenticated session. |
| **Mitigation** | Issue a new session token on every successful login. Invalidate all prior tokens. Verify this in security testing by capturing pre- and post-login tokens. |

---

### RISK-T-06 — Report Generation Inconsistency Due to Non-Transactional Read

| Attribute | Detail |
|-----------|--------|
| **Category** | Data Integrity |
| **Likelihood** | Low |
| **Impact** | Medium |
| **Risk Score** | Low |
| **Hidden Nature** | Only occurs when reports are generated while invoices are actively being submitted/approved — a real month-end scenario. |
| **Scenario** | The report generator reads invoice data across multiple database queries without a consistent snapshot. Invoice INV-X is submitted mid-read and appears in the count but not in the value sum, leading to a discrepancy. |
| **Mitigation** | Wrap report generation in a read-consistent transaction or use a reporting database snapshot. Test report generation while simulating concurrent invoice operations. |

---

## Business / Process Risks

### RISK-B-01 — Invoice Submitted Without a Valid Purchase Order Creates Orphaned Liability

| Attribute | Detail |
|-----------|--------|
| **Category** | Business Process |
| **Likelihood** | Medium |
| **Impact** | High |
| **Risk Score** | High |
| **Scenario** | The system allows invoice submission with a free-text PO number that is never validated. AP team approves it without noticing the PO doesn't exist. Company pays for goods/services never ordered. |
| **Mitigation** | PO number must be validated against a master PO list at submission time. If POs are not pre-loaded, escalate this as a critical clarification item. |

---

### RISK-B-02 — Lack of Segregation of Duties Enables Fraudulent Invoice Approval

| Attribute | Detail |
|-----------|--------|
| **Category** | Business Process / Security |
| **Likelihood** | Low |
| **Impact** | Critical |
| **Risk Score** | High |
| **Scenario** | If an AP user can also register as a vendor, they could submit a fraudulent invoice and then approve it themselves, directing payment to their own account. |
| **Mitigation** | Enforce strict role separation — no user can hold both vendor and AP roles. If a user associated with the company also acts as a vendor, flag for compliance review. Self-approval must be technically blocked. |

---

### RISK-B-03 — Email Notification Goes to Wrong Person After Contact Update

| Attribute | Detail |
|-----------|--------|
| **Category** | Business Process |
| **Likelihood** | Medium |
| **Impact** | Medium |
| **Risk Score** | Medium |
| **Scenario** | A vendor company has multiple users. A junior employee submitted an invoice. The company updates their primary contact. Approval/rejection notification goes to the new primary contact, not the person who submitted the invoice — causing confusion or missed action. |
| **Mitigation** | Notifications for an invoice should go to the user who submitted it (stored at submission time) AND optionally the current primary contact. Clarify this policy with the client. |

---

### RISK-B-04 — Monthly Report Not Covering All Invoices Due to Timezone Mismatch

| Attribute | Detail |
|-----------|--------|
| **Category** | Business Process |
| **Likelihood** | Medium |
| **Impact** | Medium |
| **Risk Score** | Medium |
| **Scenario** | The system stores timestamps in UTC. Vendors in UTC+5:30 submit invoices on June 1st at 1:00 AM their local time (which is May 31st 7:30 PM UTC). The June report misses these invoices; the May report includes them unexpectedly. Causes reconciliation issues. |
| **Mitigation** | Clearly define which timezone governs month boundaries for reports. Communicate this to vendors. Consider showing local time in the UI alongside UTC. |

---

## Compliance & Regulatory Risks

### RISK-C-01 — Sensitive Financial Data Not Encrypted at Rest or in Transit

| Attribute | Detail |
|-----------|--------|
| **Category** | Compliance / Security |
| **Likelihood** | Low |
| **Impact** | Critical |
| **Risk Score** | High |
| **Scenario** | Vendor bank account numbers are stored in plaintext in the database. A database breach exposes all vendor banking details. If PCI-DSS or equivalent applies, the company faces regulatory penalties. |
| **Mitigation** | Encrypt sensitive fields at rest (AES-256). Enforce HTTPS/TLS 1.2+ for all data in transit. Obtain clarity on compliance requirements (CQ-7.9). |

---

### RISK-C-02 — No Audit Trail for AP Actions Exposes Liability

| Attribute | Detail |
|-----------|--------|
| **Category** | Compliance |
| **Likelihood** | Medium |
| **Impact** | High |
| **Risk Score** | High |
| **Scenario** | An invoice is approved and paid. The vendor disputes the amount. The AP team has no log of who approved it, when, or what notes were added. The company cannot reconstruct the approval chain for audit or legal purposes. |
| **Mitigation** | Immutable audit log must be a core system feature. Every state transition records: actor (user ID + name), timestamp, action, previous state, new state, and any notes. Audit logs must be tamper-evident. |

---

## Summary Risk Register

| Risk ID | Title | Score | Owner | Status |
|---------|-------|-------|-------|--------|
| RISK-T-01 | Double payment via duplicate forwarding | Critical | Dev Lead | Open |
| RISK-T-02 | IDOR cross-vendor data access | Critical | Security Lead | Open |
| RISK-T-03 | Race condition on concurrent AP approvals | High | Dev Lead | Open |
| RISK-T-04 | Notification silent failures | Medium | Dev/DevOps | Open |
| RISK-T-05 | Session fixation after login | High | Dev Lead | Open |
| RISK-T-06 | Non-transactional report reads | Low | Dev Lead | Open |
| RISK-B-01 | Invoice without valid PO | High | Product Owner | Open — pending CQ |
| RISK-B-02 | Segregation of duties gap | High | Product Owner | Open |
| RISK-B-03 | Notification wrong recipient | Medium | Product Owner | Open — pending CQ |
| RISK-B-04 | Timezone mismatch in reports | Medium | Dev Lead | Open — pending CQ |
| RISK-C-01 | Sensitive data not encrypted | High | Architect | Open — pending CQ |
| RISK-C-02 | No audit trail for AP actions | High | Architect | Open |
