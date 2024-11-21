import React, {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {Pie, Doughnut} from 'react-chartjs-2';
import LogoutButton from '../components/Logout';
import Modal from '../components/Modal';
import {apiClient} from '../api/client';
import './WasteRecordDetail.css';
import {useEditable} from './EditableContext';

const WasteRecordDetail = () => {
  const [record, setRecord] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const {recordId} = useParams(); // Get record ID from URL
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {updateIsEditable} = useEditable();
  const [temperature, setTemperature] = useState(null); // 기온 상태를 null로 초기화
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const addTrashEntry = () => {
    const newEntry = { wasteType: '', amount: '', unit: '' };
    const updatedItems = [...record.wasteItems, newEntry];
    setRecord({ ...record, wasteItems: updatedItems });
  };

  const removeTrashEntry = (index) => {
    if (record.wasteItems.length > 1) {
      const updatedItems = record.wasteItems.filter((_, i) => i !== index);
      setRecord({ ...record, wasteItems: updatedItems });
    } else {
      alert('최소 한 개의 쓰레기 항목이 필요합니다!');
    }
  };

  const [wasteTypeData, setWasteTypeData] = useState({
    labels: ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'General Waste',
      'Food Waste'],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
        'rgba(128, 128, 128, 0.6)'
      ],
      borderWidth: 1
    }]
  });

  // Recyclability breakdown chart data
  const [recyclabilityData, setRecyclabilityData] = useState({
    labels: ['Recyclable', 'Non-Recyclable'],
    datasets: [{
      data: [],
      backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      borderWidth: 1
    }]
  });

  // Aggregate data for charts
  const aggregateDataForCharts = (record) => {
    const wasteTypeCounts = {
      plastic: 0,
      paper: 0,
      glass: 0,
      metal: 0,
      organic: 0,
      general: 0,
    };
    let recyclableCount = 0;
    let nonRecyclableCount = 0;

    record.wasteItems.forEach((item) => {
      const amount = item.amount || 0;

      // Update waste type counts
      if (wasteTypeCounts[item.wasteType] !== undefined) {
        wasteTypeCounts[item.wasteType] += amount;
      } else {
        wasteTypeCounts['other'] += amount; // If wasteType is undefined, classify as 'other'
      }

      // Update recyclability counts
      if (item.recyclable) {
        recyclableCount += amount;
      } else {
        nonRecyclableCount += amount;
      }
    });

    // Update chart data
    setWasteTypeData((prevData) => ({
      ...prevData,
      datasets: [{
        ...prevData.datasets[0],
        data: Object.values(wasteTypeCounts)
      }]
    }));

    setRecyclabilityData((prevData) => ({
      ...prevData,
      datasets: [{
        ...prevData.datasets[0],
        data: [recyclableCount, nonRecyclableCount]
      }]
    }));
  };

  // Fetch specific waste record details
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await apiClient.get(`/api/waste/records/${recordId}`);
        setRecord(response.data.data); // Set the waste record data
        aggregateDataForCharts(response.data.data); // Aggregate data for charts
      } catch (error) {
        console.error('Error fetching waste record:', error);
        setMessage('Failed to load record details.');
        setIsModalOpen(true);
      }
    };

    fetchRecord();
  }, [recordId]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setIsModalOpen(true);
  };

  const saveChanges = async () => {
    if (record.wasteItems.some(
        entry => !entry.wasteType || !entry.amount || !entry.unit)) {
      alert('모든 쓰레기 항목의 필드를 채워주세요');
      return;
    }

    try {
      const response = await apiClient.put(`/api/waste/records/${recordId}`,
          record);
      setRecord(response.data.data); // Update the record with the saved changes
      setEditMode(false);
      updateIsEditable(record.id, true);
      alert('기록이 성공적으로 수정되었습니다!');
      navigate('/WasteRecord');
    } catch (error) {
      console.error('기록 수정 오류 :', error);
      alert('기록 수정 중 오류가 발생했습니다.');
    }
  };

  const deleteRecord = async () => {
    if (window.confirm('기록을 삭제하시겠습니까?')) {
      try {
        await apiClient.delete(`/api/waste/records/${recordId}`);
        alert('기록이 성공적으로 삭제되었습니다!');
        navigate('/wasteRecord'); // Redirect to waste record page after deletion
      } catch (error) {
        console.error('기록 삭제 오류 :', error);
        alert('기록 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (!record) {
    return <p>Loading...</p>;
  }

  return (
      <div>
        <header className="header">
          <div className="header-left">
            <Link to="/" onClick = {(e) => {e.preventDefault(); window.location.href = '/';}}>EcoGrow</Link>
            <Link to="/news" onClick = {(e) => {e.preventDefault(); window.location.href = '/news';}}>Environmental News</Link>
            <Link to="/wasteRecord" onClick = {(e) => {e.preventDefault(); window.location.href = '/wasteRecord';}}>Record Trash</Link>
            <Link to="/recycling-tips" onClick = {(e) => {e.preventDefault(); window.location.href = '/recycling-tips';}}>Recycling Tips</Link>
          </div>
          <div className="header-right">
            <div className="header-item">
              {isLoading ? '기온 로딩 중...' : error ? error : `춘천시 기온: ${temperature}`}
            </div>
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>My Page</Link>}
            {isLoggedIn && <Link to="/my-page" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/my-page';
            }}>My Page</Link>}
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>Login</Link>}
            {isLoggedIn && <LogoutButton setMessage={showMessage}/>}
          </div>
        </header>

        <main className="WRD-content">
          <h1>{record.username}'s Record</h1>

          <div className="chart-banner">

            {/* Visualization for waste types */}
            <div className="graph-container">
              <h3>Waste Type Breakdown</h3>
              <Pie data={wasteTypeData} options={{responsive: true}}/>
            </div>

            {/* Visualization for recyclability */}
            <div className="graph-container">
              <h3>Recyclability Status</h3>
              <Doughnut data={recyclabilityData} options={{responsive: true}}/>
            </div>
          </div>

          <div className={`detail-card ${editMode ? 'edit-mode' : ''}`}
               id="recordDetail">
            <div className="record-header">
              <div className="record-metadata">
                <h4>작성자: {record.username}</h4>
                <h4>기록
                  일자: {new Date(record.createdAt).toLocaleDateString()} {new Date(record.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}</h4>
              </div>
            </div>

            <div className="record-content">
              <div id="trashItems">
                {!editMode && (
                    record.wasteItems.map((item) => (
                        <div key={item.id} className="trash-item">
                          <span>{item.wasteType}</span>
                          <span>{item.amount}</span>
                          <span>{item.unit}</span>
                          <span>{item.recyclable ? "Recyclable"
                              : "Non-recyclable"}</span>
                        </div>
                    ))
                )}

                {editMode && (
                    <button type="button" className="add-entry"
                            onClick={addTrashEntry}>
                      + Add New Trash Entry
                    </button>
                )}

                {editMode && (
                    record.wasteItems.map((item, index) => (
                        <div key={item.id} className="trash-item-editable">
                          <select
                              className="trash-type"
                              value={item.wasteType}
                              onChange={(e) => {
                                const updatedItems = [...record.wasteItems];
                                updatedItems[index].wasteType = e.target.value;
                                setRecord({...record, wasteItems: updatedItems});
                              }}
                          >
                            <option value="">Select trash type</option>
                            <option value="plastic">Plastic</option>
                            <option value="paper">Paper</option>
                            <option value="glass">Glass</option>
                            <option value="metal">Metal</option>
                            <option value="organic">Organic</option>
                            <option value="electronic">Electronic</option>
                          </select>
                          <input
                              type="number"
                              className="amount"
                              value={item.amount}
                              onChange={(e) => {
                                const updatedItems = [...record.wasteItems];
                                updatedItems[index].amount = e.target.value;
                                setRecord({...record, wasteItems: updatedItems});
                              }}
                              required
                              min="0"
                              step="0.1"
                              placeholder="Amount"
                          />
                          <select
                              className="unit"
                              value={item.unit}
                              onChange={(e) => {
                                const updatedItems = [...record.wasteItems];
                                updatedItems[index].unit = e.target.value;
                                setRecord({...record, wasteItems: updatedItems});
                              }}
                          >
                            <option value="">Select unit</option>
                            <option value="kg">Kilograms (kg)</option>
                            <option value="g">Grams (g)</option>
                          </select>
                          <button
                              type="button"
                              className="trash-entry-remove"
                              onClick={() => removeTrashEntry(index)}
                          >
                            ×
                          </button>
                        </div>
                    ))
                )}
              </div>
            </div>

            <div className="action-buttons">
              {!editMode ? (
                  <button className="btn btn-edit"
                          onClick={toggleEditMode}>Edit</button>
              ) : (
                  <button className="btn btn-edit" onClick={saveChanges}>Save
                    Changes</button>
              )}
              <button className="btn btn-delete" onClick={deleteRecord}>Delete
              </button>
            </div>
          </div>
        </main>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default WasteRecordDetail;