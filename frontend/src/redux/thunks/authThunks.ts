import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { AuthData } from '../slices/authSlice';

export const singup = createAsyncThunk('auth/singup', async (_, thunkAPI) => {
	const { email, password } = (thunkAPI.getState() as { authSlice: AuthData }).authSlice.credentials;

	const r = await axios.post('http://localhost:5121/singup', { email, password });
	return r.data;
});

export const singin = createAsyncThunk('auth/singin', async (_, { getState, rejectWithValue }) => {
	const authSlice = (getState() as { authSlice: AuthData }).authSlice;

	const userCreds = authSlice.credentials;

	if (authSlice.ui.reject) return rejectWithValue('Error')

	// const r = await axios.post('http://localhost:5121/singin', userCreds, { withCredentials: true });
	// return r.data;
});
