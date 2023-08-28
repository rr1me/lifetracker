import { createSlice } from '@reduxjs/toolkit';
import { UiStates } from '../../Components/Auth/types';
import { UserCreds } from '../utils';

type LocalAuthData = {
	email: string;
	role: role;
};

export type AuthData = {
	credentials: {
		email: string;
		role: role;
		password: string;
		confirmedPassword: string;
	};

	ui: {
		authAnimState: UiStates;
		slide: number;
		helpChoice: number;
	};
};

enum role {
	admin,
	user,
}

const storedAuthData = JSON.parse(localStorage.getItem('credentials')!) as LocalAuthData;

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		credentials: {
			email: storedAuthData?.email,
			role: storedAuthData?.role,
			password: '',
			confirmedPassword: '',
		},

		ui: {
			authAnimState: 0,
			slide: 0,
			helpChoice: 0,
		},
	} as AuthData,
	reducers: {
		setAuthAnimState: ({ ui }, { payload }: { payload: UiStates }) => {
			ui.authAnimState = payload;
		},
		setSlide: ({ ui }, { payload }: { payload: number }) => {
			ui.slide = payload;
		},
		backSlide: ({ ui }) => {
			ui.slide = ui.slide - 1;
		},
		setHelpChoice: ({ ui }, { payload }: { payload: number }) => {
			ui.helpChoice = payload;
		},

		setEmail: ({ credentials }, { payload }: { payload: string }) => {
			credentials.email = payload;
		},
		setPassword: ({ credentials }, { payload }: { payload: string }) => {
			credentials.password = payload;
		},
	},
});

export default authSlice.reducer;
export const actions = authSlice.actions;
