import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import LogoutButton from '../components/Logout';
import Modal from '../components/Modal';
import './NewsPage.css';

const NewsPage = () => {
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
  // Simulated NEWS API response
  const newsData = [
    {
      title: '북극이 최근 자주 보도되는 이유',
      date: '2024년 10월 13일',
      imageUrl: '/a/fde76069-8989-4f65-88f9-377885851f3f',
    },
    {
      title: "친환경 자연사 박물관이 공개한 '팬더곰' 흔적 첫 발견",
      date: '2024년 10월 9일',
      imageUrl: '/a/fde76069-8989-4f65-88f9-377885851f3f',
    },
    {
      title: '전 세계 고래 집약 공개년 사상 최악의 이유',
      date: '2024년 10월 5일',
      imageUrl: '/a/fde76069-8989-4f65-88f9-377885851f3f',
    },
    {
      title: '충주, 마산자연재해 예경시설 거 준공식 개최',
      date: '2024년 10월 1일',
      imageUrl: '/a/fde76069-8989-4f65-88f9-377885851f3f',
    },
    {
      title: "구글, 마이크로소프트 '탄소 제거' 계약 체결",
      date: '2024년 9월 27일',
      imageUrl: '/a/fde76069-8989-4f65-88f9-377885851f3f',
    },
    {
      title: '환경부, 전국 상수도 오염물질 검사결과 발표',
      date: '2024년 9월 23일',
      imageUrl: '/a/fde76069-8989-4f65-88f9-377885851f3f',
    },
  ];

  const createNewsItem = (news) => (
      <div className="news-item" key={news.title}>
        <img src={news.imageUrl} alt={news.title} className="news-image"/>
        <div className="news-content">
          <h2 className="news-title">{news.title}</h2>
          <p className="news-date">{news.date}</p>
        </div>
      </div>
  );

  return (
      <div>
        <header className="header">
          <div className="header-left">
            <Link to="/" onClick = {(e) => {e.preventDefault(); window.location.href = '/';}}>EcoGrow</Link>
            <Link to="/news" onClick = {(e) => {e.preventDefault(); window.location.href = '/news';}}>Environmental News</Link>
            <Link to="/wasteRecord" onClick = {(e) => {e.preventDefault(); window.location.href = '/wasteRecord';}}>Record Trash</Link>
            <Link to="/recycling-tips" onClick = {(e) => {e.preventDefault(); window.location.href = '/recycling-tips';}}>Recycling Tips</Link>
          </div>
          <div className="header-right">
            <Link to="/my-page" onClick = {(e) => {e.preventDefault(); window.location.href = '/my-page';}}>My Page</Link>
            <Link to="/login" onClick={handleLoginClick}>Login</Link>
            <LogoutButton setMessage={setMessage} />
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
            <h1>Environmental News</h1>
            <p>Let’s find out about current environmental issues through environmental news</p>
          </div>
        </section>

        <main className="news-content">
          <div className="news-grid">
            {newsData.map((news) => createNewsItem(news))}
          </div>
        </main>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default NewsPage;