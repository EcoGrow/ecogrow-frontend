import React, {useState, useEffect} from 'react';
import {Bar, Pie} from 'react-chartjs-2';
import 'chart.js/auto';
import './WasteRecord.css';
import LogoutButton from '../components/Logout';
import {Link, useNavigate} from 'react-router-dom';
import Modal from '../components/Modal';
import {apiClient} from '../api/client';
import {useEditable} from './EditableContext';

const WasteRecord = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [records, setRecords] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const [allRecords, setAllRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const { editableStates } = useEditable();   // 수정됐는지 확인
  const [temperature, setTemperature] = useState(null); // 기온 상태를 null로 초기화
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가
  const [weeklyMonthlyData, setWeeklyMonthlyData] = useState({
    labels: ['1주차', '2주차', '3주차', '4주차'], // adjust as needed
    datasets: [{
      label: '이번 달 쓰레기 (kg)',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  });
  const [trashTypeRecyclableData, setTrashTypeRecyclableData] = useState({
    labels: ['플라스틱 (재활용 가능)', '종이 (재활용 가능)', '유리 (재활용 가능)',
      '금속 (재활용 가능)', '음식물 쓰레기 (재활용 불가능)',
      '일반 쓰레기 (재활용 불가능)'],
    datasets: [{
      data: [],
      backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
      borderWidth: 1
    }]
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAllRecords = async () => {
    try {
      const firstPageResponse = await apiClient.get('/api/waste/records',
          {params: {page: 0, size: recordsPerPage}});
      const {content, totalPages} = firstPageResponse.data.data;
      let allRecords = [...content];

      for (let page = 1; page < totalPages; page++) {
        const response = await apiClient.get('/api/waste/records',
            {params: {page, size: recordsPerPage}});
        allRecords = allRecords.concat(response.data.data.content);
      }

      setAllRecords(allRecords);
      aggregateDataForCharts(allRecords); // 집계 함수 호출
    } catch (error) {
      console.error('Error fetching all records:', error);
    }
  };

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
      e.preventDefault();
    } else {
      navigate('/login');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSortChange = (e) => setSortOption(e.target.value);
  const handleDateChange = (setter) => (e) => setter(e.target.value);

  const filterRecords = () => {
    let filteredRecords = [...records];
    if (startDate && endDate) {
      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.createdAt);
        return recordDate >= new Date(startDate) && recordDate <= new Date(
            endDate);
      });
    }
    if (sortOption === 'newest') {
      filteredRecords.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === 'oldest') {
      filteredRecords.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    setFilteredRecords(filteredRecords);
  };

  /* 검색 필터 */
  const handleSearchClick = () => {
    if (startDate && !endDate) {
      showMessage("마지막 날짜를 선택해 주세요.");
    } else if (!startDate && endDate) {
      showMessage("시작 날짜를 선택해 주세요.");
    } else {
      filterRecords();
    }
  };

  useEffect(() => {
    setFilteredRecords(records); // 초기 렌더링 시 전체 기록을 보여줍니다.
  }, [records]);

  const showMessage = (msg) => {
    setMessage(msg);
    setIsModalOpen(true);
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
          case 'food':
            recyclableData[4] += amount; // Non-Recyclable
            break;
          case 'general':
            recyclableData[5] += amount;
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
  const fetchData = async (page) => {
    try {
      const response = await apiClient.get('/api/waste/records',
          {params: {page: page - 1, size: recordsPerPage}});
      const recordsData = response.data.data;

      if (recordsData) {
        setRecords(recordsData.content);
        setFilteredRecords(recordsData.content);
        setTotalPages(recordsData.totalPages);
      } else {
        console.error('Unexpected response structure:', recordsData);
        setRecords([]);
      }
    } catch (error) {
      console.error('Error fetching waste records:', error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
    fetchAllRecords();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // 초기화
  const handleResetDateFilter = () => {
    setStartDate('');
    setEndDate('');
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
              <h1>쓰레기 기록</h1>
            </div>
            <div className="hero-description">
              <p>내가 쓰레기를 얼마나 버리는지 기록해봅시다!</p>
            </div>
          </div>
        </section>

        <div>
          <div className="WR-content">
            <div className="graph-banner">
              {/*Bar 및 Pie 차트에 전달*/}
              <div className="graph-container">
                <Bar data={weeklyMonthlyData} options={{
                  responsive: true,
                  scales: {y: {beginAtZero: true}},
                  plugins: {
                    title: {
                      display: true,
                      text: '이번 달 쓰레기 배출량',
                      font: {
                        size: 20,
                        weight: 'bold'
                    }
                  }
                }}}/>
              </div>
              <div className="graph-container">
                <Pie data={trashTypeRecyclableData} options={{
                  responsive: true,
                  plugins: {
                    title: {
                      display: true,
                      text: '쓰레기 종류 & 재활용 상태',
                      font: {
                        size: 20,
                        weight: 'bold'
                      }
                    }, legend: {position: 'right'}
                  }
                }}/>
              </div>
            </div>

            {/* Search filter */}
            <section className="filter-section">
              <label className="sort-label">
                정렬 기준 :
                <select value={sortOption} onChange={handleSortChange}>
                  <option value="newest">최신순</option>
                  <option value="oldest">오래된 순</option>
                </select>
              </label>
              <label className="date-label">
                날짜 검색 :
                <div className="date-inputs">
                  <input type="date" value={startDate}
                         onChange={handleDateChange(setStartDate)}/>
                  <span className="date-separator">~</span>
                  <input type="date" value={endDate}
                         onChange={handleDateChange(setEndDate)}/>
                </div>
                <button className="reset-date-button"
                        onClick={handleResetDateFilter}>초기화 🔄
                </button>
              </label>
              <div className="record-button-container">
                <button className="search-button"
                        onClick={handleSearchClick}>검색하기 🔍
                </button>
                <button className="record-button"
                        onClick={() => navigate('/WasteRecordWrite')}>
                  기록하기 📝
                </button>
              </div>
            </section>

            <div className="individual-records">
              {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                      <Link to={`/wasteRecord/${record.id}`}
                            className="record-card" key={record.id}>
                        <div className="card-header">
                          <h3>작성자: {record.username}</h3>
                          <h4>기록 날짜: {new Date(
                              record.createdAt).toLocaleDateString()} {new Date(
                              record.createdAt).toLocaleTimeString([],
                              {hour: '2-digit', minute: '2-digit'})}
                            {editableStates[record.id] && <span
                                className="edited-label">(수정됨)</span>}
                          </h4>
                        </div>
                        <div className="card-image">
                          <img
                              src="https://raw.githubusercontent.com/EcoGrow/ecogrow-frontend/refs/heads/feat/FeatureModification/Trash.png"
                              alt="Trash"/>
                        </div>
                      </Link>
                  ))
              ) : (
                  <p>쓰레기를 찾을 수 없습니다.</p>
              )}
            </div>

            {/* 페이지네이션 버튼 */}
            <div className="pagination-buttons">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>이전
              </button>
              <button onClick={handleNextPage}
                      disabled={currentPage >= totalPages}>다음
              </button>
            </div>

          </div>
          {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
        </div>
      </div>
  );
};

export default WasteRecord;