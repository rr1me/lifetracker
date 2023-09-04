import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { AuthData, ErrorType } from '../slices/authSlice';
import { RootState } from '../store';

const url =  process.env.REACT_APP_API;

export const singup = createAsyncThunk('auth/singup', async (_, thunkAPI) => {
	const { email, password } = (thunkAPI.getState() as { authSlice: AuthData }).authSlice.credentials;

	const r = await axios.post('http://localhost:5121/singup', { email, password });
	return r.data;
});

export const singin = createAsyncThunk('auth/singin', async (_, { getState, rejectWithValue }) => {
	const authSlice = (getState() as { authSlice: AuthData }).authSlice;

	const userCreds = authSlice.credentials;

	if (authSlice.ui.reject) return rejectWithValue('Error');

	// const r = await axios.post('http://localhost:5121/singin', userCreds, { withCredentials: true });
	// return r.data;
});

export const auth = createAsyncThunk('auth', async (_, { getState, rejectWithValue }: {getState: () => unknown, rejectWithValue: (s?: ErrorType) => void}) => {
	const { ui, credentials: { email, password, confirmPassword } } = (getState() as RootState).authSlice;

	if (ui.reject) return rejectWithValue();

	const isSingIn = ui.authAnimState === 1;

	let r: AxiosResponse;
	try{
		r = await axios.post(url + (isSingIn ? 'singin' : 'singup'), { email, password, confirmPassword }, { withCredentials: true });
	}catch (e: unknown){
		switch ((e as AxiosError).response?.status) {
			case 401: return rejectWithValue('wrongCreds');
			case 406: return rejectWithValue('invalidEmail');
			case 409: return rejectWithValue('occupiedEmail');
			default: return rejectWithValue('internalError');
		}
	}

	console.log(document.cookie);

	return r.data;
});
