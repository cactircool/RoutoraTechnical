import { User } from '@/constants/Authenticate';
import { getItem } from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useReducer, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';

const userString = getItem('fret_user');
if (!userString) {
    alert('User could not be found');
    throw new Error('User could not be found');
}

const initialState = {
    user: JSON.parse(userString!) as User,
};

const UserContext = createContext({ user: initialState.user, setUser: ((_) => {}) as (_: User) => void });

export type UserProviderProps = React.PropsWithChildren & {
    user: User,
    setUser: (_: User) => void // React.Dispatch<React.SetStateAction<User>>
}

export const UserProvider = ({ user, setUser, children }: UserProviderProps) => {
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
