import { configureStore } from '@reduxjs/toolkit';
import { eventApi } from './api/eventApi';
import scheduleSlice from './slices/scheduleSlice';
import authSlice, { authData } from './slices/authSlice';

const storedAuthData = JSON.parse(localStorage.getItem('authData')!) as authData;

export const store = configureStore({
	reducer: {
		[eventApi.reducerPath]: eventApi.reducer,
		scheduleSlice,
		authSlice
	},
	preloadedState: {
		authSlice: {
			email: storedAuthData?.email,
			role: storedAuthData?.role
		}
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(eventApi.middleware)
});

export default store;
