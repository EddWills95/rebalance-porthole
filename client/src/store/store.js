// store.js
import React, { createContext, useReducer } from 'react';
import { FETCH_CHANNELS, SET_CHANNELS, SET_LOADING_FALSE, SET_LOADING_TRUE } from './actions';

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
            case SET_CHANNELS.type:
                return state;
            default:
                throw new Error();
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }