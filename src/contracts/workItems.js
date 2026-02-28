/**
 * WorkItem API Contracts
 * Maps exactly to backend /api/workitems/* endpoints.
 */

// ── Enums ───────────────────────────────────────────────────────────────────

/** Valid work item statuses from backend WorkItemStatus enum. */
export const WorkItemStatus = Object.freeze({
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
});

// ── Request Models ──────────────────────────────────────────────────────────

/**
 * POST /api/workitems
 * @param {string}  title        – Required. Max 255 chars.
 * @param {string}  [description] – Optional. Max 5000 chars.
 * @param {string}  [assignedToId] – Optional. UUID of operator.
 */
export function createWorkItemRequest(title, description, assignedToId) {
  const req = { title };
  if (description) req.description = description;
  if (assignedToId) req.assignedToId = assignedToId;
  return req;
}

/**
 * PUT /api/workitems/{id}/status
 * @param {string} status – Required. One of WorkItemStatus values.
 */
export function createUpdateStatusRequest(status) {
  return { status };
}

// ── Response Parsers ────────────────────────────────────────────────────────

/**
 * Parse a single WorkItemResponse from backend.
 * Backend shape:
 *   { id, title, description, status, createdById, createdByName,
 *     assignedToId, assignedToName, createdAt, updatedAt }
 */
export function parseWorkItemResponse(data) {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status: data.status,
    createdById: data.createdById,
    createdByName: data.createdByName,
    assignedToId: data.assignedToId,
    assignedToName: data.assignedToName,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Parse the Spring Page<WorkItemResponse> wrapper.
 * Backend shape:
 *   { content, totalElements, totalPages, number, size, first, last }
 */
export function parseWorkItemPage(data) {
  return {
    content: (data.content || []).map(parseWorkItemResponse),
    totalElements: data.totalElements,
    totalPages: data.totalPages,
    number: data.number,
    size: data.size,
    first: data.first,
    last: data.last,
  };
}
