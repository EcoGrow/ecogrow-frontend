import React, { useState, useEffect, useRef } from 'react';
import './ChatModal.css';

const ChatModal = ({ isOpen, onClose }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const messagesContainerRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchCurrentUser();
            fetchChatRooms();
        }
    }, [isOpen]);

    const fetchCurrentUser = async () => {
        try {
            const userId = parseInt(localStorage.getItem('userId'),10);
            if (!userId) {
                console.error('사용자 ID가 없습니다.');
                return;
            }
            setCurrentUser(userId);
        } catch (error) {
            console.error('현재 사용자 정보를 불러오는 중 오류 발생:', error);
        }
    };

    const fetchChatRooms = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`/api/chat/rooms/${userId}`);
            const data = await response.json();
            setChatRooms(data);
        } catch (error) {
            console.error('채팅방 정보를 불러오는 중 오류 발생:', error);
        }
    };

    const fetchMessages = async (room) => {
        const userId = parseInt(localStorage.getItem('userId'), 10); // localStorage 값 숫자로 변환
        const otherUserId = room.members.find((m) => m.id !== userId).id;

        try {
            const response = await fetch(`/api/chat/messages?userId1=${userId}&userId2=${otherUserId}`);
            const data = await response.json();

            console.log('Fetched Messages:', data); // 디버깅: 메시지 출력
            setMessages(data);
        } catch (error) {
            console.error('메시지 정보를 불러오는 중 오류 발생:', error);
        }
    };

    const handleChatRoomClick = async (room) => {
        setSelectedChatRoom(room);
        await fetchMessages(room);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const userId = parseInt(localStorage.getItem('userId'), 10); // localStorage 값 숫자로 변환
        const otherUserId = selectedChatRoom.members.find((m) => m.id !== userId).id;

        try {
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
            setMessages((prevMessages) => [
                ...prevMessages,
                { ...message, senderId: userId }
            ]);
            setNewMessage('');
        } catch (error) {
            console.error('메시지 전송 중 오류 발생:', error);
        }
    };

    const handleCreateChatRoom = async () => {
        const userId = parseInt(localStorage.getItem('userId'), 10); // localStorage 값 숫자로 변환
        if (!searchEmail.trim()) return;

        try {
            const response = await fetch(`/api/chat/rooms/email?userId=${userId}&recipientEmail=${searchEmail}`, {
                method: 'POST',
            });

            if (!response.ok) {
                console.error('채팅방 생성 실패');
                return;
            }

            const newRoom = await response.json();
            setChatRooms((prev) => [...prev, newRoom]);
            setSelectedChatRoom(newRoom);
            setSearchEmail('');
        } catch (error) {
            console.error('채팅방 생성 중 오류 발생:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        const scrollToBottom = () => {
            messagesContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
        scrollToBottom();
    }, [messages]);

    if (!isOpen) return null;

    return (
        <>
            <div className="chat-modal-overlay" onClick={onClose}></div>
            <div className="chat-modal">
                <div className="chat-modal-header">
                    {selectedChatRoom ? (
                        <span onClick={() => setSelectedChatRoom(null)}>← 채팅 목록</span>
                    ) : (
                        '채팅'
                    )}
                    <button onClick={onClose}>x</button>
                </div>
                <div className="chat-modal-body">
                    {selectedChatRoom ? (
                        <div className="chat-window">
                            <div className="messages">
                                {messages.map((msg) => {
                                    const userId = parseInt(localStorage.getItem('userId'), 10); // 숫자 변환
                                    const isSent = msg.senderId === userId; // 내가 보낸 메시지 여부

                                    console.log(
                                        `Message ID: ${msg.id}, Content: ${msg.content}, Sender ID: ${msg.senderId}, Recipient ID: ${msg.recipientId}, Current User ID: ${userId}, Is Sent: ${isSent}`
                                    ); // 디버깅 로그

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`message ${isSent ? 'sent' : 'received'}`}
                                        >
                                            <div className={`bubble ${isSent ? 'sent' : 'received'}`}>
                                                {msg.content}
                                            </div>
                                            <div className="timestamp">
                                                {msg.timestamp
                                                    ? new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })
                                                    : '시간 정보 없음'}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesContainerRef}></div>
                            </div>
                            <div className="new-chat">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="메시지 입력"
                                />
                                <button onClick={handleSendMessage}>전송</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="search">
                                <input
                                    type="text"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    placeholder="이메일로 사용자 검색"
                                />
                                <button onClick={handleCreateChatRoom}>채팅방 생성</button>
                            </div>
                            {currentUser && chatRooms.map((room) => {
                                // 상대방만 필터링 (현재 사용자 제외)
                                const otherUser = room.members.find((m) => m.id !== currentUser);

                                return (
                                    <div
                                        key={room.id}
                                        className="chat-room"
                                        onClick={() => handleChatRoomClick(room)}
                                    >
                                        <div className="chat-info">
                                            <img
                                                id="profileImage"
                                                src="https://github.com/EcoGrow/ecogrow-frontend/blob/feat/FeatureModification/free-icon-person-2815428.png?raw=true"
                                                alt="Profile"
                                                className="profile-img"
                                            />
                                            <div className="email-message-container">
                                                <div className="email-position">
                                                    {otherUser ? otherUser.username : '이름 없음'} {/* 상대방 이름 */}
                                                </div>
                                                <div className="last-message">
                                                    {room.lastMessage || '최근 메시지가 없습니다.'} {/* 최근 메시지 */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatModal;
