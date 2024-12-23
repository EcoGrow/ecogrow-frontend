import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import LogoutButton from '../components/Logout';
import './NewsPage.css';
import axios from 'axios';

const NewsPage = () => {
  const [setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const newsPerPage = 9;
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

  const fetchNews = async (page) => {
    try {
      const response = await axios.get('/api/news/search', {
        params: {page: page - 1, size: newsPerPage},
      });
      const data = response.data;

      const decodeHtmlEntities = (text) => {
        const parser = new DOMParser();
        const decodedString = parser.parseFromString(text, 'text/html').body
            .textContent;
        return decodedString;
      };

      const cleanedData = data.content.map((item) => ({
        ...item,
        title: decodeHtmlEntities(item.title),
        description: decodeHtmlEntities(item.description),
      }));

      setNewsData(cleanedData);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching news data:", error);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
      <div className="news-page">
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
              <h1>환경 뉴스</h1>
            </div>
            <div className="hero-description">
              <p>환경뉴스를 통해 현재의 환경 이슈를 알아봅시다!</p>
            </div>
          </div>
        </section>

        <main className="news-content">
          <div className="news-grid">
            {newsData.map((news) => (
                <div className="news-item" key={news.cnt}>
                  <a href={news.link} target="_blank" rel="noopener noreferrer"
                     style={{textDecoration: 'none'}}>
                    <img
                        src="https://raw.githubusercontent.com/EcoGrow/ecogrow-frontend/439baf3541f9bf9f0435db0e6c4e7e31b8d1a721/public/ecogrow.png"
                        alt="News Image"
                        style={{
                          width: '50px',
                          height: 'auto',
                          margin: '5px 0'
                        }}
                    />
                    <h2 className="news-title"
                        style={{color: '#333'}}>{news.title}</h2>
                    <p className="news-description">{news.description}</p>
                  </a>
                </div>
            ))}
          </div>
        </main>

        {/* 페이지네이션 버튼 */}
        <div className="pagination-buttons">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>이전
          </button>
          <button onClick={handleNextPage}
                  disabled={currentPage === totalPages}>다음
          </button>
        </div>
      </div>
  );
};

export default NewsPage;