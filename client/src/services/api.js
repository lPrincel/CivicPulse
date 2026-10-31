import axios from 'axios';
import { initialMockIssues } from '../data/mockIssues';

const API_BASE_URL = 'http://localhost:5000/api/issues';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Triage issue via AI
 */
export const triageIssue = async (description, location) => {
  try {
    const response = await apiClient.post('/triage', { description, location });
    return response.data.data;
  } catch (error) {
    console.warn('[API Client] Backend unreachable, using client-side mock triage:', error.message);
    
    // Client-side fallback simulation for seamless demo
    await new Promise(r => setTimeout(r, 700)); // subtle realistic delay
    const text = `${description} ${location}`.toLowerCase();
    
    let urgency = 'Medium';
    if (/emergency|fire|spark|danger|flood|collapse/i.test(text)) urgency = 'Emergency';
    else if (/hazard|burst|deep|pothole|urgent/i.test(text)) urgency = 'High';
    else if (/minor|dim|light/i.test(text)) urgency = 'Low';

    let category = 'Safety';
    if (/road|pothole|asphalt|sidewalk/i.test(text)) category = 'Roads';
    else if (/water|leak|pipe|flood/i.test(text)) category = 'Water';
    else if (/wire|electric|spark|transformer|light/i.test(text)) category = 'Electricity';
    else if (/trash|dump|garbage|waste/i.test(text)) category = 'Sanitation';

    return {
      title: description.split(' ').slice(0, 6).join(' ') + '...',
      category,
      urgency,
      aiSummary: `AI Auto-Triage: Classified as ${urgency} priority under ${category}. Immediate field assessment recommended at ${location || 'site'}.`
    };
  }
};

/**
 * Create new issue
 */
export const createIssue = async (issueData) => {
  try {
    const response = await apiClient.post('/', issueData);
    return response.data.data;
  } catch (error) {
    console.warn('[API Client] Backend unreachable, creating local mock issue:', error.message);
    return {
      ...issueData,
      _id: 'local-' + Date.now(),
      createdAt: new Date().toISOString()
    };
  }
};

/**
 * Fetch all issues
 */
export const fetchIssues = async (params = {}) => {
  try {
    const response = await apiClient.get('/', { params });
    return response.data;
  } catch (error) {
    console.warn('[API Client] Backend offline, returning initial mock data:', error.message);
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

/**
 * Update issue status
 */
export const updateIssueStatus = async (id, status) => {
  try {
    const response = await apiClient.patch(`/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    console.warn('[API Client] Backend offline, simulating local status update:', error.message);
    return { _id: id, status };
  }
};
