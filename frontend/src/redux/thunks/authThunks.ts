import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserCreds } from '../utils';
import { AuthData } from '../slices/authSlice';

export const singup = createAsyncThunk(
	'auth-singup',
	async (_, thunkAPI) => {
		const { email, password } = (thunkAPI.getState() as { authSlice: AuthData }).authSlice.credentials;

		const r = await axios.post('http://localhost:5121/singup', {email, password});
		return r.data;
	}
);

export const singin = createAsyncThunk(
	'auth-singup',
	async (_, thunkAPI) => {
		const { email, password } = (thunkAPI.getState() as { authSlice: AuthData }).authSlice.credentials;

		const r = await axios.post('http://localhost:5121/singin', {email, password}, {withCredentials: true});
		return r.data;
	}
);
