import { configureStore } from '@reduxjs/toolkit';
import { eventApi } from './api/eventApi';
import scheduleSlice from './slices/scheduleSlice';
import authSlice, { wrongCredsErrorMiddleware } from './slices/authSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import authHelpSlice from './slices/authHelpSlice';

export const store = configureStore({
	reducer: {
		[eventApi.reducerPath]: eventApi.reducer,
		scheduleSlice,
		authSlice,
		authHelpSlice
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(eventApi.middleware).concat(wrongCredsErrorMiddleware)
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
