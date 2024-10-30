import React, {useState} from 'react';
import {signup} from '../../api/auth';
import './SignupForm.css';

const redirectToKakaoSignup = () => {
  const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
  const KAKAO_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  window.location.href = kakaoLoginUrl;
};

const redirectToGoogleSignup = () => {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20profile%20email`;
  window.location.href = googleLoginUrl;
};

const SignupForm = ({toggleMode, setMessage, setIsMessageVisible}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // 회원가입 요청을 보냄
      const response = await signup(formData);

      if (response?.status === 201) {
        setMessage('회원가입 성공!');
        setIsMessageVisible(true);
        setTimeout(() => {
          setIsMessageVisible(false);
          setMessage('');
          toggleMode(); // 회원가입 성공 후 로그인 화면으로 전환
        }, 3000);
      } else {
        setMessage(response?.data?.msg || '회원가입 실패. 다시 시도해 주세요.');
        setIsMessageVisible(true);
      }
    } catch (error) {
      // 에러 발생 시 메시지 설정
      setMessage(error.response?.data?.msg || '회원가입 실패. 다시 시도해 주세요.');
      setIsMessageVisible(true);
    }
  };

  return (
      <form className="form signup-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        <input
            type="text"
            placeholder="Username"
            className="input"
            name="username"
            onChange={handleInputChange}
            required
        />
        <input
            type="email"
            placeholder="Email"
            className="input"
            name="email"
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
                  onClick={redirectToGoogleSignup}>
            <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                alt="Google Icon"
            />
            Sign up with Google
          </button>
          <button className="social-btn kakao-btn"
                  onClick={redirectToKakaoSignup}>
            <img
                src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                alt="Kakao"
            />
            Sign up with Kakao
          </button>
        </div>
        <button className="btn" type="submit">Sign Up</button>
        <p>
          Already have an account?{' '}
          <span className="toggle-link" onClick={toggleMode}>
          Sign In
        </span>
        </p>
      </form>
  );
};

export default SignupForm;
