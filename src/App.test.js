import React, { useState } from 'react';
import './App.css';

function App() {
  // right-panel-active 클래스의 상태를 관리하는 useState
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);

  // Sign Up 버튼 클릭 시 패널 활성화
  const handleSignUpClick = () => {
    setIsRightPanelActive(true);
  };

  // Sign In 버튼 클릭 시 패널 비활성화
  const handleSignInClick = () => {
    setIsRightPanelActive(false);
  };

  return (
      <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        {/* Sign Up Form */}
        <div className="container__form container--signup">
          <form action="#" className="form" id="form1">
            <h2 className="form__title">Sign Up</h2>
            <input type="text" placeholder="User" className="input" />
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <button className="btn">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="container__form container--signin">
          <form action="#" className="form" id="form2">
            <h2 className="form__title">Sign In</h2>
            <input type="email" placeholder="Email" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <a href="#" className="link">Forgot your password?</a>
            <button className="btn">Sign In</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="container__overlay">
          <div className="overlay">
            <div className="overlay__panel overlay--left">
              <button className="btn" id="signIn" onClick={handleSignInClick}>
                Sign In
              </button>
            </div>
            <div className="overlay__panel overlay--right">
              <button className="btn" id="signUp" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default App;