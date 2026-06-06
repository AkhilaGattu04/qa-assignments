# Requirements Traceability Matrix (RTM)

**Document:** RTM-001  
**Project:** B2B Vendor Invoice Management Portal  
**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06

---

## Purpose

The RTM maps each client requirement to its corresponding test cases, ensuring complete test coverage. It also links test cases to risks where applicable, providing visibility into which risks are mitigated by which tests.

---

## How to Read This Matrix

- **REQ-ID**: The requirement identifier
- **Requirement**: Short description of the requirement
- **Test Case IDs**: All test cases written to cover this requirement
- **Coverage %**: Estimated coverage of the requirement by current test cases
- **Linked Risks**: Risks from the Risk Assessment that are relevant to this requirement
- **Status**: Not Started / In Design / Ready / Executed

---

## Traceability Table

| REQ-ID | Requirement | Module | Test Case IDs | Coverage | Linked Risks | Status |
|--------|-------------|--------|---------------|----------|-------------|--------|
| REQ-001 | Vendors can register and log in | REG | REG-TC-001, REG-TC-002, REG-TC-003, REG-TC-004, REG-TC-005, REG-TC-006, REG-TC-007, REG-TC-008, REG-TC-009, REG-TC-010, REG-TC-011, REG-TC-012, REG-TC-013, REG-TC-014, REG-TC-015 | 90% | RISK-T-05, RISK-T-02 | In Design |
| REQ-002 | Vendors can submit invoices against purchase orders | INV | INV-TC-001, INV-TC-002, INV-TC-003, INV-TC-004, INV-TC-005, INV-TC-006, INV-TC-007, INV-TC-008, INV-TC-009, INV-TC-010, INV-TC-011, INV-TC-012, INV-TC-013, INV-TC-014, INV-TC-015, INV-TC-016 | 92% | RISK-B-01, RISK-T-02 | In Design |
| REQ-003 | AP team can view, approve, or reject invoices | AP | AP-TC-001, AP-TC-002, AP-TC-003, AP-TC-004, AP-TC-005, AP-TC-006, AP-TC-007, AP-TC-008, AP-TC-009, AP-TC-010, AP-TC-011, AP-TC-012, AP-TC-013 | 88% | RISK-T-03, RISK-B-02, RISK-C-02 | In Design |
| REQ-004 | Approved invoices forwarded for payment processing | PAY | PAY-TC-001, PAY-TC-002, PAY-TC-003, PAY-TC-004, PAY-TC-005 | 85% | RISK-T-01, RISK-C-01 | In Design |
| REQ-005 | Both parties receive email notifications on status changes | NOTIF | NOTIF-TC-001, NOTIF-TC-002, NOTIF-TC-003, NOTIF-TC-004, NOTIF-TC-005, NOTIF-TC-006, NOTIF-TC-007, NOTIF-TC-008 | 90% | RISK-T-04, RISK-B-03 | In Design |
| REQ-006 | System generates monthly invoice activity reports | RPT | RPT-TC-001, RPT-TC-002, RPT-TC-003, RPT-TC-004, RPT-TC-005, RPT-TC-006 | 85% | RISK-T-06, RISK-B-04 | In Design |
| REQ-007 | Only authorized users may access the system | AUTH | REG-TC-014, AP-TC-006, AP-TC-007, INV-TC-003, INV-TC-016, RPT-TC-006, EC-AUTH-01 through EC-AUTH-05 (Edge Cases) | 80% | RISK-T-02, RISK-T-05, RISK-B-02, RISK-C-01 | In Design |

---

## Test Case to Requirement Reverse Mapping

This section allows quick lookup: given a test case, which requirement does it cover?

| Test Case ID | Requirement(s) Covered | Priority |
|-------------|----------------------|----------|
| REG-TC-001 | REQ-001 | P0 |
| REG-TC-002 | REQ-001 | P0 |
| REG-TC-003 | REQ-001 | P1 |
| REG-TC-004 | REQ-001 | P1 |
| REG-TC-005 | REQ-001 | P1 |
| REG-TC-006 | REQ-001 | P0 |
| REG-TC-007 | REQ-001 | P0 |
| REG-TC-008 | REQ-001, REQ-007 | P0 |
| REG-TC-009 | REQ-001 | P1 |
| REG-TC-010 | REQ-001 | P1 |
| REG-TC-011 | REQ-001 | P1 |
| REG-TC-012 | REQ-001, REQ-007 | P1 |
| REG-TC-013 | REQ-001, REQ-007 | P0 |
| REG-TC-014 | REQ-001, REQ-007 | P0 |
| REG-TC-015 | REQ-001, REQ-007 | P0 |
| INV-TC-001 | REQ-002 | P0 |
| INV-TC-002 | REQ-002 | P0 |
| INV-TC-003 | REQ-002, REQ-007 | P0 |
| INV-TC-004 | REQ-002 | P0 |
| INV-TC-005 | REQ-002 | P1 |
| INV-TC-006 | REQ-002 | P0 |
| INV-TC-007 | REQ-002 | P1 |
| INV-TC-008 | REQ-002 | P1 |
| INV-TC-009 | REQ-002 | P1 |
| INV-TC-010 | REQ-002 | P1 |
| INV-TC-011 | REQ-002 | P2 |
| INV-TC-012 | REQ-002 | P2 |
| INV-TC-013 | REQ-002 | P2 |
| INV-TC-014 | REQ-002 | P2 |
| INV-TC-015 | REQ-002 | P1 |
| INV-TC-016 | REQ-002, REQ-007 | P0 |
| AP-TC-001 | REQ-003 | P0 |
| AP-TC-002 | REQ-003 | P0 |
| AP-TC-003 | REQ-003, REQ-004 | P0 |
| AP-TC-004 | REQ-003 | P0 |
| AP-TC-005 | REQ-003 | P1 |
| AP-TC-006 | REQ-003, REQ-007 | P0 |
| AP-TC-007 | REQ-003, REQ-007 | P0 |
| AP-TC-008 | REQ-003 | P1 |
| AP-TC-009 | REQ-003 | P2 |
| AP-TC-010 | REQ-003 | P2 |
| AP-TC-011 | REQ-003 | P1 |
| AP-TC-012 | REQ-003 | P1 |
| AP-TC-013 | REQ-003 | P1 |
| PAY-TC-001 | REQ-004 | P0 |
| PAY-TC-002 | REQ-004 | P1 |
| PAY-TC-003 | REQ-004 | P1 |
| PAY-TC-004 | REQ-004 | P0 |
| PAY-TC-005 | REQ-004 | P0 |
| NOTIF-TC-001 | REQ-005 | P1 |
| NOTIF-TC-002 | REQ-005 | P0 |
| NOTIF-TC-003 | REQ-005 | P0 |
| NOTIF-TC-004 | REQ-005 | P1 |
| NOTIF-TC-005 | REQ-005 | P2 |
| NOTIF-TC-006 | REQ-005 | P1 |
| NOTIF-TC-007 | REQ-005 | P1 |
| NOTIF-TC-008 | REQ-005 | P1 |
| RPT-TC-001 | REQ-006 | P1 |
| RPT-TC-002 | REQ-006 | P1 |
| RPT-TC-003 | REQ-006, REQ-007 | P0 |
| RPT-TC-004 | REQ-006 | P2 |
| RPT-TC-005 | REQ-006 | P2 |
| RPT-TC-006 | REQ-006, REQ-007 | P0 |

---

## Coverage Summary

| Requirement | Total Test Cases | P0 | P1 | P2 | Coverage |
|-------------|-----------------|----|----|----|----|
| REQ-001 — Register & Login | 15 | 6 | 8 | 1 | 90% |
| REQ-002 — Invoice Submission | 16 | 5 | 7 | 4 | 92% |
| REQ-003 — AP Approve/Reject | 13 | 5 | 6 | 2 | 88% |
| REQ-004 — Payment Forwarding | 5 | 3 | 2 | 0 | 85% |
| REQ-005 — Notifications | 8 | 2 | 5 | 1 | 90% |
| REQ-006 — Reports | 6 | 2 | 2 | 2 | 85% |
| REQ-007 — Authorization | Shared across all modules | — | — | — | 80% |
| **TOTAL** | **63+** | **23** | **30** | **10** | **~88%** |

> Note: Coverage gaps (10–20%) will be addressed once clarification questions are answered, particularly around role definitions, multi-level approvals, and compliance requirements.

---

## Gaps Requiring Clarification Before Full Coverage

| Gap Area | Blocked By | Expected Coverage After Resolution |
|----------|-----------|-----------------------------------|
| Multi-level approval workflow | CQ-3.2 (approval thresholds) | +4 test cases for AP module |
| Vendor registration vetting step | CQ-1.2 (approval vs instant) | +3 test cases for REG module |
| Full list of notification triggers | CQ-5.1 (all status events) | +3 test cases for NOTIF module |
| Compliance scope | CQ-7.9 (SOC2/PCI requirements) | +security test cases |
| Report access by role | CQ-6.2 (who can access reports) | +2 test cases for RPT/AUTH |
