import React, {useEffect, useState} from 'react';
import './MyPage.css';
import {Chart, registerables} from 'chart.js';
import {Link, useNavigate} from 'react-router-dom';
import LogoutButton from '../components/Logout';
import Modal from '../components/Modal';

Chart.register(...registerables);

const MyPage = () => {
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

  useEffect(() => {
    const weeklyMonthlyData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'May', 'June'],
      datasets: [
        {
          label: 'Weekly Waste Disposal (kg)',
          data: [15, 12, 18, 14, 20, 22],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const trashTypeRecyclableData = {
      labels: [
        'Plastic (recycling)',
        'Paper (recycling)',
        'Glass (recycling)',
        'Metal (recycling)',
        'Food (non-recycling)',
        'Other (non-recycling)',
      ],
      datasets: [
        {
          data: [30, 25, 15, 10, 15, 5],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const weeklyMonthlyChart = new Chart(
        document.getElementById('weeklyMonthlyChart'), {
          type: 'bar',
          data: weeklyMonthlyData,
          options: {
            responsive: true,
            scales: {y: {beginAtZero: true}},
            plugins: {
              title: {display: true, text: 'Weekly/Monthly Waste Disposal'},
            },
          },
        });

    const trashTypeChart = new Chart(document.getElementById('trashTypeChart'),
        {
          type: 'pie',
          data: trashTypeRecyclableData,
          options: {
            responsive: true,
            plugins: {
              title: {display: true, text: 'Trash Type and Recycling Status'},
              legend: {position: 'right'},
            },
          },
        });

    return () => {
      weeklyMonthlyChart.destroy();
      trashTypeChart.destroy();
    };
  }, []);

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

        <main className="mypage-content">
          <div className="user-info">
            <div className="stats">
              <div className="stat-item">
                <div className="stat-number">128</div>
                <div>Followers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">96</div>
                <div>Following</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">245</div>
                <div>Likes</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">52</div>
                <div>Comments</div>
              </div>
            </div>
            <button className="btn" onClick={() => alert(
                'Edit profile functionality will be implemented here')}>
              Edit Profile
            </button>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <canvas id="weeklyMonthlyChart"></canvas>
            </div>
            <div className="chart-card">
              <canvas id="trashTypeChart"></canvas>
            </div>
          </div>

          <div className="post-info">
            <div className="info-section">
              <h3>Recent Comments</h3>
              <ul className="info-list">
                <li className="info-item">
                  <span>Great initiative on waste reduction!</span>
                  <span className="date">2023-06-15</span>
                </li>
                <li className="info-item">
                  <span>Your recycling stats are impressive!</span>
                  <span className="date">2023-06-14</span>
                </li>
                <li className="info-item">
                  <span>Keep up the good work!</span>
                  <span className="date">2023-06-13</span>
                </li>
              </ul>
            </div>
            <div className="info-section">
              <h3>Recent Posts</h3>
              <ul className="info-list">
                <li className="info-item">
                  <span>Weekly Recycling Report - 15kg total</span>
                  <span className="date">2023-06-15</span>
                </li>
                <li className="info-item">
                  <span>Plastic Reduction Challenge Complete!</span>
                  <span className="date">2023-06-13</span>
                </li>
                <li className="info-item">
                  <span>Monthly Eco-friendly Goals Update</span>
                  <span className="date">2023-06-10</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default MyPage;
