import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: ''
  });
  const [message, setMessage] = useState(''); // 메시지 상태 추가
  const [isMessageVisible, setIsMessageVisible] = useState(false); // 메시지 표시 여부

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setMessage(''); // 모드 변경 시 메시지 초기화
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setMessage('회원가입 성공!'); // 성공 메시지
      setIsMessageVisible(true);
    } else {
      setMessage('회원가입 실패. 다시 시도해 주세요.'); // 실패 메시지
      setIsMessageVisible(true);
    }

    // 메시지 자동 사라지기
    setTimeout(() => {
      setIsMessageVisible(false);
      setMessage('');
    }, 3000); // 3초 후에 사라짐
  };

  return (
      <div className="auth-container">
        {isMessageVisible && <div className="message-modal">{message}</div>} {/* 메시지 모달 */}

        <div className={`auth-box ${isLoginMode ? 'login-mode' : 'signup-mode'}`}>
          <div className="form-container">
            {isLoginMode ? (
                <form className="form login-form">
                  <h2>Sign In</h2>
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
                  <div className="social-login">
                    <button className="social-btn google-btn">
                      <img
                          src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                          alt="Google Icon"
                      />
                      Sign in with Google
                    </button>
                    <button className="social-btn kakao-btn">
                      <img
                          src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                          alt="Kakao"
                      />
                      Sign in with Kakao
                    </button>
                  </div>
                  <button className="btn">Sign In</button>
                  <p>
                    Don't have an account?{' '}
                    <span className="toggle-link" onClick={toggleMode}>
                  Sign Up
                </span>
                  </p>
                </form>
            ) : (
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
            )}
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel">
                <h2>{isLoginMode ? 'Welcome Back!' : 'Hello, Friend!'}</h2>
                <p>
                  {isLoginMode
                      ? 'To keep connected with us, please login with your personal info.'
                      : 'Enter your personal details and start your journey with us!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;
