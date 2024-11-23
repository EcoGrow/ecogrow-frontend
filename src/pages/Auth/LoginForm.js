import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login} from '../../api/auth';
import './LoginForm.css';

const redirectToKakaoLogin = (e) => {
  e.preventDefault();
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  window.location.href = kakaoLoginUrl;
};

const redirectToGoogleLogin = (e) => {
  e.preventDefault();
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20profile%20email`;
  window.location.href = googleLoginUrl;
};

const LoginForm = ({toggleMode, setMessage, setIsMessageVisible}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login(formData);

      console.log('로그인 응답:', response);

      const {accessToken, refreshToken, userId} = response.data.data;

      // 로컬 스토리지에 저장
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userId', userId);

      setMessage('로그인 성공!');
      setIsMessageVisible(true);
      setTimeout(() => {
        setIsMessageVisible(false);
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage('로그인 실패. 다시 시도해 주세요.');
      setIsMessageVisible(true);
    }
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
            required
        />
        <input
            type="password"
            placeholder="Password"
            className="input"
            name="password"
            onChange={handleInputChange}
            required
        />
        <div className="social-login">
          <button className="social-btn google-btn"
                  onClick={redirectToGoogleLogin}>
            <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                alt="Google Icon"
            />
            Sign in with Google
          </button>
          <button className="social-btn kakao-btn"
                  onClick={redirectToKakaoLogin}>
            <img
                src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                alt="Kakao"
            />
            Sign in with Kakao
          </button>
        </div>
        <button className="btn" type="submit">
          Sign In
        </button>
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