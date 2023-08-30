import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiStates } from '../../Components/Auth/types';
import { Errors, errorState, singin } from '../thunks/authThunks';

type LocalAuthData = {
	email: string;
	role: role;
};

export type AuthData = {
	credentials: {
		email: string;
		role: role;
		password: string;
		confirmPassword: string;
	};

	ui: {
		authAnimState: UiStates;
		slide: number;
		helpChoice: number;
		errorZoneHeight: number;
		errors: Errors;
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
			confirmPassword: '',
		},

		ui: {
			authAnimState: 0,
			slide: 0,
			helpChoice: 0,
			errorZoneHeight: 0,
			errors: {
				unfilledInputs: errorState.inactive,
				invalidEmail: errorState.inactive,
				invalidPassword: errorState.inactive,
				wrongCreds: errorState.inactive,
				occupiedEmail: errorState.inactive,
				internalError: errorState.inactive
			},
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
		setErrorZoneHeight: ({ ui }, { payload }: { payload: number }) => {
			ui.errorZoneHeight = payload;
		},

		setEmail: ({ credentials }, { payload }: { payload: string }) => {
			credentials.email = payload;
		},
		setPassword: ({ credentials }, { payload }: { payload: string }) => {
			credentials.password = payload;
		},
		setConfirmPassword: ({ credentials }, { payload }: { payload: string }) => {
			credentials.confirmPassword = payload;
		},
	},
	extraReducers: b => {
		b
			.addCase(singin.pending, ({ui}, action) => {
			console.log('pending', action);
		})
			.addCase(singin.rejected, ({ ui }, action) => {
			console.log('rejected');
			const payload = action.payload as string
			// if (!ui.errors.includes(payload))
				ui.errors.push(payload);
		});
	},
});

export default authSlice.reducer;
export const actions = authSlice.actions;
