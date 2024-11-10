import React, { useEffect, useRef, useState } from 'react';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([{ text: '반갑습니다.', type: 'incoming' }]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages((prevMessages) => [
                    ...prevMessages,
                { text: newMessage, type: 'outgoing' }
            ]);
            setNewMessage('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-modal-overlay">
            <div className="chat-modal">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <div className="chat-content">
                    <h2>실시간 채팅</h2>
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <input
                        type="text"
                        placeholder="메시지를 입력하세요..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatModal;