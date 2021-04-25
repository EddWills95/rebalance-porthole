import React, { createContext, useReducer } from 'react';
import { FETCH_CHANNELS, SET_CHANNEL, SET_LOADING_FALSE, SET_LOADING_TRUE } from './actions';

const initialState = { channels: [], loading: false, error: undefined };
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case SET_LOADING_TRUE.type:
                return { ...state, loading: true };
            case SET_LOADING_FALSE.type:
                return { ...state, loading: false };
            case FETCH_CHANNELS.type:
                return { ...state, channels: action.payload }
            case SET_CHANNEL.type:
                const newChannelArray = [...state.channels];
                // Find the existing channel to remove
                const indexToRemove = newChannelArray.findIndex(channel => channel.partnerPublicKey === action.payload.partnerPublicKey);
                const existing = newChannelArray[indexToRemove];
                const mergedChannel = { ...existing, ...action.payload };
                newChannelArray.splice(indexToRemove, 1)
                return { ...state, channels: [...newChannelArray, mergedChannel] };
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }