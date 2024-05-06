import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useCookies } from 'react-cookie';

interface UserContextType {
    userId: string | null;    
    setUserId: (id: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserIdState] = useState<string | null>(localStorage.getItem('userId'));
    const [cookies] = useCookies(['csrftoken'])

    useEffect(() => {
        const checkSessionToken = async () => {
            try {
                const response = await fetch('/api/whoami/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': cookies.csrftoken,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserIdState(data.username);
                    localStorage.setItem('userId', data.username);
                } else {
                    setUserIdState(null);
                    localStorage.removeItem('userId');
                }
            } catch (error) {
                console.error('Failed to verify session token:', error);
                setUserIdState(null);
                localStorage.removeItem('userId');
            }
        };

        checkSessionToken();
    }, []);

    const setUserId = (userId: string | null) => {
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }
        setUserIdState(userId);
    };

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider, UserContext };