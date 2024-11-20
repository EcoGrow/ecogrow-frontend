import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthPage from './pages/Auth/AuthPage';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import NewsPage from './pages/NewsPage';
import WasteRecord from './pages/WasteRecord';
import WasteRecordWrite from './pages/WasteRecordWrite';
import WasteRecordDetail from './pages/WasteRecordDetail';
import RecyclingTips from './pages/RecyclingTips';
import KakaoCallback from './pages/Auth/KakaoCallback';
import GoogleCallback from "./pages/Auth/GoogleCallback";
import { EditableProvider } from './pages/EditableContext';

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
