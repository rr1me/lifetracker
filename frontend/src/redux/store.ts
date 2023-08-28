import { configureStore } from '@reduxjs/toolkit';
import { eventApi } from './api/eventApi';
import scheduleSlice from './slices/scheduleSlice';
import authSlice, { AuthData } from './slices/authSlice';

// const storedAuthData = JSON.parse(localStorage.getItem('authData')!) as AuthData;

export const store = configureStore({
	reducer: {
		[eventApi.reducerPath]: eventApi.reducer,
		scheduleSlice,
		authSlice
	},
	// preloadedState: {
	// 	authSlice: {
	// 		email: storedAuthData?.email,
	// 		role: storedAuthData?.role,
	// 		authAnimState: 0,
	// 		slide: 0,
	// 		helpChoice: 0
	// 	} as AuthData
	// },
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(eventApi.middleware)
});

export default store;
