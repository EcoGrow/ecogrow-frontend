import React, {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {Pie, Doughnut} from 'react-chartjs-2';
import LogoutButton from '../components/Logout';
import Modal from '../components/Modal';
import {apiClient} from '../api/client';
import './WasteRecordDetail.css';

const WasteRecordDetail = () => {
  const [record, setRecord] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const {recordId} = useParams(); // Get record ID from URL
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
    try {
      const response = await apiClient.put(`/api/waste/records/${recordId}`,
          record);
      setRecord(response.data.data); // Update the record with the saved changes
      setEditMode(false);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes.');
    }
  };

  const deleteRecord = async () => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await apiClient.delete(`/api/waste/records/${recordId}`);
        alert('Record deleted successfully!');
        navigate('/wasteRecord'); // Redirect to waste record page after deletion
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record.');
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
            <Link to="/my-page" onClick = {(e) => {e.preventDefault(); window.location.href = '/my-page';}}>My Page</Link>
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>Login</Link>}
            {isLoggedIn && <LogoutButton setMessage={showMessage} />}
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
                <h4>기록 일자: {record.createdAt}</h4>
                <h4>수정 일자: {record.modifiedAt}</h4>
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
                    record.wasteItems.map((item, index) => (
                        <div key={item.id} className="trash-item-editable">
                          <select
                              className="trash-type"
                              value={item.wasteType}
                              onChange={(e) => {
                                const updatedItems = [...record.wasteItems];
                                updatedItems[index].wasteType = e.target.value;
                                setRecord(
                                    {...record, wasteItems: updatedItems});
                              }}
                          >
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
                                setRecord(
                                    {...record, wasteItems: updatedItems});
                              }}
                          />
                          <select
                              className="unit"
                              value={item.unit}
                              onChange={(e) => {
                                const updatedItems = [...record.wasteItems];
                                updatedItems[index].unit = e.target.value;
                                setRecord(
                                    {...record, wasteItems: updatedItems});
                              }}
                          >
                            <option value="kg">Kilograms (kg)</option>
                            <option value="g">Grams (g)</option>
                            <option value="pieces">Pieces</option>
                          </select>
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