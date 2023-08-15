import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { UiStates } from '../../Components/Auth/types';
// import authRequests from '../../requests/authRequests';

export type AuthData = {
	email: string;
	role: role;
	authAnimState: UiStates;
	slide: number;
	helpChoice: number;
};

enum role {
	admin,
	user,
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
	initialState: {} as AuthData,
	reducers: {
		setAuthAnimState: (state, { payload }: { payload: UiStates }) => {
			state.authAnimState = payload;
		},
		setSlide: (state, { payload }: { payload: number }) => {
			state.slide = payload;
		},
		forwardSlide: state => {
			state.slide = state.slide - 1;
		},
		backSlide: state => {
			state.slide = state.slide - 1;
		},
		setHelpChoice: (state, { payload }: { payload: number }) => {
			state.helpChoice = payload;
		},
	},
});

export default authSlice.reducer;
export const actions = authSlice.actions;
