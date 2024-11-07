import React, {useEffect, useState} from 'react';
import './MyPage.css';
import {Chart} from 'chart.js';
import {Link, useNavigate} from "react-router-dom";
import Modal from "../components/Modal";
import LogoutButton from "../components/Logout";
import {apiClient} from '../api/client';

const MyPage = () => {
  const [userData, setUserData] = useState({});
  const [entries, setEntries] = useState(
      [{trashType: '', amount: '', unit: ''}]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      e.preventDefault();
    } else {
      navigate('/login');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    initializeCharts();
    loadUserData();
  }, []);

  const loadUserData = () => {
    setUserData({});
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

  const initializeCharts = () => {
    const ctx1 = document.getElementById('todayChart').getContext('2d');
    new Chart(ctx1, {
      type: 'doughnut',
      data: {
        labels: ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic',
          'General Waste', 'Food Waste'],
        datasets: [{
          data: [12, 19, 3, 5, 3, 2, 1],
          backgroundColor: ['rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
            'rgba(128, 128, 128, 0.6)'],
          borderWidth: 1
        }]
      }
    });

    const ctx2 = document.getElementById('weeklyChart').getContext('2d');
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic',
          'General Waste', 'Food Waste'],
        datasets: [{
          data: [12, 19, 3, 5, 3, 2, 1],
          backgroundColor: ['rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
            'rgba(128, 128, 128, 0.6)'],
          borderWidth: 1
        }]
      }
    });

    const ctx3 = document.getElementById('monthlyChart').getContext('2d');
    new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic',
          'General Waste', 'Food Waste'],
        datasets: [{
          data: [12, 19, 3, 5, 3, 2, 1],
          backgroundColor: ['rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
            'rgba(128, 128, 128, 0.6)'],
          borderWidth: 1
        }]
      }
    });

    const wasteTypeCtx = document.getElementById('wasteTypeChart').getContext(
        '2d');
    new Chart(wasteTypeCtx, {
      type: 'pie',
      data: {
        labels: ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic',
          'General Waste', 'Food Waste'],
        datasets: [{
          data: [20, 15, 10, 5, 25, 4, 2],
          backgroundColor: ['rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
            'rgba(128, 128, 128, 0.6)'],
          borderWidth: 1
        }]
      }
    });

    const recyclingCtx = document.getElementById(
        'recyclingStatusChart').getContext('2d');
    new Chart(recyclingCtx, {
      type: 'doughnut',
      data: {
        labels: ['Recycled', 'Non-recycled'],
        datasets: [{
          data: [60, 40],
          backgroundColor: ['rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)']
        }]
      }
    });
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
          </div>
          <div className="header-right">
            <Link to="/my-page" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/my-page';
            }}>My Page</Link>
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>Login</Link>}
            {isLoggedIn && <LogoutButton setMessage={setMessage} />}
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
            <h1>My Profile</h1>
            <p>Help protect our planet by reducing waste and recycling</p>
          </div>
        </section>

        <section className="mypage-section">
          <div className="profile-container">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-image-container">
                  <h3>My Profile</h3>
                  <img id="profileImage" src="https://via.placeholder.com/150"
                       alt="Profile" className="profile-image"/>
                  <button className="edit-profile-image">Edit Photo</button>
                  <input type="file" id="profileImageInput" hidden
                         accept="image/*" onChange={handleProfileImageUpload}/>
                </div>
                <div className="profile-info">
                  <h3 id="userName">User Name</h3>
                  <button className="edit-profile-btn">Edit Profile</button>
                </div>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Today's Records</h3>
                <div className="stat-content">
                  <canvas id="todayChart"></canvas>
                </div>
              </div>
              <div className="stat-card">
                <h3>Weekly Summary</h3>
                <div className="stat-content">
                  <canvas id="weeklyChart"></canvas>
                </div>
              </div>
              <div className="stat-card">
                <h3>Monthly Overview</h3>
                <div className="stat-content">
                  <canvas id="monthlyChart"></canvas>
                </div>
              </div>
            </div>

            <div className="advanced-stats-grid">
              <div className="stat-card">
                <h3>Waste Type Distribution</h3>
                <canvas id="wasteTypeChart"></canvas>
              </div>
              <div className="stat-card">
                <h3>Recycling Status</h3>
                <canvas id="recyclingStatusChart"></canvas>
              </div>
            </div>

            <div className="personalized-tips-container">
              <h3>개인 맞춤형 재활용 감소 팁</h3>
              <div className="personalized-tips-grid">
                <div className="personalized-tip-card">
                  <div className="tip-header">
                    <div className="tip-icon-container">
                      <svg className="tip-icon" viewBox="0 0 24 24">
                        <path
                            d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,7V13L16.2,16.1L17,14.9L12.5,12.2V7H11Z"/>
                      </svg>
                    </div>
                    <h4>Based on Your Recent Activity</h4>
                  </div>
                  <div id="dynamicTips" className="tip-content">
                    {/* Tips will be dynamically inserted here */}
                  </div>
                </div>
              </div>
            </div>

            <div className="trash-records">
              <div className="records-table-container">
                <h3>나의 쓰레기 기록</h3>
                <table className="records-table">
                  <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody id="trashRecordsBody">
                  {/* Records will be populated via JavaScript */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default MyPage;