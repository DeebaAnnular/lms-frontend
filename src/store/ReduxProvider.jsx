"use client"

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store,persistor } from './index';

const ReduxProvider = ({ children }) => {
    return ( 
        <Provider store={store}>
             {
                typeof window !== 'undefined' ? (
                    <PersistGate loading={null} persistor={persistor}>
                        {children}
                    </PersistGate>
                ) : {children}
             }

        </Provider>
    );
};

export default ReduxProvider;
