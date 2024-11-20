import React, {useEffect, useState} from 'react';
import './MyPage.css';
import {Chart} from 'chart.js';
import {Link, useNavigate} from "react-router-dom";
import Modal from "../components/Modal";
import LogoutButton from "../components/Logout";
import {apiClient} from '../api/client';

const MyPage = () => {
  const [entries, setEntries] = useState([]);
  const [todayData, setTodayData] = useState({});
  const [weeklyData, setWeeklyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [trashTypeData, setTrashTypeData] = useState({});
  const [recyclableData, setRecyclableData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [tips, setTips] = useState([]);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sortedEntries, setSortedEntries] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTrashType, setSelectedTrashType] = useState('');

  const userId = localStorage.getItem('userId');
  console.log("userId :", userId)

  useEffect(() => {
    const accessToken = localStorage.getItem('token');
    if (accessToken) {  // 로그인 상태 체크
      setIsLoggedIn(true); // 로그인 상태로 설정
    }
  }, []);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchWasteRecords = async () => {
      try {
        const response = await apiClient.get(`/api/waste/records/users/${userId}`);
        const recordsData = response.data.data || {};

        if (recordsData.content && Array.isArray(recordsData.content)) {
          setEntries(recordsData.content);
          categorizeRecords(recordsData.content);
        } else {
          console.error('Unexpected response structure:', recordsData);
          setEntries([]);
        }
      } catch (error) {
        console.error('Error fetching waste records:', error);
      }
    };
    fetchWasteRecords();
  }, [userId]);

  useEffect(() => {
    const fetchWasteReductionTips = async () => {
      try {
        const response = await apiClient.get(`/api/waste/tips/users/${userId}`);

        console.log('API 응답:', response.data.data);

        const tipsData = response.data.data || [];
        setTips(tipsData); // Store the fetched tips data

        console.log('팁 데이터 구조:', tipsData);
      } catch (error) {
        console.error('Error fetching waste reduction tips:', error);
      }
    };
    fetchWasteReductionTips();
  }, [userId]);

  const filterEntries = () => {
    let filteredEntries = [...entries];
    // 날짜 필터링
    if (startDate && endDate) {
      filteredEntries = filteredEntries.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
      });
    }
    // 타입 필터링
    if (selectedTrashType) {
      filteredEntries = filteredEntries.filter(entry => {
        return entry.wasteItems.some(item => item.wasteType === selectedTrashType);
      });
    }
    // 정렬
    if (sortOption === 'newest') {
      filteredEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'oldest') {
      filteredEntries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    setSortedEntries(filteredEntries);
  };

  const handleSearchClick = () => {
    if (startDate && !endDate) {
      showMessage("마지막 날짜를 선택해 주세요.");
    } else if (!startDate && endDate) {
      showMessage("시작 날짜를 선택해 주세요.");
    } else {
      filterEntries();
    }
  };

  useEffect(() => {
    setSortedEntries(entries);
  }, [entries]);

  useEffect(() => {
  }, [entries, startDate, endDate, sortOption, selectedTrashType]);

  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleDateChange = (setter) => (e) => setter(e.target.value);
  const handleTrashTypeChange = (e) => setSelectedTrashType(e.target.value);

  const handleResetDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  const categorizeRecords = (records) => {
    const today = new Date();
    const todayStart = new Date(today).setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);

    let todayRecords = [];
    let weeklyRecords = [];
    let monthlyRecords = [];
    let trashTypeCounts = {
      plastic: 0,
      paper: 0,
      glass: 0,
      metal: 0,
      organic: 0,
      general: 0,
    };
    let recyclable = 0;
    let nonRecyclable = 0;

    records.forEach((record) => {
      const recordDate = new Date(record.createdAt).setHours(0, 0, 0, 0);

      // Categorize records by date
      if (recordDate === todayStart) {
        todayRecords.push(record);
      } else if (recordDate >= oneWeekAgo) {
        weeklyRecords.push(record);
      } else if (recordDate >= oneMonthAgo) {
        monthlyRecords.push(record);
      }

      record.wasteItems.forEach((item) => {
        trashTypeCounts[item.wasteType] += item.amount || 0;
        if (['plastic', 'paper', 'glass', 'metal'].includes(item.wasteType)) {
          recyclable += item.amount || 0;
        } else {
          nonRecyclable += item.amount || 0;
        }
      });
    });

    // Update chart data
    setTodayData({
      labels: ['Today'],
      datasets: [{data: [todayRecords.length], borderWidth: 1}]
    });

    setWeeklyData({
      labels: ['Weekly'],
      datasets: [{data: [weeklyRecords.length], borderWidth: 1}]
    });

    setMonthlyData({
      labels: ['Monthly'],
      datasets: [{data: [monthlyRecords.length], borderWidth: 1}]
    });

    setTrashTypeData({
      labels: Object.keys(trashTypeCounts),
      datasets: [{data: Object.values(trashTypeCounts), borderWidth: 1}]
    });

    setRecyclableData({
      labels: ['Recyclable', 'Non-Recyclable'],
      datasets: [{
        data: [recyclable, nonRecyclable],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)']
      }]
    });
  };

  const initializeCharts = () => {
    const ctxToday = document.getElementById('todayChart').getContext('2d');
    new Chart(ctxToday, {
      type: 'doughnut',
      data: todayData
    });

    const ctxWeekly = document.getElementById('weeklyChart').getContext('2d');
    new Chart(ctxWeekly, {
      type: 'bar',
      data: weeklyData
    });

    const ctxMonthly = document.getElementById('monthlyChart').getContext('2d');
    new Chart(ctxMonthly, {
      type: 'bar',
      data: monthlyData
    });

    const wasteTypeCtx = document.getElementById('wasteTypeChart').getContext(
        '2d');
    new Chart(wasteTypeCtx, {
      type: 'pie',
      data: trashTypeData
    });

    const recyclingCtx = document.getElementById(
        'recyclingStatusChart').getContext('2d');
    new Chart(recyclingCtx, {
      type: 'doughnut',
      data: recyclableData
    });
  };

  useEffect(() => {
    if (Object.keys(todayData).length && Object.keys(weeklyData).length
        && Object.keys(monthlyData).length && Object.keys(trashTypeData).length
        && Object.keys(recyclableData).length) {
      initializeCharts();
    }
  }, [todayData, weeklyData, monthlyData, trashTypeData, recyclableData]);

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

  const viewRecordDetails = (id) => {
    navigate(`/wasteRecord/${id}`);
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
            {isLoggedIn && <LogoutButton setMessage={showMessage} />}
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
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Today's Records</h3>
              <canvas id="todayChart"></canvas>
            </div>
            <div className="stat-card">
              <h3>Weekly Summary</h3>
              <canvas id="weeklyChart"></canvas>
            </div>
            <div className="stat-card">
              <h3>Monthly Overview</h3>
              <canvas id="monthlyChart"></canvas>
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

          <section className="personalized-tips-container">
            <h3>개인 맞춤형 재활용 감소 팁</h3>
            <div id="dynamicTips" className="tip-content">
              {tips.length > 0 ? (
                  tips.map((tip, index) => (
                      <p key={index}>{tip.tips}</p>
                  ))
              ) : (
                  <p>No personalized tips available.</p>
              )}
            </div>
          </section>

          <section className="mypage-section">
            <section className="filter-section">
              <label className="sort-label">
                정렬 기준 :
                <select value={sortOption} onChange={handleSortChange}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </label>
              <label className="sort-label">
                필터 검색 :
                <select onChange={(e) => setSelectedTrashType(e.target.value)}>
                  <option value="">All</option>
                  <option value="plastic">Plastic</option>
                  <option value="paper">Paper</option>
                  <option value="glass">Glass</option>
                  <option value="metal">Metal</option>
                  <option value="organic">Organic</option>
                  <option value="general">General</option>
                </select>
              </label>
              <label className="date-label">
                날짜 검색 :
                <div className="date-inputs">
                  <input type="date" value={startDate} onChange={handleDateChange(setStartDate)}/>
                  <span className="date-separator">~</span>
                  <input type="date" value={endDate} onChange={handleDateChange(setEndDate)}/>
                </div>
                <button className="reset-date-button" onClick={handleResetDateFilter}>초기화 🔄</button>
              </label>
            </section>
            <div className="search-button-container">
              <h3>나의 쓰레기 기록</h3>
              <button className="my-search-button" onClick={handleSearchClick}>검색하기 🔍</button>
            </div>

            <table className="records-table">
              <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {sortedEntries.length > 0 ? (
                  sortedEntries.map((entry, index) => (
                      <tr key={index} onClick={() => viewRecordDetails(entry.id)}
                          style={{cursor: 'pointer'}}>
                        <td>{entry.date || new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        }) || "No Date"}</td>
                        <td>{entry.trashType || entry.wasteItems?.[0]?.wasteType
                            || "No Type"}</td>
                        <td>{entry.amount || entry.wasteItems?.[0]?.amount
                            || "No Amount"}</td>
                        <td>View</td>
                      </tr>
                  ))
              ) : (
                  <p>No records found.</p>
              )}
              </tbody>
            </table>
          </section>
        </section>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default MyPage;