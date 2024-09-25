import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
      <div className="auth-container">
        <div className={`auth-box ${isLoginMode ? 'login-mode' : 'signup-mode'}`}>
          <div className="form-container">
            {isLoginMode ? (
                <form className="form login-form">
                  <h2>Sign In</h2>
                  <input type="email" placeholder="Email" className="input" />
                  <input type="password" placeholder="Password" className="input" />
                  <div className="social-login">
                    <button className="social-btn google-btn">
                      <img
                          src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                          alt="Google Icon"/>
                      Sign in with Google
                    </button>
                    <button className="social-btn kakao-btn">
                      <img
                          src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="Kakao" />
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
                <form className="form signup-form">
                  <h2>Sign Up</h2>
                  <input type="text" placeholder="Username" className="input" />
                  <input type="email" placeholder="Email" className="input" />
                  <input type="password" placeholder="Password" className="input" />
                  <div className="social-login">
                    <button className="social-btn google-btn">
                      <img
                          src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                          alt="Google Icon"/>
                      Sign up with Google
                    </button>
                    <button className="social-btn kakao-btn">
                      <img
                          src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="Kakao" />
                      Sign up with Kakao
                    </button>
                  </div>
                  <button className="btn">Sign Up</button>
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