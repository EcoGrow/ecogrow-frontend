import React, {useState, useEffect} from 'react';
import {Bar, Pie} from 'react-chartjs-2';
import 'chart.js/auto';
import './WasteRecord.css';
import LogoutButton from '../components/Logout';
import {Link, useNavigate} from 'react-router-dom';
import Modal from '../components/Modal';
import {apiClient} from '../api/client';

const WasteRecord = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [records, setRecords] = useState([]);
  const [weeklyMonthlyData, setWeeklyMonthlyData] = useState({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // adjust as needed
    datasets: [{
      label: 'Weekly Waste (kg)',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  });
  const [trashTypeRecyclableData, setTrashTypeRecyclableData] = useState({
    labels: ['Plastic (Recyclable)', 'Paper (Recyclable)', 'Glass (Recyclable)',
      'Metal (Recyclable)', 'Organic (Non-Recyclable)',
      'General Waste (Non-Recyclable)',
      'Food Waste (Non-Recyclable)'],
    datasets: [{
      data: [],
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
        'rgba(128, 128, 128, 0.6)'],
      borderWidth: 1
    }]
  });

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

  // 시각화를 위한 데이터 집계 함수
  const aggregateDataForCharts = (records) => {
    let weeklyData = [0, 0, 0, 0]; // 매주 낭비되는 양을 합산
    // 폐기물을 특정 재활용 가능 유형과 재활용 불가능 유형으로 분류
    let recyclableData = [0, 0, 0, 0, 0, 0, 0];

    records.forEach((record) => {

      const weekIndex = new Date(record.createdAt).getDate() % 4;

      record.wasteItems.forEach((item) => {
        const amount = item.amount || 0;

        weeklyData[weekIndex] += amount;

        switch (item.wasteType) {
          case 'plastic':
            recyclableData[0] += amount; // Recyclable
            break;
          case 'paper':
            recyclableData[1] += amount;
            break;
          case 'glass':
            recyclableData[2] += amount;
            break;
          case 'metal':
            recyclableData[3] += amount;
            break;
          case 'organic':
            recyclableData[4] += amount; // Non-Recyclable
            break;
          case 'general':
            recyclableData[5] += amount;
            break;
          case 'food':
            recyclableData[6] += amount;
            break;
          default:
            recyclableData[5] += amount; // 정의되지 않으면 general 로 인식
            break;
        }
      });
    });

    // 데이터를 집계한 후 weeklyMonthlyData 및 trashTypeRecyclableData 상태를 업뎃
    setWeeklyMonthlyData((prevData) => ({
      ...prevData,
      datasets: [{...prevData.datasets[0], data: weeklyData}]
    }));

    setTrashTypeRecyclableData((prevData) => ({
      ...prevData,
      datasets: [{...prevData.datasets[0], data: recyclableData}]
    }));
  };

  // 백엔드에서 record 가져오는 코드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/api/waste/records');
        const recordsData = response.data.data || [];

        if (Array.isArray(recordsData)) {
          setRecords(recordsData);
          aggregateDataForCharts(recordsData);
        } else {
          console.error('Unexpected response structure:', recordsData);
          setRecords([]);
        }
      } catch (error) {
        console.error('Error fetching waste records:', error);
      }
    };

    fetchData();
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

        <div className="WR-content">
          <h1>Record your Trash</h1>
          <div className="graph-banner">
            {/*Bar 및 Pie 차트에 전달*/}
            <div className="graph-container">
              <Bar data={weeklyMonthlyData} options={{
                responsive: true,
                scales: {y: {beginAtZero: true}},
                plugins: {
                  title: {
                    display: true,
                    text: 'Weekly Waste Emissions'
                  }
                }
              }}/>
            </div>
            <div className="graph-container">
              <Pie data={trashTypeRecyclableData} options={{
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: 'Waste Types & Recycling Status'
                  }, legend: {position: 'right'}
                }
              }}/>
            </div>
          </div>

          <div className="individual-records">
            {records.length > 0 ? (
                records.map((record) => (
                    <Link to={`/wasteRecord/${record.id}`}
                          className="record-card" key={record.id}>
                      <h3>작성자: {record.username}</h3>
                      <h4>기록 날짜: {record.createdAt}</h4>
                    </Link>
                ))
            ) : (
                <p>No records found.</p>
            )}
          </div>

          <div className="record-button-container">
            <button className="record-button"
                    onClick={() => navigate('/WasteRecordWrite')}>
              Record Waste
            </button>
          </div>
        </div>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default WasteRecord;