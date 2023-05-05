import { createStore, applyMiddleware, compose } from 'redux';
import { setupListeners } from '@reduxjs/toolkit/query'
import { configureStore } from '@reduxjs/toolkit'
import { orderItemsApi } from './api/orderItemsApi';
import { walletApi } from './api/walletApi';
import { dashboardApi } from './api/dashboardApi';

import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk,
    orderItemsApi.middleware,
    walletApi.middleware,
    dashboardApi.middleware)),
);

// export const store = configureStore({
//   reducer: rootReducer,
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware().concat(orderItemsApi.middleware),
// })
