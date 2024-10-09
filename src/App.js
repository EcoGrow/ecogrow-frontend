import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthPage from './page/Auth/AuthPage';
import KakaoCallback from './page/Auth/KakaoCallback';
import GoogleCallback from "./page/Auth/GoogleCallback";


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/kakao/callback" element={<KakaoCallback />} />
          <Route path="/google/callback" element={<GoogleCallback />} />
        </Routes>
      </Router>
  );
}

export default App;
