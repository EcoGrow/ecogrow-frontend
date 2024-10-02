import React, { useState } from 'react';
import { login } from '../../api/auth';

const redirectToKakaoLogin = () => {
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID; // 환경 변수에서 클라이언트 ID 가져오기
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI; // 환경 변수에서 리다이렉트 URI 가져오기

  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  window.location.href = kakaoLoginUrl;
};

const LoginForm = ({ toggleMode, setMessage, setIsMessageVisible }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login(formData);

      if (response.status === 200) {
        setMessage('로그인 성공!');
        localStorage.setItem('access_token', response.data.token);  // 로그인 성공 시 JWT 토큰 저장
      } else {
        setMessage('로그인 실패. 다시 시도해 주세요.');
      }
    } catch (error) {
      setMessage('로그인 실패. 다시 시도해 주세요.');
    }

    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
      setMessage('');
    }, 3000);
  };

  return (
      <form className="form login-form" onSubmit={handleLogin}>
        <h2>Sign In</h2>
        <input
            type="text"
            placeholder="Username"
            className="input"
            name="username"
            onChange={handleInputChange}
        />
        <input
            type="password"
            placeholder="Password"
            className="input"
            name="password"
            onChange={handleInputChange}
        />
        <div className="social-login">
          <button className="social-btn google-btn">
            <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                alt="Google Icon"
            />
            Sign in with Google
          </button>
          <button className="social-btn kakao-btn" onClick={redirectToKakaoLogin}>
            <img
                src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                alt="Kakao"
            />
            Sign in with Kakao
          </button>
        </div>
        <button className="btn" type="submit">Sign In</button>
        <p>
          Don't have an account?{' '}
          <span className="toggle-link" onClick={toggleMode}>
          Sign Up
        </span>
        </p>
      </form>
  );
};

export default LoginForm;