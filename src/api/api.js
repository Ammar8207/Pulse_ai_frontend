import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://customerpulse-backend-01cj.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

function normalizeError(error) {
  return error?.response?.data?.message || error?.message || 'Request failed.';
}

async function request(method, url, data, options = {}) {
  const { onLoadingChange } = options;

  if (typeof onLoadingChange === 'function') {
    onLoadingChange(true);
  }

  try {
    const response = await apiClient.request({
      method,
      url,
      data,
    });

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: normalizeError(error),
    };
  } finally {
    if (typeof onLoadingChange === 'function') {
      onLoadingChange(false);
    }
  }
}

export function getDashboardSummary(options) {
  return request('get', '/dashboard-summary', undefined, options);
}

export function predictChurn(customerData, options) {
  return request('post', '/predict-churn', customerData, options);
}

export function getForecast(options) {
  return request('get', '/forecast', undefined, options);
}

export function getFeatureImportance(options) {
  return request('get', '/feature-importance', undefined, options);
}

export function createLoadingState() {
  return {
    loading: false,
    error: null,
    data: null,
  };
}

export default apiClient;