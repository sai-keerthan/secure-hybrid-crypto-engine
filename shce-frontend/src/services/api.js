import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const healthCheck = () => api.get('/health');
export const listAlgorithms = (mode) => api.get('/keys/algorithms', { params: mode ? { mode } : {} });
export const generateKeys = (algorithm) => api.post('/keys/generate', { algorithm });
export const encrypt = (algorithm, inputData, keyPem) => api.post('/crypto/encrypt', { algorithm, inputData, keyPem });
export const decrypt = (algorithm, inputData, keyPem) => api.post('/crypto/decrypt', { algorithm, inputData, keyPem });
export const sign = (algorithm, inputData, keyPem) => api.post('/crypto/sign', { algorithm, inputData, keyPem });
export const verify = (algorithm, inputData, keyPem, signatureBase64) => api.post('/crypto/verify', { algorithm, inputData, keyPem, signatureBase64 });

export default api;
