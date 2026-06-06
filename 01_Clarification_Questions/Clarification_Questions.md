# Clarification Questions for Ambiguous Requirements

**Document:** CQ-001  
**Project:** B2B Vendor Invoice Management Portal  
**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06  
**Status:** Pending Client Response

---

## Purpose

This document lists clarifying questions raised against each of the seven stated client requirements. These questions must be answered before test design is finalized, as each ambiguity represents a gap that could lead to either over-testing, under-testing, or building the wrong thing.

---

## Requirement 1 — Vendors Can Register and Log In

| # | Question | Why It Matters |
|---|----------|----------------|
| 1.1 | What information is required during vendor registration (company name, tax ID, bank details, contact person, address)? | Determines mandatory field validation test cases |
| 1.2 | Is there a vendor approval/vetting step before a newly registered vendor can log in and submit invoices, or is registration instant? | If there is a vetting step, a whole workflow (admin review, approve/reject registration) needs to be tested |
| 1.3 | What authentication method is supported — username/password, SSO, MFA, or OAuth? | Drives security test cases and session management tests |
| 1.4 | Is Multi-Factor Authentication (MFA) mandatory, optional, or not applicable? | Significant risk if omitted in a financial portal |
| 1.5 | What is the password policy (minimum length, complexity, expiry, history)? | Required for negative login test cases |
| 1.6 | How many failed login attempts are allowed before lockout? What is the lockout duration and unlock mechanism? | Required for brute-force protection test cases |
| 1.7 | Can a single vendor company have multiple user accounts (e.g., a finance manager and an accountant)? | If yes, role management within a vendor org needs to be tested |
| 1.8 | Is there a self-service password reset flow? If so, via email OTP, security questions, or admin intervention? | Needs its own test flow |
| 1.9 | What happens to in-progress invoices if a vendor account is deactivated or suspended? | Edge case with data integrity implications |

---

## Requirement 2 — Vendors Can Submit Invoices Against Purchase Orders

| # | Question | Why It Matters |
|---|----------|----------------|
| 2.1 | What data fields are required on an invoice (invoice number, invoice date, PO number, line items, quantities, unit price, tax, total, bank/payment details)? | Determines form validation test cases |
| 2.2 | Are purchase orders (POs) pre-loaded into the system, or does the vendor manually enter a PO number? | If pre-loaded, matching/validation logic must be tested; if manual, free-text PO numbers risk mismatches |
| 2.3 | Can a single invoice reference multiple POs? Can a single PO be partially invoiced across multiple invoices? | Complex matching scenarios require dedicated test cases |
| 2.4 | What file formats are supported for invoice attachments (PDF, JPEG, TIFF, XML/EDI)? Is attachment mandatory? | Format validation and file size limit tests |
| 2.5 | Is there a maximum file size for invoice attachments? | File size boundary tests |
| 2.6 | Can a vendor save a draft invoice and submit later? | Draft state management tests |
| 2.7 | Can a vendor edit or withdraw a submitted invoice before the AP team acts on it? | Impacts workflow state machine tests |
| 2.8 | What currency is supported — single currency only, or multi-currency? If multi-currency, who sets the exchange rate? | Multi-currency calculation and rounding tests |
| 2.9 | Is there a tax (GST/VAT) calculation built into the system or does the vendor enter the tax amount manually? | Tax calculation accuracy tests |
| 2.10 | What is the maximum number of line items an invoice can have? | Performance and boundary tests |
| 2.11 | Are duplicate invoice numbers detected and blocked? At what scope — per vendor, or globally? | Duplicate detection test cases |
| 2.12 | What happens if a vendor submits an invoice for a PO that has already been fully invoiced? | Over-invoicing prevention test cases |

---

## Requirement 3 — AP Team Can View, Approve, or Reject Invoices

| # | Question | Why It Matters |
|---|----------|----------------|
| 3.1 | Is there a single AP team role, or are there multiple roles (e.g., AP Clerk vs AP Manager) with different approval authorities? | Role-based access and segregation of duty test cases |
| 3.2 | Is there a monetary threshold above which a second-level approval is required? | Multi-level approval workflow tests |
| 3.3 | Is providing a reason mandatory when rejecting an invoice? | Validation test for rejection reason field |
| 3.4 | Can an AP user partially approve an invoice (approve some line items, reject others)? | Partial approval logic and downstream payment impact |
| 3.5 | Can an AP user request additional information from the vendor (a "hold"/"query" status) rather than outright rejecting? | Additional workflow state to test |
| 3.6 | Is there a deadline or SLA by which the AP team must act on a submitted invoice? Does the system enforce/alert on this? | SLA breach notification tests |
| 3.7 | Can an AP user reverse an approval once given (before payment is processed)? | Reversal and audit trail tests |
| 3.8 | How are invoices assigned to AP team members — automatic round-robin, manual assignment, or first-come-first-served queue? | Assignment logic test cases |
| 3.9 | Is there an audit log of all AP actions (who approved/rejected, timestamp, notes)? | Audit trail verification tests |

---

## Requirement 4 — Approved Invoices Are Forwarded for Payment Processing

| # | Question | Why It Matters |
|---|----------|----------------|
| 4.1 | What downstream payment system receives the approved invoices (ERP, bank API, manual export)? | Integration and data handoff tests |
| 4.2 | How is the forwarding done — real-time API call, scheduled batch, email, or file export? | Batch timing, retry logic, and failure handling tests |
| 4.3 | What happens if the payment system is unavailable when forwarding is attempted? Is there a retry mechanism? | Failure handling and notification tests |
| 4.4 | Does the portal show the payment status after forwarding (e.g., "Payment Initiated", "Payment Completed")? If so, how does this status get back to the portal? | Status sync tests |
| 4.5 | What data fields are sent to the payment system — is the vendor's bank account stored in the portal or retrieved from the payment system? | Data mapping and sensitive data handling tests |
| 4.6 | Is there a payment scheduling feature (e.g., pay on net-30 terms)? | Payment scheduling logic tests |
| 4.7 | What happens to a forwarded invoice if the payment fails on the receiving end? Does it revert to a previous status? | Error recovery and state rollback tests |

---

## Requirement 5 — Both Parties Receive Email Notifications on Status Changes

| # | Question | Why It Matters |
|---|----------|----------------|
| 5.1 | What are all the status change events that trigger notifications (submitted, under review, approved, rejected, payment initiated, payment completed, query raised)? | Determines the full notification test matrix |
| 5.2 | Are the email templates fixed or configurable? Who maintains them? | Template rendering and variable substitution tests |
| 5.3 | Can users opt out of specific notification types? | Preference management tests |
| 5.4 | What is the expected SLA for notification delivery (near real-time, within 1 hour)? | Performance tests for notification pipeline |
| 5.5 | Is there a notification log or history visible within the portal? | Audit and troubleshooting tests |
| 5.6 | Who exactly receives the notification — the vendor contact who submitted the invoice, all users in the vendor account, or a configurable email list? | Recipient logic tests |
| 5.7 | Are there any other notification channels besides email (SMS, in-app, Slack integration)? | Scope clarification — not to be assumed out of scope |
| 5.8 | What happens if the vendor's email address is invalid or the email bounces — is the vendor notified in-app, or is the bounce silently ignored? | Bounce handling tests |

---

## Requirement 6 — The System Generates Monthly Invoice Activity Reports

| # | Question | Why It Matters |
|---|----------|----------------|
| 6.1 | What data is included in the monthly report (total invoices submitted, approved, rejected, total value, average processing time, aging buckets)? | Report content validation |
| 6.2 | Who can generate and access the report — AP team only, management, vendors (for their own data), or all roles? | Access control tests for reports |
| 6.3 | Are reports auto-generated and emailed, or manually triggered via the portal? | Scheduling logic or on-demand generation tests |
| 6.4 | In what format is the report available — PDF, Excel, CSV, or on-screen dashboard? | Format and download tests |
| 6.5 | Can users filter the report by vendor, date range, status, or amount range? | Filter logic test cases |
| 6.6 | What time zone is used for the report's monthly boundary? | Boundary date tests across time zones |
| 6.7 | How far back does historical report data go? Is there archiving? | Data retention and archiving tests |
| 6.8 | Does the report include invoices still in pending/draft states, or only finalized ones? | Data inclusion logic tests |

---

## Requirement 7 — Only Authorized Users May Access the System

| # | Question | Why It Matters |
|---|----------|----------------|
| 7.1 | What are the defined user roles (Vendor, AP Clerk, AP Manager, Finance Admin, System Admin)? What permissions does each role have? | The foundation of all access control test cases |
| 7.2 | Is role assignment done by a system admin, or can users self-select roles during registration? | Privilege escalation risk tests |
| 7.3 | Are there IP whitelisting or geographic access restrictions for AP team users? | Network-level access control tests |
| 7.4 | What is the session timeout duration for inactive users? | Session management tests |
| 7.5 | Is there a distinction between "read-only" and "read-write" access within the same role? | Fine-grained permission tests |
| 7.6 | How is the system protected against CSRF, XSS, and SQL injection attacks? | Security test cases |
| 7.7 | Are API endpoints secured separately from the UI — is there a separate API key or OAuth token mechanism for integrations? | API security tests |
| 7.8 | Is there a privileged "super admin" role that bypasses normal access controls? If so, is it audited? | Super admin audit trail tests |
| 7.9 | What compliance standards must the system adhere to (SOC 2, ISO 27001, GDPR, PCI-DSS for payment data)? | Compliance testing scope |

---

## Summary of Highest-Priority Ambiguities

| Priority | Requirement | Ambiguity | Risk if Not Clarified |
|----------|-------------|-----------|----------------------|
| P0 | Req 7 | Exact role definitions and permissions | Entire access control test suite cannot be designed |
| P0 | Req 3 | Whether multi-level approval exists | Core AP workflow test cases are incomplete |
| P0 | Req 4 | Payment forwarding mechanism and failure handling | Cannot test the most financially critical integration |
| P1 | Req 2 | Partial invoicing against a PO | Risk of over-invoicing going undetected |
| P1 | Req 1 | Vendor vetting/approval step | A full workflow branch may be untested |
| P1 | Req 5 | Full list of notification trigger events | Notification gaps could leave parties uninformed |
| P2 | Req 6 | Report access control and content definition | Report may expose data to wrong roles |
