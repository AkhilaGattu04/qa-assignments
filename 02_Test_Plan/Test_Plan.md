# Test Plan — B2B Vendor Invoice Management Portal

**Document:** TP-001  
**Version:** 1.0  
**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06  
**Status:** Draft — Pending Requirement Clarifications

---

## 1. Introduction

### 1.1 Purpose
This Test Plan defines the testing strategy, scope, approach, and schedule for the B2B Vendor Invoice Management Portal. It serves as the master QA document guiding the test team from requirements analysis through final sign-off.

### 1.2 Project Background
The portal allows vendors (external companies) to register, log in, and submit invoices tied to purchase orders. The internal AP (Accounts Payable) team reviews and approves or rejects those invoices. Approved invoices are forwarded to a downstream payment processor. Both vendors and AP team members receive email notifications on status changes, and the system generates monthly activity reports.

### 1.3 Objectives
- Validate that all functional requirements are correctly implemented
- Verify that role-based access controls prevent unauthorized actions
- Ensure data integrity throughout the invoice lifecycle
- Confirm that notifications fire reliably for every status transition
- Identify security vulnerabilities before production deployment
- Validate performance under expected and peak load

---

## 2. Scope

### 2.1 In Scope

| Module | Description |
|--------|-------------|
| Vendor Registration & Login | Self-registration, field validation, login, password reset, lockout |
| Invoice Submission | Invoice form, PO matching, attachment upload, draft/submit flow |
| AP Team Workflow | Invoice queue, approve/reject actions, rejection reasons, audit log |
| Payment Forwarding | Integration with downstream payment system, status feedback |
| Notifications | Email triggers for all status changes, template rendering |
| Monthly Reports | Report generation, filters, formats, access control |
| Authorization & Security | Role-based access, session management, OWASP top 10 |
| Integration | Portal ↔ Payment system data handoff |
| Performance | Load testing for concurrent vendor submissions and AP actions |

### 2.2 Out of Scope
- The downstream payment processing system itself (only the handoff from this portal is in scope)
- Vendor ERP or accounting system integrations
- Mobile app (unless clarified as in scope)
- Hardware/infrastructure provisioning

---

## 3. Test Types and Approach

### 3.1 Functional Testing
Verify each feature works per specification. Executed using manual test cases and scripted automation for regression.

### 3.2 Integration Testing
Verify the invoice forwarding handoff to the payment system works correctly, including data mapping, failure handling, and retry logic.

### 3.3 Security Testing
- OWASP Top 10 checks (injection, broken auth, sensitive data exposure, IDOR, XSS, CSRF, security misconfiguration)
- Privilege escalation: attempt vendor actions as AP user and vice versa
- API endpoint authorization without a valid session token
- Brute-force protection on login

### 3.4 Performance Testing
- Baseline: 50 concurrent vendor sessions submitting invoices
- Stress: 200 concurrent sessions
- Soak: sustained 50 concurrent sessions for 4 hours
- Peak: month-end report generation under concurrent API load

### 3.5 Negative / Boundary Testing
- Invalid data in all form fields
- File uploads exceeding size limits, wrong formats
- Invoice amounts at min/max boundaries
- PO numbers that do not exist or are already fully invoiced

### 3.6 User Acceptance Testing (UAT)
Executed by business stakeholders (AP team representative and a pilot vendor) to confirm the system meets business expectations before go-live.

### 3.7 Regression Testing
Run automated regression suite after every code change to catch regressions across the full feature set.

### 3.8 Exploratory Testing
Unscripted sessions targeting areas with high complexity or recent changes — primarily the approval workflow and notification triggers.

---

## 4. Test Environment

| Environment | Purpose | Notes |
|-------------|---------|-------|
| DEV | Developer smoke tests | Unstable; not used for formal testing |
| QA | Functional and integration test execution | Mirrors PROD configuration; uses test payment system stub |
| STAGING | UAT and performance tests | Full production parity; real payment system sandbox |
| PRODUCTION | Post-deployment smoke test only | No destructive test data |

### 4.1 Test Data Requirements
- Minimum 5 vendor accounts with varying registration states (pending, active, suspended)
- Minimum 20 pre-loaded Purchase Orders across different vendors and states (open, partially invoiced, fully invoiced, closed)
- AP team accounts at each role level (clerk, manager, admin)
- Payment system sandbox credentials configured in QA and STAGING

---

## 5. Entry and Exit Criteria

### 5.1 Entry Criteria (start testing)
- All P0/P1 clarification questions answered by the client
- QA environment deployed and accessible
- Test data loaded and verified
- Build deployed with release notes and known issues logged
- At least 80% of test cases peer-reviewed

### 5.2 Exit Criteria (sign off testing)
- 100% of P0 test cases executed; 100% pass rate
- 100% of P1 test cases executed; 95% pass rate
- 90% of P2 test cases executed; 90% pass rate
- No open Critical or High severity defects
- All Medium defects reviewed and deferred or accepted by the product owner
- Regression suite passing at 100%
- UAT sign-off obtained from AP team and vendor representative
- Security review completed with no Critical/High vulnerabilities open

---

## 6. Test Case Prioritization

| Priority | Criteria | Examples |
|----------|----------|---------|
| P0 (Must Pass) | Core business flow; failure means system is unusable | Login, invoice submission, AP approve/reject, payment forwarding |
| P1 (High) | Important feature; failure significantly degrades value | Notifications, report generation, access control boundaries |
| P2 (Medium) | Edge case or enhancement; failure is a degraded experience | Draft invoices, pagination of invoice list, report filters |
| P3 (Low) | Cosmetic, UX preference, or trivial edge case | UI label wording, tooltip text, report column ordering |

---

## 7. Roles and Responsibilities

| Role | Responsibility |
|------|---------------|
| QA Lead (Akhila Gattu) | Test plan, test case design, security and integration test execution |
| QA Engineer | Functional test case execution, defect logging |
| Automation Engineer | Automate regression suite (login, invoice flow, notification smoke) |
| Dev Lead | Provide build notes, fix defects, clarify behavior |
| Product Owner | Clarify requirements, triage defects, sign off UAT |
| AP Team Representative | UAT execution, business sign-off |
| Security Reviewer | Penetration test of auth and API layer |

---

## 8. Defect Management

- **Tool:** To be confirmed (JIRA / GitHub Issues recommended)
- **Severity Levels:** Critical → High → Medium → Low → Cosmetic
- **Triage cadence:** Daily during active sprint, bi-weekly during stabilization
- **SLA for fixes:** Critical = same day, High = within 2 days, Medium = within current sprint, Low = backlog

### Severity Definitions

| Severity | Definition |
|----------|-----------|
| Critical | System crash, data loss, payment sent to wrong vendor, security breach |
| High | Core feature broken, no workaround exists (e.g., cannot submit invoice) |
| Medium | Feature works but with incorrect behavior or missing validation |
| Low | Minor UI issues, non-blocking errors, cosmetic problems |

---

## 9. Test Deliverables

| Deliverable | Description |
|-------------|-------------|
| Clarification Questions | CQ-001 — open questions to client |
| Test Plan | This document |
| Test Cases | Detailed step-by-step test cases per module |
| Edge Cases | Boundary and negative scenarios |
| Risk Assessment | Hidden risks and mitigation plan |
| RTM | Requirements Traceability Matrix |
| Bug Report Template | Standard format for defect logging |
| Test Execution Report | Pass/fail summary after each cycle |
| UAT Sign-Off Document | Business acceptance confirmation |

---

## 10. Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Requirement clarifications delayed | High | High | Prioritize P0 clarifications; design test cases around assumptions with flags |
| Payment system sandbox unavailable | Medium | High | Use a mock/stub for QA; ensure staging has real sandbox access |
| Test data contamination in STAGING | Medium | Medium | Automated teardown scripts after each test run |
| Notification delays masking bugs | Medium | Medium | Use a dedicated mailbox with delivery timestamp logging |
| Late UI changes causing regression | High | Medium | Maintain a smoke regression suite that runs on every build |

---

## 11. Automation Strategy

| Phase | Candidate Scenarios | Tool (Recommended) |
|-------|--------------------|--------------------|
| Regression | Login, invoice submission happy path, approve/reject, notification delivery check | Playwright or Cypress |
| API | Invoice create/read/update, AP actions, report download endpoints | Postman / Newman |
| Performance | Concurrent invoice submissions, month-end report generation | k6 or JMeter |
| Security (DAST) | OWASP scan of all endpoints | OWASP ZAP |

---

## 12. Schedule (High-Level)

| Phase | Activity | Duration |
|-------|----------|----------|
| Sprint 0 | Requirement review, clarification, test plan draft | 1 week |
| Sprint 1–2 | Test case design (all modules), RTM setup | 2 weeks |
| Sprint 1–3 | Functional test execution (alongside development) | 6 weeks |
| Sprint 4 | Integration testing (payment forwarding) | 1 week |
| Sprint 4 | Performance and security testing | 1 week |
| Sprint 5 | UAT with business stakeholders | 1 week |
| Sprint 5 | Regression run, defect closure, exit criteria review | 1 week |
| Go-Live | Production smoke test | 1 day |

---

## 13. Approvals

| Name | Role | Date |
|------|------|------|
| Akhila Gattu | QA Lead | |
| [Dev Lead] | Development Lead | |
| [Product Owner] | Product Owner | |
