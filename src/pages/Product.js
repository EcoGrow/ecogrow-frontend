import React, {useState} from 'react';
import './Product.css';
import {Link, useNavigate} from "react-router-dom";
import LogoutButton from "../components/Logout";

const Product = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const categories = ['All Products', 'Kitchen', 'Bathroom', 'Personal Care',
    'Home', 'On-the-go'];
  const products = [
    {
      title: 'Bamboo Utensil Set',
      description: 'Sustainable bamboo utensil set including fork, knife, spoon, and chopsticks in a cotton carry pouch.',
      price: '$24.99',
      badges: ['Plastic-Free', 'Sustainable'],
    },
    {
      title: 'Shampoo Bar',
      description: 'All-natural shampoo bar with essential oils. Plastic-free packaging, perfect for sustainable hair care.',
      price: '$12.99',
      badges: ['Zero-Waste', 'Natural'],
    },
    {
      title: 'Bamboo Toothbrush',
      description: 'Biodegradable bamboo toothbrush with soft bristles. Comes in plastic-free packaging.',
      price: '$6.99',
      badges: ['Biodegradable', 'Eco-Friendly'],
    },
  ];

  const showMessage = (msg) => {
    setMessage(msg);
    setIsModalOpen(true);
  };

  const handleLoginClick = (e) => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {
      setMessage('이미 로그인이 되어있습니다');
      setIsModalOpen(true);
      e.preventDefault();
    } else {
      navigate('/login');
    }
  };

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
            <Link to="/product" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/product';
            }}>Product</Link>
          </div>
          <div className="header-right">
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>My
              Page</Link>}
            {isLoggedIn && <Link to="/my-page" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/my-page';
            }}>My Page</Link>}
            {!isLoggedIn && <Link to="/login"
                                  onClick={handleLoginClick}>Login</Link>}
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
            <h1>Product</h1>
            <p>제로웨이스트 제품</p>
          </div>
        </section>

        <div className="product-container">
          <nav className="category-nav">
            <ul>
              {categories.map((category) => (
                  <li key={category}>
                    <button
                        className={activeCategory === category ? 'active' : ''}
                        onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  </li>
              ))}
            </ul>
          </nav>

          <div className="products-grid">
            {products.map((product, index) => (
                <div className="product-card" key={index}>
                  <div className="product-image">
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <path d="M12 8v8"/>
                    </svg>
                  </div>
                  <div className="product-info">
                    {product.badges.map((badge, badgeIndex) => (
                        <span className="eco-badge" key={badgeIndex}>
                                    {badge}
                                </span>
                    ))}
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">{product.price}</div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default Product;
