import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import LogoutButton from '../components/Logout';
import Modal from '../components/Modal';
import './MainPage.css';

const MainPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 스크롤에 따른 섹션의 visibility 변경
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight
            || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth
            || document.documentElement.clientWidth)
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
      if (isElementInViewport(section)) {
        section.classList.add('visible');
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', handleScroll);
    };
  }, [handleScroll]);

  return (
      <div>
        <header className="header">
          <div className="header-left">
            <Link to="/">EcoGrow</Link>
            <Link to="/news">Environmental News</Link>
            <Link to="/wasteRecord">Record Trash</Link>
            <Link to="/recycling-tips">Recycling Tips</Link>
          </div>
          <div className="header-right">
            <Link to="/my-page">My Page</Link>
            <Link to="/login" onClick={handleLoginClick}>Login</Link>
            <LogoutButton/>
          </div>
        </header>

        <main className="main-content">
          <img src="/images/free-icon-globe-6004805.png" alt="Personal Icon"
               className="personal-image"/>
          <h1 className="hero">EcoGrow는 환경을 연구합니다</h1>
          <p className="sub-hero">환경을 위한 우리의 노력이 지속 가능한 미래를 만듭니다.</p>
          <button className="cta-button">소식 구독하기</button>
        </main>

        <section className="content-section visible">
          <img src="/images/free-icon-world-news-2644746.png" alt="News Icon"
               className="ficon"/>
          <h2 className="hero">최신 환경 뉴스</h2>
          <p className="sub-hero">현재 가장 이슈화 되고 있는 최신 환경 뉴스를 확인하세요!</p>
          <button className="cta-button" onClick={() => navigate('/news')}>뉴스
            확인하기
          </button>
        </section>

        <section className="content-section visible">
          <img src="/images/free-icon-recycle-bin-902502.png" alt="News Icon"
               className="ficon"/>
          <h2 className="hero">분리수거의 중요성</h2>
          <p className="sub-hero">올바른 분리수거는 지구를 살리는 첫걸음입니다. 함께 실천해요!</p>
          <button className="cta-button"
                  onClick={() => navigate('/wasteRecord')}>쓰레기 기록하러 가기
          </button>
        </section>

        <section className="content-section visible">
          <h2 className="heroo">재활용 쓰레기의 중요성</h2>
          <p className="sub-hero">올바른 재활용은 환경 보호의 핵심입니다. 함께 실천해 보아요!</p>
          <div className="recycling-grid">
            <div className="recycling-item">
              <div className="recycling-icon">♻️</div>
              <h3>자원 절약</h3>
              <p>재활용을 통해 새로운 자원 사용을 줄일 수 있습니다.</p>
            </div>
            <div className="recycling-item">
              <div className="recycling-icon">🌱</div>
              <h3>환경 보호</h3>
              <p>쓰레기 매립과 소각으로 인한 환경 오염을 줄일 수 있습니다.</p>
            </div>
            <div className="recycling-item">
              <div className="recycling-icon">💡</div>
              <h3>에너지 절약</h3>
              <p>재활용은 새 제품 생산보다 적은 에너지를 사용합니다.</p>
            </div>
          </div>
          <button className="cta-button" style={{marginTop: '2rem'}}>재활용 가이드
            보기
          </button>
        </section>

        <section className="content-section visible">
          <img src="/images/free-icon-arcade-machine-4176434.png"
               alt="News Icon"
               className="ficon"/>
          <h2 className="hero2">분리수거 게임</h2>
          <p className="sub-hero2">분리수거 게임을 통해서 인식과 재미를 느껴보세요!</p>
          <button className="cta-button" onClick={() => window.location.href = "https://seokyeongeol.github.io/RecyclingGame/"}>게임 하러가기</button>
        </section>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default MainPage;