import { configureStore } from '@reduxjs/toolkit';
import { eventApi } from './api/eventApi';
import scheduleSlice from './slices/scheduleSlice';
import authSlice, { AuthData, wrongCredsErrorMiddleware } from './slices/authSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

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
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(eventApi.middleware).concat(wrongCredsErrorMiddleware)
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
