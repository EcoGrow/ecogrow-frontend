import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

const LogoutButton = ({ setMessage })  => {
  const navigate = useNavigate();

  const isTokenValid = (token) => {
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Token decoding failed:", error);
      return false;
    }
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('token');

    if (!isTokenValid(accessToken)) {
      console.warn("Invalid or expired token. Logging out locally.");
      localStorage.removeItem('token');
      setMessage('로그아웃 성공!');
      navigate('/');
      return;
    }

    console.log("Sending token:", accessToken);

    try {
      const response = await apiClient.post('/api/users/logout', {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 200) {
        localStorage.removeItem('token');
        setMessage('로그아웃 성공!');
        navigate('/');
      } else {
        console.error("Logout failed with status:", response.status);
        alert("로그아웃 실패: 서버 응답을 확인해주세요.");
      }
    } catch (error) {
      console.error("Logout request failed:", error);
      alert(
          "로그아웃 중 오류 발생: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
      <a href="#" onClick={handleLogout} className="header-link">
        로그아웃
      </a>
  );
};

export default LogoutButton;