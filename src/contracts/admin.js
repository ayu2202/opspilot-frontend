/**
 * Admin API Contracts
 * Maps exactly to backend /api/admin/* endpoints.
 */

// ── Enums ───────────────────────────────────────────────────────────────────

/** Valid roles from backend AccessRole enum. */
export const AccessRole = Object.freeze({
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
  VIEWER: 'VIEWER',
});

// ── Request Models ──────────────────────────────────────────────────────────

/**
 * PUT /api/admin/workitems/{id}/assign
 * @param {string} employeeId – Required. UUID of the employee to assign.
 */
export function createAssignWorkItemRequest(employeeId) {
  return { employeeId };
}

// ── Response Parsers ────────────────────────────────────────────────────────

/**
 * Parse GET /api/admin/dashboard response.
 * Backend shape:
 *   { totalWorkItems, openWorkItems, inProgressWorkItems,
 *     completedWorkItems, rejectedWorkItems, myAssignedItems, myCreatedItems }
 */
export function parseDashboardResponse(data) {
  return {
    totalWorkItems: data.totalWorkItems,
    openWorkItems: data.openWorkItems,
    inProgressWorkItems: data.inProgressWorkItems,
    completedWorkItems: data.completedWorkItems,
    rejectedWorkItems: data.rejectedWorkItems,
    myAssignedItems: data.myAssignedItems,
    myCreatedItems: data.myCreatedItems,
  };
}

/**
 * Parse a single EmployeeResponse from backend.
 * Backend shape:
 *   { id, email, fullName, role, active, createdAt }
 */
export function parseEmployeeResponse(data) {
  return {
    id: data.id,
    email: data.email,
    fullName: data.fullName,
    role: data.role,
    active: data.active,
    createdAt: data.createdAt,
  };
}

/**
 * Parse EmployeeResponse[] (e.g. GET /api/admin/employees/operators).
 */
export function parseEmployeeList(dataArray) {
  return (dataArray || []).map(parseEmployeeResponse);
}
