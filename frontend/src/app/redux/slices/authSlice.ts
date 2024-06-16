import { createSlice } from '@reduxjs/toolkit';

export type AuthState = {
	email: string
	password: string
	confirmPassword: string,
	ui: number // 0 - log in, 1 - sign up,
	initial: boolean
}

const initialState: AuthState = {
	email: '',
	password: '',
	confirmPassword: '',
	ui: 0,
	initial: true
};

const authSlice = createSlice({
	name: 'authSlice',
	initialState,
	reducers: {
		setEmail: (state, { payload }: { payload: string }) => {
			state.email = payload;
		},
		setPassword: (state, { payload }: { payload: string }) => {
			state.password = payload;
		},
		setConfirmPassword: (state, { payload }: { payload: string }) => {
			state.confirmPassword = payload;
		},
		setUi: (state, { payload }: { payload: number }) => {
			if (state.initial)
				state.initial = false;

			state.ui = payload;
		}
	}
});

export default authSlice.reducer;
export const actions = authSlice.actions;
