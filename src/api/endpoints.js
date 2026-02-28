import api from './axios';
import {
  createLoginRequest,
  parseLoginResponse,
  createUpdateStatusRequest,
  parseWorkItemPage,
  parseWorkItemResponse,
  createAssignWorkItemRequest,
  parseDashboardResponse,
  parseEmployeeList,
} from '../contracts';

// ── Auth ────────────────────────────────────────────────────────────────────

/** POST /api/auth/login */
export const login = async (email, password) => {
  const res = await api.post('/api/auth/login', createLoginRequest(email, password));
  return parseLoginResponse(res.data);
};

// ── Admin ───────────────────────────────────────────────────────────────────

/** GET /api/admin/dashboard */
export const getAdminDashboard = async () => {
  const res = await api.get('/api/admin/dashboard');
  return parseDashboardResponse(res.data);
};

/** GET /api/admin/employees/operators */
export const getOperators = async () => {
  const res = await api.get('/api/admin/employees/operators');
  return parseEmployeeList(res.data);
};

/** GET /api/admin/workitems (paginated, all work items) */
export const getAllWorkItems = async (page = 0, size = 10, sortBy = 'createdAt', direction = 'desc') => {
  const res = await api.get('/api/admin/workitems', {
    params: { page, size, sortBy, direction },
  });
  return parseWorkItemPage(res.data);
};

/** POST /api/admin/demo-data — seed demo work items */
export const loadDemoData = async () => {
  const res = await api.post('/api/admin/demo-data');
  return res.data;
};

/** PUT /api/admin/workitems/{id}/assign */
export const assignWorkItem = async (id, employeeId) => {
  const res = await api.put(
    `/api/admin/workitems/${id}/assign`,
    createAssignWorkItemRequest(employeeId),
  );
  return parseWorkItemResponse(res.data);
};

// ── WorkItems ───────────────────────────────────────────────────────────────

/** GET /api/workitems/my/paginated */
export const getMyWorkItems = async (page = 0, size = 10) => {
  const res = await api.get('/api/workitems/my/paginated', {
    params: { page, size },
  });
  return parseWorkItemPage(res.data);
};

/** PUT /api/workitems/{id}/status */
export const updateWorkItemStatus = async (id, status) => {
  const res = await api.put(
    `/api/workitems/${id}/status`,
    createUpdateStatusRequest(status),
  );
  return parseWorkItemResponse(res.data);
};
