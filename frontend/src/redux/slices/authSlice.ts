import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// import authRequests from '../../requests/authRequests';

export type authData = {
	email: string,
	role: role
}

enum role{
	admin,
	user
}

// const singupThunk = createAsyncThunk(
// 	'auth-singup',
// 	async ({username, password}:{username: string, password: string}) => {
// 		const r = authRequests.singup({username, password});
//
// 	}
// )

const authSlice = createSlice({
	name: 'auth',
	initialState: {
	} as authData,
	reducers: {

	}
})

export default authSlice.reducer;
export const actions = authSlice.actions;
