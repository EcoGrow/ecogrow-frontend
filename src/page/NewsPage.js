import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewsPage.css';

function NewsPage() {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('/api/news/search');
        const cleanedData = response.data.map((item) => {
          return {
            ...item,
            title: item.title.replace(/<[^>]*>/g, ''),
            description: item.description.replace(/<[^>]*>/g, ''),
          };
        });
        setNewsData(cleanedData);
      } catch (err) {
        setError("뉴스 데이터를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
      <div className="news-page">
        <header className="header">
          <div className="header-left">
            <Link to="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>EcoGrow</Link>
            <Link to="/news" onClick={(e) => { e.preventDefault(); window.location.href = '/news'; }}>Environmental News</Link>
            <Link to="/wasteRecord" onClick={(e) => { e.preventDefault(); window.location.href = '/wasteRecord'; }}>Record Trash</Link>
            <Link to="/recycling-tips" onClick={(e) => { e.preventDefault(); window.location.href = '/recycling-tips'; }}>Recycling Tips</Link>
          </div>
          <div className="header-right">
            <Link to="/my-page" onClick={(e) => { e.preventDefault(); window.location.href = '/my-page'; }}>My Page</Link>
            <Link to="/login" onClick={handleLoginClick}>Login</Link>
          </div>
        </header>

        <main className="news-content">
          <div className="news-grid">
            {newsData.slice(0, 10).map((news) => (
                <div className="news-item" key={news.cnt}>
                  <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <h2 className="news-title" style={{ color: '#333' }}>{news.title}</h2>
                    <p className="news-date">{new Date(news.pDate).toLocaleString()}</p>
                    <p className="news-description">{news.description}</p>
                  </a>
                </div>
            ))}
          </div>
        </main>
      </div>
  );
}

export default NewsPage;