import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserCreds } from '../utils';
import { AuthData } from '../slices/authSlice';

export const singup = createAsyncThunk(
	'auth/singup',
	async (_, thunkAPI) => {
		const { email, password } = (thunkAPI.getState() as { authSlice: AuthData }).authSlice.credentials;

		const r = await axios.post('http://localhost:5121/singup', {email, password});
		return r.data;
	}
);

export const singin = createAsyncThunk('auth/singin', async (_, { getState, rejectWithValue }) => {
	const authSlice = (getState() as { authSlice: AuthData }).authSlice;

	const userCreds = authSlice.credentials;
	// const errors = authSlice.ui.errors;

	// console.log('thunk', errors);

	if (authSlice.ui.reject) return rejectWithValue('Error')


	// const errors = validate({email, password});
	// if (errors.length > 0) return rejectWithValue(errors);
	// let isOk = true;
	//
	// const inputsValid = isInputsValid(userCreds);
	// if (!inputsValid && errors.unfilledInputs === errorState.inactive){
	//
	// }







	// const r = await axios.post('http://localhost:5121/singin', userCreds, { withCredentials: true });
	// return r.data;
});

// const validate = (userCreds: UserCreds) => {
// 	const errors: Error[] = [];
//
// 	const message = 'Every input should be fulfilled'
// 	const error = errors.find(x=>x.message === message)
// 	if (!isInputsValid(userCreds)){
// 		if (!error) errors.push({message, state: errorState.push})
// 	}else{
// 		if (error) {
// 			const i = errors.indexOf(error);
// 			errors[i].state = errorState.pop;
// 		}
// 	}
//
// 	return errors;
// }


//mistakes
//unfilled inputs, wrong symbols in email or invalid email, invalid symbol count in password
//wrong email or password, occupied email
//any status code that doesn't match 2xx

const isInputsValid = (data: UserCreds) => data.email && data.password;
const isEmailValid = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(email)
const isPasswordValid = (password: string) => /^(?!\s*$).{5,}/.test(password);

export enum errorState {
	inactive,
	push,
	active,
	pop
}

export type ErrorType = 'unfilledInputs' | 'invalidEmail' | 'invalidPassword' | 'wrongCreds' | 'occupiedEmail' | 'internalError'

export type Errors = {
	[key in ErrorType]: errorState;
}

const errors = {
	unfilledInputs: errorState.inactive,
	invalidEmail: errorState.inactive,
	invalidPassword: errorState.inactive,
	wrongCreds: errorState.inactive,
	occupiedEmail: errorState.inactive,
	internalError: errorState.inactive
} as Errors

export type Error = {
	message: string;
	state: errorState
}

//control flow: if error then check if it's not exist then push, otherwise return. if no error, then check if it existed,
//then pop, otherwise return
