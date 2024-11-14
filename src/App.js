import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthPage from './page/Auth/AuthPage';
import MainPage from './page/MainPage';
import MyPage from './page/MyPage';
import NewsPage from './page/NewsPage';
import WasteRecord from './page/WasteRecord';
import WasteRecordWrite from './page/WasteRecordWrite';
import WasteRecordDetail from './page/WasteRecordDetail';
import RecyclingTips from './page/RecyclingTips';
import KakaoCallback from './page/Auth/KakaoCallback';
import GoogleCallback from "./page/Auth/GoogleCallback";
import { EditableProvider } from './page/EditableContext';

function App() {
  return (
      <EditableProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/news" element={<NewsPage/>}/>
            <Route path="/my-page" element={<MyPage/>}/>
            <Route path="/wasteRecord" element={<WasteRecord/>}/>
            <Route path="/wasteRecordWrite" element={<WasteRecordWrite/>}/>
            <Route path="/wasteRecord/:recordId" element={<WasteRecordDetail />} />
            <Route path="/recycling-tips" element={<RecyclingTips/>}/>
            <Route path="/login"
                   element={<AuthPage/>}/> {/* 로그인 페이지는 /login 경로로 설정 */}
            <Route path="/signup" element={<AuthPage/>}/>
            <Route path="/kakao/callback" element={<KakaoCallback/>}/>
            <Route path="/google/callback" element={<GoogleCallback/>}/>
          </Routes>
        </Router>
      </EditableProvider>
  );
}

export default App;
