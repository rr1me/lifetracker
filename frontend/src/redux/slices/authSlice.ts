import { createSlice } from '@reduxjs/toolkit';
import { UiStates } from '../../Components/Auth/types';
import { singin } from '../thunks/authThunks';

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
					nonequivalentPasswords: false,
					wrongCreds: false,
					occupiedEmail: false,
					internalError: false,
				},
			},
			reject: false,
		},
	} as AuthData,
	reducers: {
		setAuthAnimState: (state, { payload }: { payload: UiStates }) => {
			const prev = state.ui.authAnimState
			state.ui.authAnimState = payload;
			if (state.ui.reject && prev !== payload && prev === 2) validate(state);
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
		validateInputs: state => {
			validate(state)
		}
	},
	extraReducers: b => {
		b.addCase(singin.pending, state => {
			state.ui.reject = !validate(state);
		}).addCase(singin.rejected, ({ ui }, action) => {
			const payload = action.payload as string;
			// console.log(payload);
		});
	},
});

export default authSlice.reducer;
export const actions = authSlice.actions;

const validate = ({ credentials, ui }: AuthData) => {
	const { email, password, confirmPassword } = credentials;

	const inputsValid = isInputsValid(credentials, ui.authAnimState);
	ui.errorZone.errors.unfilledInputs = !inputsValid;

	const emailValid = !email !== isEmailValid(email);
	ui.errorZone.errors.invalidEmail = !emailValid

	const passwordValid = !password !== isPasswordValid(password);
	ui.errorZone.errors.invalidPassword = !passwordValid

	const confirmPasswordValid = ui.authAnimState === 2 && !!confirmPassword && password !== confirmPassword
	ui.errorZone.errors.nonequivalentPasswords = confirmPasswordValid

	return inputsValid && emailValid && passwordValid
}

const isInputsValid = ({email, password, confirmPassword}: {email: string, password: string, confirmPassword: string}, authAnimState: UiStates) =>
	!!email && !!password && (authAnimState !== 2 || !!confirmPassword);
const isEmailValid = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(email);
const isPasswordValid = (password: string) => /^(?!\s*$).{5,}/.test(password);

export const errorMessages = {
	unfilledInputs: 'Please fill every available input',
	invalidEmail: 'Please provide valid email address',
	invalidPassword: 'Password can\'t be shorter than 5 characters and shouldn\'t consist only of spaces',
	nonequivalentPasswords: 'Passwords should be equal',
	wrongCreds: 'Wrong email or password',
	occupiedEmail: 'There is already a user with this email',
	internalError: 'Internal error. Please try again later',
} as {
	[key in ErrorType]: string;
};

type ErrorType = 'unfilledInputs' | 'invalidEmail' | 'invalidPassword' | 'nonequivalentPasswords' | 'wrongCreds' | 'occupiedEmail' | 'internalError'

type Errors = {
	[key in ErrorType]: boolean;
}
