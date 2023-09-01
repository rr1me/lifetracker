import { createSlice } from '@reduxjs/toolkit';
import { UiStates } from '../../Components/Auth/types';
import { singin } from '../thunks/authThunks';
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
		confirmPassword: string;
	};

	ui: {
		authAnimState: UiStates;
		slide: number;
		helpChoice: number;
		errorZone: {
			height: number;
			errors: Errors;
		};
		reject: boolean;
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
			errorZone: {
				height: 0,
				errors: {
					unfilledInputs: false,
					invalidEmail: false,
					invalidPassword: false,
					wrongCreds: false,
					occupiedEmail: false,
					internalError: false,
				},
			},
			reject: false,
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
		setErrorZoneHeight: ({ ui: { errorZone } }, { payload }: { payload: number }) => {
			errorZone.height = payload;
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
		setErrorState: ({ ui: { errorZone } }, { payload: { error, state } }: { payload: { error: string; state: boolean } }) => {
			errorZone.errors[error as keyof typeof errorZone.errors] = state;
		},
	},
	extraReducers: b => {
		b.addCase(singin.pending, ({ credentials, ui }, action) => {
			const { email, password, confirmPassword } = credentials;

			const inputsValid = isInputsValid({ email, password });
			ui.errorZone.errors.unfilledInputs = !inputsValid;

			const emailValid = !email !== isEmailValid(email);
			ui.errorZone.errors.invalidEmail = !emailValid

			const passwordValid = !password !== isPasswordValid(password);
			ui.errorZone.errors.invalidPassword = !passwordValid

			ui.reject = !(inputsValid && emailValid && passwordValid);
		}).addCase(singin.rejected, ({ ui }, action) => {
			const payload = action.payload as string;
			console.log(payload);
		});
	},
});

export default authSlice.reducer;
export const actions = authSlice.actions;

const isInputsValid = (data: UserCreds) => !!data.email && !!data.password;
const isEmailValid = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(email);
const isPasswordValid = (password: string) => /^(?!\s*$).{5,}/.test(password);

export const errorMessages = {
	unfilledInputs: 'Please fill every available input',
	invalidEmail: 'Please provide valid email address',
	invalidPassword: 'Password can\'t be shorter than 5 characters and shouldn\'t consist only of spaces',
	wrongCreds: 'Wrong email or password',
	occupiedEmail: 'There is already a user with that email',
	internalError: 'Internal error. Please try again later',
} as {
	[key in ErrorType]: string;
};

type ErrorType = 'unfilledInputs' | 'invalidEmail' | 'invalidPassword' | 'wrongCreds' | 'occupiedEmail' | 'internalError'

type Errors = {
	[key in ErrorType]: boolean;
}
