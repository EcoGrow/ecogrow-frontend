import React, { useState } from 'react';
import { signup } from '../../api/auth';

const SignupForm = ({ toggleMode, setMessage, setIsMessageVisible }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await signup(formData);

      if (response.status === 201) {
        setMessage('회원가입 성공!');
      } else {
        setMessage('회원가입 실패. 다시 시도해 주세요.');
      }
    } catch (error) {
      setMessage('회원가입 실패. 다시 시도해 주세요.');
    }

    setIsMessageVisible(true);
    setTimeout(() => {
      setIsMessageVisible(false);
      setMessage('');
    }, 3000);
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
        />
        <input
            type="email"
            placeholder="Email"
            className="input"
            name="email"
            onChange={handleInputChange}
        />
        <input
            type="password"
            placeholder="Password"
            className="input"
            name="password"
            onChange={handleInputChange}
        />
        <input
            type="text"
            placeholder="Name"
            className="input"
            name="name"
            onChange={handleInputChange}
        />
        <div className="social-login">
          <button className="social-btn google-btn">
            <img
                src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                alt="Google Icon"
            />
            Sign up with Google
          </button>
          <button className="social-btn kakao-btn">
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
