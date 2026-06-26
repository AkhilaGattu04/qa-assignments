# Edge Cases & Boundary Conditions

**Document:** EC-001  
**Project:** B2B Vendor Invoice Management Portal  
**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06

---

## Purpose

Edge cases are scenarios that occur at the extreme boundaries of normal operation or at the intersection of two features. They are not covered by happy-path test cases but represent real-world conditions that can expose hidden bugs. This document is organized by feature area.

---

## 1. Vendor Registration & Login

| EC# | Scenario | Expected Behavior | Risk if Not Handled |
|-----|----------|-------------------|---------------------|
| EC-REG-01 | Vendor registers with the maximum allowed character length in every field (e.g., 255-char company name) | All fields save and display correctly; no truncation | Database field overflow, silent data loss |
| EC-REG-02 | Vendor registers with special characters in company name (e.g., `O'Brien & Co. <Ltd>`) | Stored and displayed correctly; not treated as HTML/SQL injection | XSS or SQL injection if not sanitized |
| EC-REG-03 | Two vendors attempt to register with the same email at the exact same millisecond (race condition) | Only one account is created; the other receives a duplicate error | Duplicate accounts with same email |
| EC-REG-04 | Vendor submits registration form twice by double-clicking "Register" | Only one registration is processed | Duplicate account creation |
| EC-REG-05 | Password reset link is clicked after the user has already reset the password using the same link | "Link already used" error; new reset required | Replay attack re-using a consumed token |
| EC-REG-06 | User logs in from two different browsers simultaneously | Both sessions work OR second login invalidates the first (per security policy — needs clarification) | Session confusion or privilege leakage |
| EC-REG-07 | Vendor account is deactivated by admin while the vendor has an active session | Subsequent actions (after deactivation) return 401/403; active session is terminated | Deactivated vendor continues to act |
| EC-REG-08 | Login attempted on an account that was never confirmed via email (if email verification is required) | Error: "Please verify your email address before logging in." | Unverified accounts can transact |

---

## 2. Invoice Submission

| EC# | Scenario | Expected Behavior | Risk if Not Handled |
|-----|----------|-------------------|---------------------|
| EC-INV-01 | Invoice submitted with total amount = $0.00 | System rejects with "Invoice total must be greater than zero" | Zero-dollar invoices enter the payment pipeline |
| EC-INV-02 | Invoice submitted with maximum number of line items (e.g., 999 line items) | Submitted successfully; system handles large payload; AP team can view all items | Performance degradation or page crash on large invoices |
| EC-INV-03 | Invoice line items individually sum to a different total than the entered invoice total (rounding mismatch) | System flags the discrepancy; auto-corrects or rejects with validation error | Incorrect payment amount forwarded |
| EC-INV-04 | Vendor submits invoice during a session timeout (session expires mid-fill) | User is redirected to login; form data is preserved (or a clear message is shown about data loss) | Partial data submitted or silent discard |
| EC-INV-05 | Invoice submitted with invoice date in the future (e.g., dated 2027-01-01) | System warns or blocks future-dated invoices | Invoice dates used for payment scheduling could cause payment deferral bugs |
| EC-INV-06 | Invoice submitted with an invoice date older than 1 year | System warns about or flags aged invoices | Backdated fraudulent invoices |
| EC-INV-07 | Vendor uploads a password-protected PDF as the attachment | System either rejects or notifies AP team that the attachment cannot be opened | AP team cannot review the invoice document |
| EC-INV-08 | Vendor uploads a corrupt/malformed PDF | System rejects with a file validation error, not a server crash | Application crash or server error |
| EC-INV-09 | Vendor uploads a file with a spoofed extension (e.g., a renamed .exe file to .pdf) | Server-side MIME type validation catches the spoofed file and rejects it | Malicious file stored on server |
| EC-INV-10 | Invoice number contains special characters (slashes, quotes: `INV/2026/"001"`) | Stored safely; no routing issues if invoice number is used in URLs | Path traversal or routing bugs |
| EC-INV-11 | PO number is valid but was closed/cancelled after being assigned to the vendor | System checks PO status at submission time and blocks invoices against closed POs | Invoices raised on dead POs |
| EC-INV-12 | Vendor submits an invoice while their registration is under review (not yet approved) | System blocks submission until vendor is fully approved | Unapproved vendor transacts in the system |
| EC-INV-13 | Network drops after vendor clicks "Submit" but before server confirms | Server processes it exactly once; client shows a clear success or failure message (no double-submission on refresh) | Duplicate invoice on page refresh |
| EC-INV-14 | Invoice submitted in a non-default currency (e.g., EUR instead of USD) | Multi-currency handling applies; correct conversion rate used or error shown if not supported | Wrong payment amount due to currency confusion |

---

## 3. AP Team Invoice Actions

| EC# | Scenario | Expected Behavior | Risk if Not Handled |
|-----|----------|-------------------|---------------------|
| EC-AP-01 | Two AP users open the same invoice simultaneously and both try to approve it | Only one approval is processed; second user receives "This invoice has already been processed by [user]." | Invoice approved twice; double payment |
| EC-AP-02 | AP user approves an invoice and then immediately tries to reject the same invoice (race condition on slow network) | Second action is blocked; invoice cannot be both approved and rejected | Inconsistent invoice state |
| EC-AP-03 | AP team's email account receives a very large volume of invoices (500+ in the queue) | Queue loads with pagination; performance is acceptable; no data is lost | Queue overflow; AP team misses invoices |
| EC-AP-04 | Invoice is approved but the vendor's bank details are missing or invalid | Payment forwarding fails gracefully; AP team is notified; invoice reverts to "On Hold" | Payment sent to wrong account or lost |
| EC-AP-05 | AP user approves an invoice that was already withdrawn by the vendor | System checks the current status before allowing approval; "This invoice has been withdrawn." shown | Withdrawn invoice enters payment pipeline |
| EC-AP-06 | AP user account is deactivated mid-review (admin action while AP user has invoice open) | Subsequent "Approve" action returns 401/403; invoice returns to "Submitted" queue | Action taken on behalf of a deactivated user |
| EC-AP-07 | Rejection reason field contains very long text (e.g., 5,000 characters) | Text is either stored in full or truncated with a character limit shown; no crash | Database overflow on rejection reason |
| EC-AP-08 | AP user tries to access an invoice that belongs to a deleted vendor | Invoice is accessible with a note that the vendor account is no longer active | Error or application crash on accessing orphaned record |

---

## 4. Payment Forwarding

| EC# | Scenario | Expected Behavior | Risk if Not Handled |
|-----|----------|-------------------|---------------------|
| EC-PAY-01 | Payment system returns an error response after receiving the invoice | Error is captured, logged, and AP team is alerted; invoice status reflects the failed forwarding | Invoice silently stuck in limbo; vendor never paid |
| EC-PAY-02 | Payment system is temporarily down; portal retries multiple times | Retry occurs up to N times with exponential backoff; if still failing, alert is escalated | Infinite retry loop flooding payment system on recovery |
| EC-PAY-03 | Approved invoice forwarded while the payment system performs a maintenance window | Portal either queues the invoice or alerts that payment is delayed | Invoice lost during system maintenance |
| EC-PAY-04 | Two invoices for the same vendor are approved simultaneously | Both are forwarded independently without interfering with each other | Race condition leads to one payment being dropped |
| EC-PAY-05 | Payment system sends a "success" callback for an invoice that the portal has no record of (orphaned callback) | Orphaned callback is logged and flagged for investigation; no incorrect status update | Ghost payments or data corruption |

---

## 5. Notifications

| EC# | Scenario | Expected Behavior | Risk if Not Handled |
|-----|----------|-------------------|---------------------|
| EC-NOTIF-01 | Notification email service (SMTP) is unavailable when a status change occurs | Status change is saved; notification is queued and retried when service recovers | Notification permanently lost; parties not informed |
| EC-NOTIF-02 | Vendor updates their email address while an invoice is in "Submitted" state | Notification on subsequent status change goes to the new email address (or old, depending on policy — needs clarification) | Notification goes to old email or wrong person |
| EC-NOTIF-03 | Multiple status changes happen in quick succession (submitted → approved → payment initiated within seconds) | All three notifications are sent; none are swallowed or batched into one | Vendor only receives one email and misses important status updates |
| EC-NOTIF-04 | Notification email contains a link back to the portal invoice detail; user clicks while not logged in | Link redirects to login page and then deep-links back to the invoice after authentication | User lands on the homepage with no context after login |

---

## 6. Monthly Reports

| EC# | Scenario | Expected Behavior | Risk if Not Handled |
|-----|----------|-------------------|---------------------|
| EC-RPT-01 | Report generated at midnight on the last day of the month (boundary date) | Invoice submitted at 23:59:59 is included in the month's report; invoice at 00:00:00 is in next month's report | Off-by-one-day inclusion/exclusion of invoices |
| EC-RPT-02 | Report generated for a month that spans a timezone difference (vendor in UTC+5:30, server in UTC) | Report uses a consistent, documented timezone for month boundaries | Invoices near midnight UTC are misclassified into wrong month |
| EC-RPT-03 | Report generation initiated while a very large number of invoices are being inserted simultaneously | Report generation is consistent; uses a snapshot/read-consistent view | Report shows partial data from a concurrent write |
| EC-RPT-04 | User downloads the report while it is still being generated | User receives a loading indicator; download starts only when generation is complete | Corrupt or partial file downloaded |
| EC-RPT-05 | Admin deletes or deactivates a vendor account after invoices were submitted; report is then generated | Report still includes the historical invoices from the deactivated vendor (data integrity preserved) | Historical data lost when vendor account deleted |

---

## 7. Cross-Cutting / Authorization

| EC# | Scenario | Expected Behavior | Risk if Not Handled |
|-----|----------|-------------------|---------------------|
| EC-AUTH-01 | Vendor guesses another vendor's invoice ID and accesses it via direct URL | 403 Forbidden or redirect to their own dashboard; IDOR (Insecure Direct Object Reference) must be prevented | Vendor A reads or manipulates Vendor B's invoice |
| EC-AUTH-02 | Authenticated vendor attempts to call the AP approval API endpoint directly (e.g., via curl) | 403 Forbidden; API endpoint enforces role-based authorization, not just UI hiding | UI hides the button but API is still open |
| EC-AUTH-03 | JWT/session token is modified (e.g., role field changed from "vendor" to "ap_admin") | Tampered token is rejected; signature validation fails | Privilege escalation via token manipulation |
| EC-AUTH-04 | System admin creates a user without assigning a role | User has no permissions; system prompts admin to assign a role before the account can be used | Roleless user causing 500 errors throughout the app |
| EC-AUTH-05 | CSRF attack — attacker crafts a malicious page that auto-submits an approval action on behalf of an AP user who visits it | CSRF token validation rejects the request | Invoices approved or rejected by an attacker |
