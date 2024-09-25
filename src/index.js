import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root'); // root 요소를 올바르게 선택
const root = createRoot(container); // createRoot 메서드 사용
root.render(<App />);