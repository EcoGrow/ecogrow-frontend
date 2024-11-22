/* UserSearchModal.js - 프론트엔드 사용자 검색 모달 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './UserSearchModal.css';

const UserSearchModal = ({ isOpen, onClose, onUserSelect, onSearch, searchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [noUsersMessage, setNoUsersMessage] = useState('');

  useEffect(() => {
    if (isOpen && searchQuery.trim()) {
      if (searchResults.length === 0) {
        setNoUsersMessage('일치하는 유저가 없습니다. 다시 입력해주십시오.');
      } else {
        setNoUsersMessage('');
      }
    }
  }, [isOpen, searchResults, searchQuery]);

  if (!isOpen) return null;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log(`Searching for users with email: ${searchQuery}`);
      onSearch(searchQuery);
    }
  };

  const handleUserSelect = (user) => {
    onUserSelect(user);
    onClose();
  };

  return (
      <div className="user-search-modal-overlay">
        <div className="user-search-modal">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <input
              type="text"
              placeholder="이메일을 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>검색</button>
          <ul className="user-list">
            {searchResults.length > 0 ? (
                searchResults.map((user) => (
                    <li key={user.id} onClick={() => handleUserSelect(user)}>
                      {user.email}
                    </li>
                ))
            ) : (
                noUsersMessage && <li className="no-users-message">{noUsersMessage}</li>
            )}
          </ul>
        </div>
      </div>
  );
};

UserSearchModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUserSelect: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        email: PropTypes.string.isRequired,
      })
  ).isRequired,
};

export default UserSearchModal;
