import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface StoreContextType {
    storeId: string | null;
    storeUrl: string | null;
    setStoreId: (id: string | null) => void;
    setStoreUrl: (url: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [storeId, setStoreIdState] = useState<string | null>(sessionStorage.getItem('storeId'));
    const [storeUrl, setStoreUrlState] = useState<string | null>(sessionStorage.getItem('storeUrl'));

    useEffect(() => {
        if (storeId !== null) sessionStorage.setItem('storeId', storeId);
        else sessionStorage.removeItem('storeId');
    }, [storeId]);

    useEffect(() => {
        if (storeUrl !== null) sessionStorage.setItem('storeUrl', storeUrl);
        else sessionStorage.removeItem('storeUrl');
    }, [storeUrl]);

    const setStoreId = (id: string | null) => {
        setStoreIdState(id);
    };

    const setStoreUrl = (url: string | null) => {
        setStoreUrlState(url);
    };

    return (
        <StoreContext.Provider value={{ storeId, storeUrl, setStoreId, setStoreUrl }}>
            {children}
        </StoreContext.Provider>
    );
};

export { StoreProvider, StoreContext };