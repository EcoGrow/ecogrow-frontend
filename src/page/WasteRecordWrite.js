import React, {useEffect, useState} from 'react';
import './WasteRecordWrite.css';
import {Link, useNavigate} from "react-router-dom";
import LogoutButton from "../components/Logout";
import Modal from "../components/Modal";
import {apiClient} from "../api/client";

const WasteRecordWrite = () => {
  const [entries, setEntries] = useState(
      [{trashType: '', amount: '', unit: ''}]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
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

  const addTrashEntry = () => {
    setEntries([...entries, {trashType: '', amount: '', unit: ''}]);
  };

  const removeTrashEntry = (index) => {
    if (entries.length > 1) {
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
    } else {
      alert('최소 한 개의 쓰레기 항목이 필요합니다!');
    }
  };

  const handleChange = (index, field, value) => {
    const updatedEntries = entries.map((entry, i) => (
        i === index ? {...entry, [field]: value} : entry
    ));
    setEntries(updatedEntries);
  };

  const saveRecords = async () => {
    if (entries.some(
        entry => !entry.trashType || !entry.amount || !entry.unit)) {
      alert('모든 쓰레기 항목의 필드를 채워주세요');
      return;
    }

    try {
      // 쓰레기 기록을 저장하는 POST 요청
      const response = await apiClient.post('/api/waste/records', {
        wasteItems: entries.map(entry => ({
          wasteType: entry.trashType,
          amount: parseFloat(entry.amount),
          unit: entry.unit
        }))
      });

      if (response.status === 201) {
        alert('기록이 성공적으로 저장되었습니다!');
        navigate('/wasteRecord'); // 쓰레기 기록 페이지 또는 다른 페이지로 이동
      } else {
        alert('기록 저장에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('기록 저장 오류:', error);
      alert('기록 저장 중 오류가 발생했습니다.');
    }
  };

  const deleteAllRecords = () => {
    if (window.confirm('모든 기록을 삭제하시겠습니까?')) {
      setEntries([{trashType: '', amount: '', unit: ''}]);
      alert('모든 기록이 삭제되었습니다!');
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setIsModalOpen(true);
  };

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
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>My Page</Link>}
            {isLoggedIn && <Link to="/my-page" onClick={(e) => {
              e.preventDefault();
              window.location.href = '/my-page';
            }}>My Page</Link>}
            {!isLoggedIn && <Link to="/login" onClick={handleLoginClick}>Login</Link>}
            {isLoggedIn && <LogoutButton setMessage={showMessage} />}
          </div>
        </header>
        <div className="WRW-content">
          <h1>Record Your Trash</h1>
          <div className="record-form">
            <form id="trashForm" onSubmit={(e) => {
              e.preventDefault();
              saveRecords();
            }}>
              <button type="button" className="add-entry"
                      onClick={addTrashEntry}>
                + Add New Trash Entry
              </button>

              <div id="trashEntries" className="trash-entries">
                {entries.map((entry, index) => (
                    <div key={index} className="trash-entry">
                      <select
                          className="trash-type"
                          value={entry.trashType}
                          onChange={(e) => handleChange(index, 'trashType',
                              e.target.value)}
                          required
                      >
                        <option value="">Select trash type</option>
                        <option value="plastic">Plastic</option>
                        <option value="paper">Paper</option>
                        <option value="glass">Glass</option>
                        <option value="metal">Metal</option>
                        <option value="organic">Organic</option>
                        <option value="general">General</option>
                      </select>
                      <input
                          type="number"
                          className="amount"
                          value={entry.amount}
                          onChange={(e) => handleChange(index, 'amount',
                              e.target.value)}
                          required
                          min="0"
                          step="0.1"
                          placeholder="Amount"
                      />
                      <select
                          className="unit"
                          value={entry.unit}
                          onChange={(e) => handleChange(index, 'unit',
                              e.target.value)}
                          required
                      >
                        <option value="">Select unit</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                      </select>
                      <button type="button" className="trash-entry-remove"
                              onClick={() => removeTrashEntry(index)}>×
                      </button>
                    </div>
                ))}
              </div>

              <div className="button-group">
                <button type="button" className="btn btn-edit"
                        onClick={saveRecords}>Save
                </button>
                <button type="button" className="btn btn-delete"
                        onClick={deleteAllRecords}>Delete All
                </button>
              </div>
            </form>
          </div>
        </div>
        {isModalOpen && <Modal message={message} onClose={handleCloseModal}/>}
      </div>
  );
};

export default WasteRecordWrite;