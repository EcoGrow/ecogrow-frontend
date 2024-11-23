import React, { useState, useEffect } from 'react';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchChatRooms();
        }
    }, [isOpen]);

    const fetchChatRooms = async () => {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`/api/chat/rooms/${userId}`);
        const data = await response.json();
        setChatRooms(data);
    };

    const fetchMessages = async (room) => {
        const userId = localStorage.getItem('userId');
        const otherUserId = room.members.find((m) => m.id !== parseInt(userId)).id;
        const response = await fetch(
            `/api/chat/messages?userId1=${userId}&userId2=${otherUserId}`
        );
        const data = await response.json();
        setMessages(data);
    };

    const handleChatRoomClick = async (room) => {
        setSelectedChatRoom(room);
        await fetchMessages(room);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const userId = localStorage.getItem('userId');
        const otherUserId = selectedChatRoom.members.find(
            (m) => m.id !== parseInt(userId)
        ).id;

        const response = await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senderId: userId,
                recipientId: otherUserId,
                content: newMessage,
            }),
        });

        if (!response.ok) {
            console.error('메시지 전송 실패');
            return;
        }

        const message = await response.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-modal">
            <div className="chat-modal-header">
                {selectedChatRoom ? (
                    <span onClick={() => setSelectedChatRoom(null)}>← 채팅 목록</span>
                ) : (
                    '채팅'
                )}
            </div>
            <div className="chat-modal-body">
                {selectedChatRoom ? (
                    <div className="chat-window">
                        <div className="messages">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`message ${
                                        msg.senderId === localStorage.getItem('userId')
                                            ? 'sent'
                                            : 'received'
                                    }`}
                                >
                                    <div className="bubble">{msg.content}</div>
                                    <div className="timestamp">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="new-chat">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="메시지 입력"
                            />
                            <button onClick={handleSendMessage}>보내기</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {chatRooms.map((room) => (
                            <div
                                key={room.id}
                                className="chat-room"
                                onClick={() => handleChatRoomClick(room)}
                            >
                                <div className="profile-img"></div>
                                <div className="chat-info">
                                    <div className="room-name">
                                        {room.members.map((m) => m.email).join(', ')}
                                    </div>
                                    <div className="last-message">
                                        {room.lastMessage || '최근 메시지가 없습니다.'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatModal;
