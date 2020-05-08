import request from '@/utils/request';

export async function queryRule(params) {
  return request('/api/articles', {
    params,
  });
}
export async function cityRule(params) {
  return request('/api/cityList', {
    params,
  });
}
export async function addRule(params) {
  return request('/api/article', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/article', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
