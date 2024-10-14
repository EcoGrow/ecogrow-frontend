import React, { useEffect } from 'react';
import './MainPage.css';

const MainPage = () => {

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

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
  }, []);

  return (
      <div>
        <header className="header">
          <div className="header-left">
            <a href="https://ecowatch.news/">EcoGrow</a>
            <a href="https://ecowatch.news/environmental-news">Environmental News</a>
            <a href="https://ecowatch.news/record-trash">Record Trash</a>
            <a href="https://ecowatch.news/trash-records">Check Trash Records</a>
          </div>
          <div className="header-right">
            <a href="https://ecowatch.news/my-page">My Page</a>
            <a href="https://ecowatch.news/login">Login</a>
            <a href="https://ecowatch.news/logout">Logout</a>
          </div>
        </header>

        <main className="main-content">
          <img src="/images/free-icon-globe-6004805.png" alt="Personal Icon" className="personal-image" />
          <h1 className="hero">EcoGrow는 환경을 연구합니다</h1>
          <p className="sub-hero">환경을 위한 우리의 노력이 지속 가능한 미래를 만듭니다.</p>
          <button className="cta-button">뉴스 구독하기</button>
        </main>

        <section className="content-section">
          <h2>환경 뉴스</h2>
          <div className="content-grid">
            <div className="content-item">
              <h3>플라스틱 재활용의 혁신</h3>
              <p>새로운 기술로 플라스틱 재활용 효율이 50% 향상되었습니다.</p>
            </div>
            <div className="content-item">
              <h3>재생 에너지의 미래</h3>
              <p>태양광 발전 비용이 5년 내 화석 연료보다 저렴해질 전망입니다.</p>
            </div>
            <div className="content-item">
              <h3>해양 생태계 보호 활동</h3>
              <p>전 세계적인 해양 정화 프로젝트가 시작되었습니다.</p>
            </div>
          </div>
        </section>
      </div>
  );
};

export default MainPage;
