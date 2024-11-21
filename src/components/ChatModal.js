import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose, userId }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const stompClientRef = useRef(null);

    // 채팅방 목록 가져오기
    const fetchChatRooms = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/chat/rooms/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChatRooms(response.data);
        } catch (error) {
            console.error('Error fetching chat rooms', error);
        }
    }, [userId]);

    useEffect(() => {
        if (isOpen) {
            fetchChatRooms();
        }
    }, [isOpen, fetchChatRooms]);

    // 메시지 가져오기
    const fetchMessages = useCallback(async (roomId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/chat/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    userId1: userId,
                    userId2: roomId,
                },
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    }, [userId]);

// 소켓 연결 설정
    const connectWebSocket = useCallback(() => {
        const token = localStorage.getItem('token');
        const socket = new SockJS(`http://localhost:8080/ws/chat?token=${token}`); // JWT 토큰을 쿼리 파라미터로 전달
        const stompClient = Stomp.over(socket);

        stompClient.connect(
            {},
            () => {
                console.log('WebSocket connected');
                stompClient.subscribe(`/topic/chatRoom/${selectedChatRoom.id}`, (message) => {
                    if (message.body) {
                        setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
                    }
                });
            },
            (error) => {
                console.error('WebSocket connection error:', error);
            }
        );

        stompClientRef.current = stompClient;
    }, [selectedChatRoom]);

    useEffect(() => {
        if (selectedChatRoom) {
            connectWebSocket();
            fetchMessages(selectedChatRoom.id);
        }
    }, [selectedChatRoom, connectWebSocket, fetchMessages]);

    // 새로운 채팅방 생성
    const createChatRoom = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/chat/rooms/email', {
                userId,
                recipientEmail,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setChatRooms((prevRooms) => [...prevRooms, response.data]);
            setRecipientEmail('');
        } catch (error) {
            console.error('Error creating chat room', error);
        }
    };

    // 메시지 보내기
    const handleSendMessage = () => {
        if (newMessage.trim() && selectedChatRoom) {
            const message = {
                chatRoomId: selectedChatRoom.id,
                senderId: userId,
                content: newMessage,
            };
            stompClientRef.current.send(`/app/chat/${selectedChatRoom.id}`, {}, JSON.stringify(message));
            setMessages((prevMessages) => [...prevMessages, { ...message, type: 'outgoing' }]);
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
                    <div className="chat-rooms">
                        <h3>채팅방 목록</h3>
                        {chatRooms.map((room) => (
                            <button key={room.id} onClick={() => setSelectedChatRoom(room)} className="chat-room-button">
                                채팅방 {room.id}
                            </button>
                        ))}
                    </div>
                    <div className="create-chat-room">
                        <input
                            type="text"
                            placeholder="이메일로 유저 검색"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            className="email-input"
                        />
                        <button onClick={createChatRoom} className="create-room-button">채팅방 생성</button>
                    </div>
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                <p>{msg.content}</p>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="메시지를 입력하세요..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                        }}
                        className="message-input"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatModal;
