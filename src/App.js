import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthPage from './page/Auth/AuthPage';
import MainPage from './page/MainPage';
import NewsPage from './page/NewsPage';
import WasteRecord from './page/WasteRecord';
import WasteRecordWrite from './page/WasteRecordWrite';
import WasteRecordDetail from './page/WasteRecordDetail';
import KakaoCallback from './page/Auth/KakaoCallback';
import GoogleCallback from "./page/Auth/GoogleCallback";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/news" element={<NewsPage/>}/>
          <Route path="/wasteRecord" element={<WasteRecord/>}/>
          <Route path="/wasteRecordWrite" element={<WasteRecordWrite/>}/>
          <Route path="/wasteRecordDetail" element={<WasteRecordDetail/>}/>
          <Route path="/login"
                 element={<AuthPage/>}/> {/* 로그인 페이지는 /login 경로로 설정 */}
          <Route path="/signup" element={<AuthPage/>}/>
          <Route path="/kakao/callback" element={<KakaoCallback/>}/>
          <Route path="/google/callback" element={<GoogleCallback/>}/>
        </Routes>
      </Router>
  );
}

export default App;
