import React, {useState} from 'react';
import './WasteRecordDetail.css';
import {Link, useNavigate} from "react-router-dom";
import LogoutButton from "../components/Logout";
import Modal from '../components/Modal';

const WasteRecordWrite = () => {
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveChanges = () => {
    setEditMode(false);
    alert('Changes saved successfully!');
  };

  const deleteRecord = () => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      alert('Record deleted successfully!');
      window.location.href = 'https://ecowatch.news/trash-records';
    }
  };

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

        <main className="WRD-content">
          <h1>Trash Record Details</h1>
          <div className={`detail-card ${editMode ? 'edit-mode' : ''}`}
               id="recordDetail">
            <div className="record-header">
              <div className="record-metadata">
                <div>Author: John Doe</div>
                <div>Created: 2024-01-20 14:30</div>
                <div>Last Modified: 2024-01-20 14:30</div>
              </div>
            </div>

            <div className="record-content">
              <div id="trashItems">
                {/* View Mode */}
                {!editMode && (
                    <>
                      <div className="trash-item">
                        <span>Plastic</span>
                        <span>2.5</span>
                        <span>kg</span>
                      </div>
                      <div className="trash-item">
                        <span>Paper</span>
                        <span>1.0</span>
                        <span>kg</span>
                      </div>
                    </>
                )}

                {/* Edit Mode */}
                {editMode && (
                    <>
                      <div className="trash-item-editable">
                        <select className="trash-type" defaultValue="plastic"
                                required>
                          <option value="plastic">Plastic</option>
                          <option value="paper">Paper</option>
                          <option value="glass">Glass</option>
                          <option value="metal">Metal</option>
                          <option value="organic">Organic</option>
                          <option value="electronic">Electronic</option>
                        </select>
                        <input type="number" defaultValue="2.5"
                               className="amount" required min="0" step="0.1"/>
                        <select className="unit" defaultValue="kg" required>
                          <option value="kg">Kilograms (kg)</option>
                          <option value="g">Grams (g)</option>
                          <option value="l">Liters (L)</option>
                          <option value="pieces">Pieces</option>
                        </select>
                      </div>
                      <div className="trash-item-editable">
                        <select className="trash-type" defaultValue="paper"
                                required>
                          <option value="plastic">Plastic</option>
                          <option value="paper">Paper</option>
                          <option value="glass">Glass</option>
                          <option value="metal">Metal</option>
                          <option value="organic">Organic</option>
                          <option value="electronic">Electronic</option>
                        </select>
                        <input type="number" defaultValue="1.0"
                               className="amount" required min="0" step="0.1"/>
                        <select className="unit" defaultValue="kg" required>
                          <option value="kg">Kilograms (kg)</option>
                          <option value="g">Grams (g)</option>
                          <option value="l">Liters (L)</option>
                          <option value="pieces">Pieces</option>
                        </select>
                      </div>
                    </>
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

export default WasteRecordWrite;