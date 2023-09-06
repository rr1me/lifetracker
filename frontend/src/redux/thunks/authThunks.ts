import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ErrorType } from '../slices/authSlice';
import { RootState } from '../store';

const url =  process.env.REACT_APP_API;

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

	return r.data;
});
