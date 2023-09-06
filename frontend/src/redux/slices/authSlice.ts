import { createSlice, Middleware } from '@reduxjs/toolkit';
import { UiStates } from '../../Components/Auth/types';
import { auth } from '../thunks/authThunks';

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

const errors = {
	unfilledInputs: false,
	invalidEmail: false,
	invalidPassword: false,
	nonequivalentPasswords: false,
	wrongCreds: false,
	occupiedEmail: false,
	internalError: false,
};

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
			slide: 1,
			errorZone: {
				height: 0,
				errors: errors,
			},
			reject: false,
		},
	} as AuthData,
	reducers: {
		setAuthAnimState: (state, { payload }: { payload: UiStates }) => {
			const prev = state.ui.authAnimState;
			state.ui.authAnimState = payload;
			if (state.ui.reject && prev !== payload && prev === 2) validate(state);
		},
		setSlide: ({ ui }, { payload }: { payload: number }) => { // todo currently unused
			ui.slide = payload;
		},
		backSlide: ({ ui }) => {
			ui.slide--;
		},
		forwardSlide: ({ ui }) => {
			ui.slide++;
		},
		setErrorZoneHeight: ({ ui: { errorZone } }, { payload }: { payload: number }) => {
			errorZone.height = payload;
		},

		setEmail: ({ ui: { errorZone: { errors } }, credentials }, { payload }: { payload: string }) => {
			credentials.email = payload;

			if (errors.occupiedEmail) errors.occupiedEmail = false;
		},
		setPassword: ({ credentials }, { payload }: { payload: string }) => {
			credentials.password = payload;
		},
		setConfirmPassword: ({ credentials }, { payload }: { payload: string }) => {
			credentials.confirmPassword = payload;
		},
		validateInputs: state => {
			validate(state);
		},
		setError: ({ ui: { errorZone } }, { payload: { error, state } }: {payload: {error: ErrorType, state: boolean}}) => {
			errorZone.errors[error] = state;
		},
		successReady: ({ credentials, ui }) => {
			credentials.email = '';
			credentials.password = '';
			credentials.confirmPassword = '';

			ui.errorZone.errors = errors;
			ui.authAnimState = 1;
			ui.slide = 1;
		}
	},
	extraReducers: b => {
		b.addCase(auth.pending, state => {
			state.ui.reject = !validate(state);
		}).addCase(auth.rejected, ({ ui }, action) => {
			if (ui.reject) return;
			const error = action.payload as ErrorType;
			ui.errorZone.errors[error] = true;
		});
	},
});

export default authSlice.reducer;
export const actions = authSlice.actions;

const validate = ({ credentials, ui }: AuthData) => {
	const { email, password, confirmPassword } = credentials;

	const authAnimState = ui.authAnimState;
	const errors = ui.errorZone.errors;

	const inputsValid = isInputsValid(credentials, authAnimState);
	errors.unfilledInputs = !inputsValid;

	const emailValid = !email !== isEmailValid(email);
	errors.invalidEmail = !emailValid;

	const passwordValid = !password !== isPasswordValid(password);
	errors.invalidPassword = !passwordValid;

	const confirmPasswordValid = isConfirmPasswordValid(authAnimState, password, confirmPassword);
	errors.nonequivalentPasswords = !confirmPasswordValid;

	return inputsValid && emailValid && passwordValid && confirmPasswordValid;
};

const isInputsValid = ({ email, password, confirmPassword }: {email: string, password: string, confirmPassword: string}, authAnimState: UiStates) =>
	!!email && !!password && (authAnimState !== 2 || !!confirmPassword);
const isEmailValid = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(email);
const isPasswordValid = (password: string) => /^(?!\s*$).{5,}/.test(password);
const isConfirmPasswordValid = (authAnimState: UiStates, password: string, confirmPassword: string) =>
	authAnimState !== 2 || (!!confirmPassword && password === confirmPassword);

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

export const wrongCredsErrorMiddleware: Middleware = api => next => action => {
	const type = action.type;

	const errors = api.getState().authSlice.ui.errorZone.errors;
	const wrongCreds = errors.wrongCreds;
	if ((wrongCreds && (type === 'auth/setEmail' || type === 'auth/setPassword')) || (errors.occupiedEmail && type === 'auth/setEmail'))
		api.dispatch(actions.setError({ error: wrongCreds ? 'wrongCreds' : 'occupiedEmail', state: false }));

	next(action);
};

export type ErrorType = 'unfilledInputs' | 'invalidEmail' | 'invalidPassword' | 'nonequivalentPasswords' | 'wrongCreds' | 'occupiedEmail' | 'internalError'

type Errors = {
	[key in ErrorType]: boolean;
}
