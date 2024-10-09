import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kakaoLogin } from '../../api/auth';

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');

    const handleKakaoLogin = async () => {
      try {
        console.log('카카오 로그인 시작');
        setLoading(true);
        const response = await Promise.race([
          kakaoLogin(code),
          new Promise((_, reject) =>
              setTimeout(() => reject(new Error('요청 시간 초과')), 10000)
          )
        ]);

        console.log('카카오 로그인 응답:', response);

        // 성공적인 응답 처리
        if (response.statuscode === '200' && response.msg === '카카오 로그인 성공') {
          console.log('카카오 로그인 성공');
          if (response.data) {
            localStorage.setItem('access_token', response.data);
          }
          // 메인 페이지로 리다이렉트
          navigate('/');
          return; // 함수 종료
        }

        // 응답에 토큰이 없거나 기타 오류 상황
        if (!response.data) {
          throw new Error(response.msg || '유효한 토큰을 받지 못했습니다');
        }

      } catch (error) {
        console.error('카카오 로그인 오류:', error);
        setError(error.response?.data?.msg || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      handleKakaoLogin();
    } else {
      setError('인증 코드가 없습니다');
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return <div>카카오 로그인 처리 중...</div>;
  }

  if (error) {
    return (
        <div>
          <p>오류가 발생했습니다: {error}</p>
          <button onClick={() => navigate('/')}>로그인 페이지로 돌아가기</button>
        </div>
    );
  }

  return null;
};

export default KakaoCallback;