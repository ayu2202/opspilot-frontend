/**
 * Auth API Contracts
 * Maps exactly to backend POST /api/auth/login and POST /api/auth/register
 */

// ── Request Models ──────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * @param {string} email    – Required. Must be valid email format.
 * @param {string} password – Required. Cannot be blank.
 */
export function createLoginRequest(email, password) {
  return { email, password };
}

/**
 * POST /api/auth/register
 * @param {string} email    – Required. Must be valid email format.
 * @param {string} password – Required. Min 8 characters.
 * @param {string} fullName – Required. Max 255 characters.
 * @param {string} role     – Required. One of: ADMIN, OPERATOR, VIEWER.
 */
export function createRegisterRequest(email, password, fullName, role) {
  return { email, password, fullName, role };
}

// ── Response Parsers ────────────────────────────────────────────────────────

/**
 * Parse POST /api/auth/login response.
 * Backend shape: { token, type, email, fullName, role }
 */
export function parseLoginResponse(data) {
  return {
    token: data.token,
    type: data.type,
    email: data.email,
    fullName: data.fullName,
    role: data.role,
  };
}

/**
 * Parse POST /api/auth/register response.
 * Backend shape: { id, email, fullName, role, active, createdAt }
 */
export function parseRegisterResponse(data) {
  return {
    id: data.id,
    email: data.email,
    fullName: data.fullName,
    role: data.role,
    active: data.active,
    createdAt: data.createdAt,
  };
}

// ── Stored User (localStorage) ──────────────────────────────────────────────

/**
 * Shape stored in localStorage after login.
 * Derived from LoginResponse — never store the token here.
 */
export function createStoredUser(loginResponse) {
  return {
    email: loginResponse.email,
    fullName: loginResponse.fullName,
    role: loginResponse.role,
  };
}
