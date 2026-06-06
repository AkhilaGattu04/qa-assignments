# B2B Vendor Invoice Management Portal — QA Excellence Assignment

**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06  
**Assignment:** QA Excellence — B2B Use Case Analysis

---

## Project Overview

This repository contains all QA artifacts for the **B2B Vendor Invoice Management Portal**, a system that allows vendors to register, submit invoices against purchase orders, and enables the AP (Accounts Payable) team to review, approve, or reject those invoices with downstream payment processing and notifications.

---

## Folder Structure

| Folder | Contents |
|--------|----------|
| [01_Clarification_Questions](./01_Clarification_Questions/) | Questions raised for ambiguous or incomplete requirements |
| [02_Test_Plan](./02_Test_Plan/) | Master test plan covering scope, strategy, entry/exit criteria |
| [03_Test_Cases](./03_Test_Cases/) | Detailed test cases grouped by feature module |
| [04_Edge_Cases](./04_Edge_Cases/) | Edge cases and boundary conditions per feature area |
| [05_Risk_Assessment](./05_Risk_Assessment/) | Hidden risks, likelihood/impact analysis, and mitigations |
| [06_RTM](./06_RTM/) | Requirements Traceability Matrix mapping requirements to test cases |
| [07_Bug_Report_Template](./07_Bug_Report_Template/) | Standard bug report template with a sample defect |

---

## Client Requirements Summary

1. Vendors can register and log in to the portal
2. Vendors can submit invoices against purchase orders
3. The AP team can view, approve, or reject invoices
4. Approved invoices are forwarded for payment processing
5. Both parties receive email notifications on status changes
6. The system generates monthly invoice activity reports
7. Only authorized users may access the system

---

## QA Approach Summary

- **Methodology:** Risk-based testing with functional, integration, security, and UAT layers
- **Priority:** Security and access control are P0 given the financial nature of the system
- **Automation Candidates:** Login flows, invoice submission happy path, notification triggers, report generation
- **Manual Focus:** AP team decision workflows, edge case invoice data, cross-role access checks
