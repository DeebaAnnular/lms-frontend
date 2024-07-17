import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

// Middleware to save the state to localStorage
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    if (typeof window !== 'undefined') {
      localStorage.setItem('reduxState', serializedState);
    }
  } catch (e) {
    console.warn("Could not save state", e);
  }
};

// Middleware to load the state from localStorage
const loadFromLocalStorage = () => {
  try {
    if (typeof window !== 'undefined') {
      const serializedState = localStorage.getItem('reduxState');
      if (serializedState === null) return undefined;
      return JSON.parse(serializedState);
    }
  } catch (e) {
    console.warn("Could not load state", e);
    return undefined;
  }
};

const persistedState = loadFromLocalStorage();

const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
});

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;
