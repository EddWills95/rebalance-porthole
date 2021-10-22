import React, { createContext, useReducer } from 'react';
import { FETCH_CHANNELS, SET_CHANNEL, SET_DIRECTION, SET_LOADING_FALSE, SET_LOADING_TRUE, SET_REBALANCING } from './actions';

export const INCOMING = "INCOMING";
export const OUTGOING = "OUTGOING";

const initialState = { channels: [], loading: false, error: undefined, rebalancing: false, candidateDirection: INCOMING };
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case SET_LOADING_TRUE:
                return { ...state, loading: true };
            case SET_LOADING_FALSE:
                return { ...state, loading: false };
            case FETCH_CHANNELS:
                return { ...state, channels: action.payload }
            case SET_DIRECTION:
                return { ...state, direction: action.payload }
            case SET_CHANNEL:
                const newChannelArray = [...state.channels];
                // Find the existing channel to remove
                const indexToRemove = newChannelArray.findIndex(channel => channel.partnerPublicKey === action.payload.partnerPublicKey);
                const existing = newChannelArray[indexToRemove];
                const mergedChannel = { ...existing, ...action.payload };
                newChannelArray.splice(indexToRemove, 1)
                return { ...state, channels: [...newChannelArray, mergedChannel] };
            case SET_REBALANCING:
                return { ...state, rebalancing: action.payload }
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
