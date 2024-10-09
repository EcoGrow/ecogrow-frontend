import { apiClient } from './client';

export const login = async (loginData) => {
  return await apiClient.post('/api/user/login', loginData);
};

export const signup = async (signupData) => {
  return await apiClient.post('/api/user/signup', signupData);
};

export const kakaoLogin = async (code) => {
  try {
    // apiClient를 사용하여 요청을 보냄
    const response = await apiClient.get(`/api/user/kakao/callback?code=${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 구글 로그인 메서드 추가
export const googleLogin = async (code) => {
  try {
    // apiClient를 사용하여 요청을 보냄
    const response = await apiClient.get(`/api/user/google/callback?code=${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};