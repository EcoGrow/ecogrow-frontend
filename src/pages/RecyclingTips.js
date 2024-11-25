import React, {useEffect, useState} from 'react';
import './RecyclingTips.css';
import {Link, useNavigate} from "react-router-dom";
import LogoutButton from "../components/Logout";
import Modal from '../components/Modal';

const RecyclingTips = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [temperature, setTemperature] = useState(null); // 기온 상태를 null로 초기화
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {  // 로그인 상태 체크
      setIsLoggedIn(true); // 로그인 상태로 설정
    }
  }, []);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch('/api/weather/temperature');
        const data = await response.text();
        setTemperature(data);
        setIsLoading(false); // 로딩 종료
      } catch (error) {
        console.error("Failed to fetch temperature:", error);
        setTemperature("데이터 없음");
        setError("기온 정보를 가져오는 데 실패했습니다.");
        setIsLoading(false); // 로딩 종료
      }
    };
    fetchTemperature();
  }, []);

  const handleLoginClick = (e) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      setMessage('이미 로그인이 되어있습니다');
      setIsModalOpen(true);
      e.preventDefault(); // 로그인 페이지로 이동 방지
    } else {
      navigate('/login'); // 로그인 페이지로 이동
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const sections = document.querySelectorAll('.tips-section');
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            } else {
              entry.target.classList.remove('visible');
            }
          });
        },
        {threshold: 0.4} // 섹션의 40%가 뷰포트에 들어오면 감지
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
      <div>
        <header className="header">
          <div className="header-left">
            <div className="header-left-item">
              <Link to="/" onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}>EcoGrow</Link>
            </div>
            <Link to="/news" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/news';
            }}>환경 뉴스</Link>
            <Link to="/wasteRecord" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/wasteRecord';
            }}>쓰레기 기록</Link>
            <Link to="/recycling-tips" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/recycling-tips';
            }}>재활용 팁</Link>
            <Link to="/product" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/product';
            }}>친환경 제품</Link>
          </div>
          <div className="header-right">
            <div className="header-item">
              {isLoading ? '기온 로딩 중...' : error ? error : `춘천시 기온: ${temperature}`}
            </div>
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>마이페이지</Link>}
            {isLoggedIn && <Link to="/my-page" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/my-page';
            }}>마이페이지</Link>}
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>로그인</Link>}
            {isLoggedIn && <LogoutButton setMessage={showMessage}/>}
          </div>
        </header>

        {/* Image & Animation */}
        <section className="hero-section">
          <div className="floating-leaves">
            {[10, 30, 50, 70, 90].map((left, index) => (
                <svg key={index} className="leaf"
                     style={{left: `${left}%`, top: `${index * 10 + 15}%`}}
                     viewBox="0 0 24 24">
                  <path
                      d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                </svg>
            ))}
          </div>
          <div className="title-setting">
            <div className="hero-title">
              <h1>재활용 팁</h1>
            </div>
            <div className="hero-description">
              <p>재활용 팁을 함께 알아봅시다!</p>
            </div>
          </div>
        </section>

        <main className="tips-content">
          <div className="tips-container">
            {/* General Waste */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-card-content">
                <div className="tip-header">
                    <h2 className="tip-category">👉 일반 쓰레기 팁</h2>
                  </div>
                  <ul className="tip-list">
                    <li>쓰레기를 재활용, 퇴비화, 매립 품목으로 분리하세요</li>
                    <li>오염 방지를 위해 재활용하기 전에 용기를 헹구세요</li>
                    <li>종이 상자를 평평하게 만들어 공간을 절약하세요</li>
                    <li>봉투의 투명창을 제거하고 재활용하세요</li>
                    <li>지역 재활용 가이드를 확인하세요</li>
                  </ul>
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Plastic Recycling */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-card-content">
                <div className="tip-header">
                    <h2 className="tip-category">👉 플라스틱 재활용</h2>
                  </div>
                  <ul className="tip-list">
                    <li>플라스틱 제품의 재활용 번호(1-7)를 확인하세요</li>
                    <li>병의 뚜껑과 라벨을 제거하세요</li>
                    <li>음식 잔여물을 청소하세요</li>
                    <li>플라스틱 봉투는 다른 플라스틱과 함께 재활용하지 마세요</li>
                    <li>병을 압축하여 재활용 통의 공간을 절약하세요</li>
                  </ul>
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Paper Recycling */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-card-content">
                  <div className="tip-header">
                    <h2 className="tip-category">👉 종이 재활용</h2>
                  </div>
                  <ul className="tip-list">
                    <li>종이는 깨끗하고 건조하게 보관하세요</li>
                    <li>스테이플러와 종이 클립을 제거하세요</li>
                    <li>기밀 문서는 파쇄하세요</li>
                    <li>기름기나 음식물이 묻은 종이는 재활용하지 마세요</li>
                    <li>신문과 잡지는 함께 묶으세요</li>
                  </ul>
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Glass Recycling */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-card-content">
                  <div className="tip-header">
                    <h2 className="tip-category">👉 유리 재활용</h2>
                  </div>
                  <ul className="tip-list">
                    <li>유리 용기를 깨끗하게 헹구세요</li>
                    <li>금속 캡과 링을 제거하세요</li>
                    <li>색상별로 분류하세요 (투명, 녹색, 갈색)</li>
                    <li>깨진 유리는 포함하지 마세요</li>
                    <li>창문 유리와 거울은 따로 보관하세요</li>
                  </ul>
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M15.5,2L14.5,3H9.5L8.5,2H5V4H19V2H15.5M5,19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H5V19Z"/>
                  </svg>
                </div>
              </div>
            </div>

              {/* Metal Recycling */}
              <div className="tips-section">
                <div className="tip-card">
                  <div className="tip-card-content">
                    <div className="tip-header">
                      <h2 className="tip-category">👉 금속 재활용</h2>
                    </div>
                    <ul className="tip-list">
                      <li>금속 용기를 깨끗하게 청소하세요</li>
                      <li>알루미늄과 철 제품을 구분하세요</li>
                      <li>비금속 부품을 제거하세요</li>
                      <li>캔을 압축하여 공간을 절약하세요</li>
                      <li>해당 시설에서 금속 스크랩을 받는지 확인하세요</li>
                    </ul>
                    <svg className="tip-icon" viewBox="0 0 24 24">
                      <path
                          d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                  </div>
                </div>
              </div>

            {/* Food Waste */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-card-content">
                  <div className="tip-header">
                    <h2 className="tip-category">👉 음식물 쓰레기</h2>
                  </div>
                  <ul className="tip-list">
                    <li>음식물 낭비를 줄이기 위해 식단을 계획하세요</li>
                    <li>음식을 올바르게 보관하여 유통기한을 늘리세요</li>
                    <li>남은 음식을 창의적으로 활용하세요</li>
                    <li>여분의 음식을 냉동 보관하세요</li>
                    <li>전용 음식물 쓰레기통을 사용하세요</li>
                  </ul>
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M18.06 23H19.72C20.56 23 21.25 22.35 21.35 21.53L23 5.05H18V1H16.03V5.05H11.06L11.36 7.39C13.07 7.86 14.67 8.71 15.63 9.65C17.07 11.07 18.06 12.54 18.06 14.94V23M1 22V21H16.03V22C16.03 22.54 15.58 23 15 23H2C1.45 23 1 22.54 1 22Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default RecyclingTips;