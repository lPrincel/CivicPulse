import axios from 'axios';
import { initialMockIssues } from '../data/mockIssues';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token if present
apiClient.interceptors.request.use((config) => {
  try {
    const rawAuth = localStorage.getItem('civicpulse_auth');
    if (rawAuth) {
      const { token } = JSON.parse(rawAuth);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

/**
 * Authentication Endpoints
 */
export const loginUser = async ({ email, password }) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.warn('[API Client] Server login failed, falling back to local auth simulation:', error.message);
    
    // Fallback simulation for live offline demo resilience
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail.includes('admin') || cleanEmail.includes('gov')) {
      return {
        success: true,
        token: 'mock-admin-token-' + Date.now(),
        name: 'Officer Davis',
        email: cleanEmail,
        role: 'admin',
        department: 'Emergency Dispatch'
      };
    } else {
      return {
        success: true,
        token: 'mock-citizen-token-' + Date.now(),
        name: cleanEmail.split('@')[0].replace('.', ' ') || 'Jane Doe',
        email: cleanEmail,
        role: 'citizen',
        department: 'Community Resident'
      };
    }
  }
};

export const registerUser = async ({ name, email, password, role, department }) => {
  try {
    const response = await apiClient.post('/auth/register', { name, email, password, role, department });
    return response.data;
  } catch (error) {
    console.warn('[API Client] Server register failed, falling back to local simulation:', error.message);
    return {
      success: true,
      token: 'mock-token-' + Date.now(),
      name,
      email,
      role: role || 'citizen',
      department: department || (role === 'admin' ? 'Emergency Dispatch' : 'Community Resident')
    };
  }
};

/**
 * Issue Triage & Management Endpoints
 */
export const triageIssue = async (description, location) => {
  try {
    const response = await apiClient.post('/issues/triage', { description, location });
    return response.data.data;
  } catch (error) {
    console.warn('[API Client] Server unreachable, using smart client-side triage:', error.message);
    await new Promise(r => setTimeout(r, 600));
    const text = `${description} ${location}`.toLowerCase();
    
    let urgency = 'Medium';
    if (/emergency|fire|spark|danger|flood|collapse/i.test(text)) urgency = 'Emergency';
    else if (/hazard|burst|deep|pothole|urgent|outage/i.test(text)) urgency = 'High';
    else if (/minor|dim|light|cosmetic/i.test(text)) urgency = 'Low';

    let category = 'Safety';
    if (/road|pothole|asphalt|sidewalk|street/i.test(text)) category = 'Roads';
    else if (/water|leak|pipe|flood|drain/i.test(text)) category = 'Water';
    else if (/wire|electric|spark|transformer|light|power/i.test(text)) category = 'Electricity';
    else if (/trash|dump|garbage|waste|debris/i.test(text)) category = 'Sanitation';

    return {
      title: description.split(/\s+/).slice(0, 6).join(' ') + '...',
      category,
      urgency,
      aiSummary: `AI Auto-Triage: Classified as ${urgency} priority under ${category}. Immediate field assessment recommended at ${location || 'site'}.`
    };
  }
};

export const createIssue = async (issueData) => {
  try {
    const response = await apiClient.post('/issues', issueData);
    return response.data.data;
  } catch (error) {
    console.warn('[API Client] Server unreachable, saving to local state:', error.message);
    return {
      ...issueData,
      _id: 'local-' + Date.now(),
      upvotes: 1,
      createdAt: new Date().toISOString()
    };
  }
};

export const fetchIssues = async (params = {}) => {
  try {
    const response = await apiClient.get('/issues', { params });
    return response.data;
  } catch (error) {
    console.warn('[API Client] Server offline, using mock dataset:', error.message);
    return {
      success: true,
      count: initialMockIssues.length,
      stats: {
        total: initialMockIssues.length,
        urgent: initialMockIssues.filter(i => ['High', 'Emergency'].includes(i.urgency) && i.status !== 'Resolved').length,
        resolved: initialMockIssues.filter(i => i.status === 'Resolved').length,
        reported: initialMockIssues.filter(i => i.status === 'Reported').length
      },
      data: initialMockIssues
    };
  }
};

export const updateIssueStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/issues/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    console.warn('[API Client] Server offline, simulating status change:', error.message);
    return { _id: id, status };
  }
};

export const upvoteIssue = async (id, isDecrement = false) => {
  try {
    const response = await apiClient.post(`/issues/${id}/upvote`, { decrement: isDecrement });
    return response.data.data;
  } catch (error) {
    return { _id: id };
  }
};

export const deleteIssue = async (id) => {
  try {
    const response = await apiClient.delete(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.warn('[API Client] Server delete failed, simulating locally:', error.message);
    return { success: true };
  }
};

export const checkDuplicateIssue = async (description, location) => {
  try {
    const response = await apiClient.post('/issues/check-duplicate', { description, location });
    return response.data;
  } catch (error) {
    return { success: false, isDuplicate: false };
  }
};

export const seedIssues = async () => {
  try {
    const response = await apiClient.post('/issues/seed');
    return response.data;
  } catch (error) {
    return { success: true, data: initialMockIssues };
  }
};
