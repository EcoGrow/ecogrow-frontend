import React, {useEffect, useState} from 'react';
import './Product.css';
import {Link, useNavigate} from "react-router-dom";
import LogoutButton from "../components/Logout";
import {apiClient} from '../api/client';
import Modal from "../components/Modal";

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories] = useState([
    "All Products", "dental", "bathroom", "kitchen", "food", "living", "gift"
  ]);
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [temperature, setTemperature] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const productsPerPage = 10;

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

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // 로딩 상태 시작
      try {
        const response = await apiClient.get("/api/products/crawl", {
          params: {
            category: activeCategory === "All Products" ? "" : activeCategory,
            page: currentPage - 1,
            size: productsPerPage,
          },
        });

        // 백엔드 응답에서 content 배열과 totalPages 가져오기
        const {content, totalPages} = response.data;

        // 가져온 데이터를 설정
        setProducts(content); // 제품 데이터 저장
        setTotalPages(totalPages); // 총 페이지 설정
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setError("제품 정보를 가져오는 데 실패했습니다.");
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    fetchProducts();
  }, [activeCategory, currentPage]);

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  // 페이지 변경 핸들러
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // 로그인 클릭 핸들러
  const handleLoginClick = (e) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      setMessage("이미 로그인이 되어있습니다.");
      setIsModalOpen(true);
      e.preventDefault();
    } else {
      navigate("/login");
    }
  };

  if (isLoading) {
    return <p>제품을 불러오는 중입니다...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const showMessage = (msg) => {
    setMessage(msg);
    setIsModalOpen(true);
  };

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
              {isLoading ? '기온 로딩 중...' : error ? error
                  : `춘천시 기온: ${temperature}`}
            </div>
            {!isLoggedIn && <Link to="/login"
                                  onClick={handleLoginClick}>마이페이지</Link>}
            {isLoggedIn && <Link to="/my-page" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/my-page';
            }}>마이페이지</Link>}
            {!isLoggedIn && <Link to="/login"
                                  onClick={handleLoginClick}>로그인</Link>}
            {isLoggedIn && <LogoutButton setMessage={showMessage}/>}
          </div>
        </header>

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
            <h1>친환경 제품</h1>
            <p>친환경 제품 추천</p>
          </div>
        </section>

        <div className="product-container">
          <nav className="category-nav">
            <ul>
              {categories.map((category) => (
                  <li key={category}>
                    <button
                        onClick={() => handleCategoryClick(category)}
                        className={activeCategory === category ? "active" : ""}
                    >
                      {category}
                    </button>
                  </li>
              ))}
            </ul>
          </nav>
          <div className="products-grid">
            {products.length > 0 ? (
                products.map((product, index) => (
                    <div className="product-card" key={index}>
                      <a href={product.url} target="_blank"
                         rel="noopener noreferrer">
                        <div className="product-image">
                          <img src={product.image || "/placeholder-image.jpg"}
                               alt={product.name}/>
                        </div>
                      </a>
                      <div className="product-info">
                        <h3 className="product-title">{product.name
                            || "상품명 없음"}</h3>
                        <p className="product-price">{product.price
                            ? `${product.price.toLocaleString()}원`
                            : "가격 없음"}</p>
                        <span className="eco-badge">친환경</span>
                      </div>
                    </div>
                ))
            ) : (
                <p>표시할 제품이 없습니다.</p>
            )}
          </div>
        </div>

        <div className="pagination-buttons">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            이전
          </button>
          <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
            다음
          </button>
        </div>
        {isModalOpen && <Modal message={message}
                               onClose={() => setIsModalOpen(false)}/>}
      </div>
  );
};

export default Product;