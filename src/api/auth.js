import { apiClient } from './client';

export const login = async (loginData) => {
  return await apiClient.post('/api/user/login', loginData);
};

export const signup = async (signupData) => {
  return await apiClient.post('/api/user/signup', signupData);
};
