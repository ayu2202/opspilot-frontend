import axios from 'axios';
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

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// ── Debug: Health Check ─────────────────────────────────────────────────────

/** GET /actuator/health — temporary debug endpoint */
export const checkBackendHealth = async () => {
  const url = `${BASE_URL}/actuator/health`;
  console.log('[HealthCheck] Calling:', url);
  try {
    const res = await axios.get(url, { timeout: 10000 });
    console.log('[HealthCheck] Response:', res.status, res.data);
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    console.error('[HealthCheck] Error:', err);
    if (err.code === 'ECONNABORTED') {
      return { ok: false, message: 'Request timeout — backend may be sleeping or blocked.' };
    }
    if (!err.response) {
      return { ok: false, message: 'Unable to reach backend. Check CORS or server status.' };
    }
    return { ok: false, message: `Backend responded with ${err.response.status}`, data: err.response.data };
  }
};

// ── Auth ────────────────────────────────────────────────────────────────────

/** POST /api/auth/login */
export const login = async (email, password) => {
  const loginUrl = BASE_URL + '/api/auth/login';
  const payload = createLoginRequest(email, password);
  console.log('[Login] Sending request to:', loginUrl);
  console.log('[Login] Payload:', { email, password: '***' });
  try {
    const res = await api.post('/api/auth/login', payload, { timeout: 10000 });
    console.log('[Login] Response status:', res.status);
    console.log('[Login] Login success:', res.data);
    return parseLoginResponse(res.data);
  } catch (err) {
    console.error('[Login] Login error:', err);
    if (err.code === 'ECONNABORTED') {
      const timeoutErr = new Error('Request timeout — backend may be sleeping or blocked.');
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }
    if (!err.response) {
      const networkErr = new Error('Unable to reach backend. Check CORS or server status.');
      networkErr.isNetworkError = true;
      throw networkErr;
    }
    throw err;
  }
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
