import { configureStore } from '@reduxjs/toolkit';
import { eventApi } from './api/eventApi';
import scheduleSlice from './slices/scheduleSlice';

export const store = configureStore({
	reducer: {
		[eventApi.reducerPath]: eventApi.reducer,
		scheduleSlice
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(eventApi.middleware)
});

export default store
export type AppDispatch = typeof store.dispatch;