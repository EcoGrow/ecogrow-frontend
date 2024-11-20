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

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {  // 로그인 상태 체크
      setIsLoggedIn(true); // 로그인 상태로 설정
    }
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

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById('profileImage').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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
        { threshold: 0.4 } // 섹션의 40%가 뷰포트에 들어오면 감지
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
            <Link to="/" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}>EcoGrow</Link>
            <Link to="/news" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/news';
            }}>Environmental News</Link>
            <Link to="/wasteRecord" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/wasteRecord';
            }}>Record Trash</Link>
            <Link to="/recycling-tips" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/recycling-tips';
            }}>Recycling Tips</Link>
          </div>
          <div className="header-right">
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>My Page</Link>}
            {isLoggedIn && <Link to="/my-page" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/my-page';
            }}>My Page</Link>}
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>Login</Link>}
            {isLoggedIn && <LogoutButton setMessage={showMessage} />}
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
          <div>
            <h1>Recycling Tips</h1>
            <p>Let’s learn about recycling tips</p>
          </div>
        </section>

        <main className="tips-content">
          <div className="tips-container">
            {/* General Waste */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-header">
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                  </svg>
                  <h2 className="tip-category">일반 쓰레기 팁</h2>
                </div>
                <ul className="tip-list">
                  <li>쓰레기를 재활용, 퇴비화, 매립 품목으로 분리하세요</li>
                  <li>오염 방지를 위해 재활용하기 전에 용기를 헹구세요</li>
                  <li>종이 상자를 평평하게 만들어 공간을 절약하세요</li>
                  <li>봉투의 투명창을 제거하고 재활용하세요</li>
                  <li>지역 재활용 가이드를 확인하세요</li>
                </ul>
              </div>
            </div>

            {/* Plastic Recycling */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-header">
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
                  </svg>
                  <h2 className="tip-category">플라스틱 재활용</h2>
                </div>
                <ul className="tip-list">
                  <li>플라스틱 제품의 재활용 번호(1-7)를 확인하세요</li>
                  <li>병의 뚜껑과 라벨을 제거하세요</li>
                  <li>음식 잔여물을 청소하세요</li>
                  <li>플라스틱 봉투는 다른 플라스틱과 함께 재활용하지 마세요</li>
                  <li>병을 압축하여 재활용 통의 공간을 절약하세요</li>
                </ul>
              </div>
            </div>

            {/* Paper Recycling */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-header">
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                  </svg>
                  <h2 className="tip-category">종이 재활용</h2>
                </div>
                <ul className="tip-list">
                  <li>종이는 깨끗하고 건조하게 보관하세요</li>
                  <li>스테이플러와 종이 클립을 제거하세요</li>
                  <li>기밀 문서는 파쇄하세요</li>
                  <li>기름기나 음식물이 묻은 종이는 재활용하지 마세요</li>
                  <li>신문과 잡지는 함께 묶으세요</li>
                </ul>
              </div>
            </div>

            {/* Glass Recycling */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-header">
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M15.5,2L14.5,3H9.5L8.5,2H5V4H19V2H15.5M5,19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H5V19Z"/>
                  </svg>
                  <h2 className="tip-category">유리 재활용</h2>
                </div>
                <ul className="tip-list">
                  <li>유리 용기를 깨끗하게 헹구세요</li>
                  <li>금속 캡과 링을 제거하세요</li>
                  <li>색상별로 분류하세요 (투명, 녹색, 갈색)</li>
                  <li>깨진 유리는 포함하지 마세요</li>
                  <li>창문 유리와 거울은 따로 보관하세요</li>
                </ul>
              </div>
            </div>

            {/* Metal Recycling */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-header">
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                  </svg>
                  <h2 className="tip-category">금속 재활용</h2>
                </div>
                <ul className="tip-list">
                  <li>금속 용기를 깨끗하게 청소하세요</li>
                  <li>알루미늄과 철 제품을 구분하세요</li>
                  <li>비금속 부품을 제거하세요</li>
                  <li>캔을 압축하여 공간을 절약하세요</li>
                  <li>해당 시설에서 금속 스크랩을 받는지 확인하세요</li>
                </ul>
              </div>
            </div>

            {/* Organic Waste */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-header">
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M7,3A4,4 0 0,1 11,7A4,4 0 0,1 7,11A4,4 0 0,1 3,7A4,4 0 0,1 7,3M7,5A2,2 0 0,0 5,7A2,2 0 0,0 7,9A2,2 0 0,0 9,7A2,2 0 0,0 7,5M17,3A4,4 0 0,1 21,7A4,4 0 0,1 17,11A4,4 0 0,1 13,7A4,4 0 0,1 17,3M17,5A2,2 0 0,0 15,7A2,2 0 0,0 17,9A2,2 0 0,0 19,7A2,2 0 0,0 17,5Z"/>
                  </svg>
                  <h2 className="tip-category">유기 폐기물</h2>
                </div>
                <ul className="tip-list">
                  <li>야외 쓰레기통을 위한 퇴비통을 시작하세요</li>
                  <li>녹색 및 갈색 재료를 층층이 쌓으세요</li>
                  <li>퇴비를 촉촉하게 유지하되 젖지 않게 하세요</li>
                  <li>퇴비를 주기적으로 뒤집어 주세요</li>
                  <li>가정 퇴비화에서는 고기와 유제품을 피하세요</li>
                </ul>
              </div>
            </div>

            {/* Food Waste */}
            <div className="tips-section">
              <div className="tip-card">
                <div className="tip-header">
                  <svg className="tip-icon" viewBox="0 0 24 24">
                    <path
                        d="M18.06 23H19.72C20.56 23 21.25 22.35 21.35 21.53L23 5.05H18V1H16.03V5.05H11.06L11.36 7.39C13.07 7.86 14.67 8.71 15.63 9.65C17.07 11.07 18.06 12.54 18.06 14.94V23M1 22V21H16.03V22C16.03 22.54 15.58 23 15 23H2C1.45 23 1 22.54 1 22Z"/>
                  </svg>
                  <h2 className="tip-category">음식물 쓰레기</h2>
                </div>
                <ul className="tip-list">
                  <li>음식물 낭비를 줄이기 위해 식단을 계획하세요</li>
                  <li>음식을 올바르게 보관하여 유통기한을 늘리세요</li>
                  <li>남은 음식을 창의적으로 활용하세요</li>
                  <li>여분의 음식을 냉동 보관하세요</li>
                  <li>전용 음식물 쓰레기통을 사용하세요</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default RecyclingTips;