# Test Cases — Vendor Registration & Login

**Module:** REG  
**Requirement:** REQ-001 — Vendors can register and log in to the portal  
**Prepared by:** Akhila Gattu  
**Date:** 2026-06-06

---

## Test Cases

### REG-TC-001 — Successful Vendor Registration

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | — |
| **Preconditions** | User is on the registration page; email address has not been registered before |
| **Test Data** | Company: "ABC Supplies Ltd", Email: vendor_test@abc.com, Password: Test@12345 |
| **Steps** | 1. Navigate to the portal registration page. 2. Fill in all mandatory fields (company name, contact name, email, phone, address, tax ID). 3. Upload required company documents (if applicable). 4. Accept terms and conditions. 5. Click "Register". |
| **Expected Result** | Registration succeeds. Vendor receives a confirmation email. Account is in "Pending Approval" or "Active" state as per business process. |
| **Post-conditions** | Vendor account exists in the system |

---

### REG-TC-002 — Registration with Missing Mandatory Fields

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | — |
| **Preconditions** | User is on the registration page |
| **Test Data** | Leave "Company Name" blank; all other fields filled |
| **Steps** | 1. Fill all fields except Company Name. 2. Click "Register". |
| **Expected Result** | Validation error shown next to Company Name field. Form is NOT submitted. |

---

### REG-TC-003 — Registration with Already-Registered Email

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | — |
| **Preconditions** | vendor_test@abc.com is already registered |
| **Steps** | 1. Attempt registration with the same email. 2. Click "Register". |
| **Expected Result** | Error message: "An account with this email already exists." Registration blocked. |

---

### REG-TC-004 — Registration with Invalid Email Format

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | — |
| **Test Data** | Email: "notanemail", "user@", "@domain.com", "user @domain.com" |
| **Steps** | 1. Enter each invalid email format in the email field. 2. Click "Register". |
| **Expected Result** | Each invalid format is rejected with an appropriate validation message. |

---

### REG-TC-005 — Password Does Not Meet Policy

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | — |
| **Test Data** | "pass" (too short), "password" (no uppercase/number/special char), "12345678" (no letters) |
| **Steps** | 1. Enter each weak password. 2. Attempt to register. |
| **Expected Result** | Each password fails validation with a message describing the specific policy rule violated. |

---

### REG-TC-006 — Successful Login with Valid Credentials

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-05 (session token must be issued fresh on login) |
| **Preconditions** | Active vendor account exists |
| **Test Data** | Email: vendor_test@abc.com, Password: Test@12345 |
| **Steps** | 1. Navigate to login page. 2. Enter valid email and password. 3. Click "Login". |
| **Expected Result** | User is authenticated and redirected to the vendor dashboard. A new session token is issued (not reused from before login). |

---

### REG-TC-007 — Login with Incorrect Password

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | — |
| **Steps** | 1. Enter valid email and incorrect password. 2. Click "Login". |
| **Expected Result** | Error: "Invalid email or password." Account is NOT locked yet. Login page remains active. |

---

### REG-TC-008 — Account Lockout After Repeated Failed Logins

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | — |
| **Steps** | 1. Attempt login with wrong password N times (N = configured lockout threshold, e.g., 5). 2. On attempt N+1, note the system response. |
| **Expected Result** | After N failures, account is locked. User receives a lockout notification email. Correct password is also rejected until the account is unlocked. |

---

### REG-TC-009 — Login with Unregistered Email

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | — |
| **Test Data** | Email: nobody@nowhere.com |
| **Steps** | 1. Enter an email that is not registered. 2. Enter any password. 3. Click "Login". |
| **Expected Result** | Generic error "Invalid email or password." — should NOT reveal that the email is not registered (prevents user enumeration). |

---

### REG-TC-010 — Password Reset Flow

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-05 (reset token must be single-use and time-limited) |
| **Steps** | 1. Click "Forgot Password" on login page. 2. Enter registered email. 3. Check email for reset link. 4. Click link and set new password. 5. Log in with new password. |
| **Expected Result** | Reset email received within expected SLA. Reset link works once and expires after use (or after a time limit). New password accepted for login. |

---

### REG-TC-011 — Password Reset Link Expiry

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-05 (expired token reuse could allow account takeover) |
| **Steps** | 1. Request password reset. 2. Wait until the reset link expires (e.g., 24 hours). 3. Click the expired link. |
| **Expected Result** | System shows "This link has expired. Please request a new password reset." |

---

### REG-TC-012 — Session Timeout After Inactivity

| Field | Details |
|-------|---------|
| **Priority** | P1 |
| **Linked Risks** | RISK-T-05 (stale sessions on shared machines expose other users' data) |
| **Steps** | 1. Log in as a vendor. 2. Leave the session idle for longer than the configured timeout period. 3. Attempt any action (click a menu item). |
| **Expected Result** | User is logged out automatically and redirected to the login page with a message: "Your session has expired." |

---

### REG-TC-013 — Logout

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-05 (token not invalidated on logout = session hijack window) |
| **Steps** | 1. Log in as a vendor. 2. Click "Logout". |
| **Expected Result** | Session is terminated. Browser back button does NOT return to the authenticated state. |

---

### REG-TC-014 — Vendor Cannot Access AP Team Pages

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-T-02 (IDOR / broken access control — vendor accessing AP resources) |
| **Steps** | 1. Log in as a vendor. 2. Manually navigate to the AP team invoice management URL. |
| **Expected Result** | Access denied (403 or redirect to vendor dashboard). |

---

### REG-TC-015 — Login with SQL Injection Attempt

| Field | Details |
|-------|---------|
| **Priority** | P0 |
| **Linked Risks** | RISK-C-01 (sensitive data exposure via injection attack) |
| **Test Data** | Email: `' OR '1'='1`, Password: `' OR '1'='1` |
| **Steps** | 1. Enter SQL injection string in login fields. 2. Click "Login". |
| **Expected Result** | Login fails. Input is sanitized. No database error or information leakage. |
