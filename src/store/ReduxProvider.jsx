"use client"

import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './index';

const ReduxProvider = ({ children }) => {
    return (
        <Provider store={store}>
            {children}

        </Provider>
    );
};

export default ReduxProvider;
