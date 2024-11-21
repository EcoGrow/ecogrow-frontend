import React, { createContext, useState, useEffect, useContext } from 'react';

// EditableContext 생성
const EditableContext = createContext();

// useEditable 훅 정의
export const useEditable = () => {
    const context = useContext(EditableContext);
    if (!context) {
        throw new Error("useEditable must be used within an EditableProvider");
    }
    return context;
};

// EditableProvider 컴포넌트
export const EditableProvider = ({ children }) => {
    const [editableStates, setEditableStates] = useState({});

    // 로컬 스토리지에서 특정 카드의 isEditable 상태 가져오기
    const getIsEditable = (id) => {
        const storedEditable = localStorage.getItem(`isEditable-${id}`);
        return storedEditable === 'true';
    };

    // 컴포넌트가 마운트될 때 초기 상태 로드
    useEffect(() => {
        const storedStates = {};
        document.querySelectorAll('.record-card').forEach(card => {
            const id = card.getAttribute('data-id');
            storedStates[id] = getIsEditable(id);
        });
        setEditableStates(storedStates);
    }, []);

    // 특정 카드의 상태 업데이트
    const updateIsEditable = (id, value) => {
        localStorage.setItem(`isEditable-${id}`, value);
        setEditableStates((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    return (
        <EditableContext.Provider value={{ editableStates, updateIsEditable }}>
            {children}
        </EditableContext.Provider>
    );
};
