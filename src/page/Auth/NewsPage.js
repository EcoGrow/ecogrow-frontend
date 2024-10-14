import React, { useEffect, useState } from 'react';
import './NewsPage.css';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const API_KEY = ''; // Replace with your actual API key
    const NEWS_API_URL = `https://newsapi.org/v2/everything?q=environment&apiKey=${API_KEY}`;

    const fetchNews = async () => {
      try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
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

        <main className="news-grid">
          {articles.length > 0 ? (
              articles.map((article, index) => (
                  <div className="news-item" key={index}>
                    <img src={article.urlToImage} alt={article.title} className="news-image" />
                    <div className="news-content">
                      <h2 className="news-title">{article.title}</h2>
                      <p className="news-description">{article.description}</p>
                    </div>
                  </div>
              ))
          ) : (
              <p>No news articles available.</p>
          )}
        </main>
      </div>
  );
};

export default NewsPage;
