import React, { useState } from 'react';
import './App.css';
import LoginForm from './page/Auth/LoginForm';
import SignupForm from './page/Auth/SignupForm';

function App() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setMessage('');
  };

  return (
      <div className="auth-container">
        {isMessageVisible && <div className="message-modal">{message}</div>}

        <div className={`auth-box ${isLoginMode ? 'login-mode' : 'signup-mode'}`}>
          <div className="form-container">
            {isLoginMode ? (
                <LoginForm
                    toggleMode={toggleMode}
                    setMessage={setMessage}
                    setIsMessageVisible={setIsMessageVisible}
                />
            ) : (
                <SignupForm
                    toggleMode={toggleMode}
                    setMessage={setMessage}
                    setIsMessageVisible={setIsMessageVisible}
                />
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
