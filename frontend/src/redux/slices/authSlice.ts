import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { UiStates } from '../../Components/Auth/types';
import { Errors, errorState, ErrorType, singin } from '../thunks/authThunks';
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
		}
		reject: boolean
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
				unfilledInputs: errorState.inactive,
				invalidEmail: errorState.inactive,
				invalidPassword: errorState.inactive,
				wrongCreds: errorState.inactive,
				occupiedEmail: errorState.inactive,
				internalError: errorState.inactive
			}
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
		setErrorZoneHeight: ({ ui: {errorZone} }, { payload }: { payload: number }) => {
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
		setErrorState: ({ui: {errorZone}}, {payload: {error, state}} : {payload: {error: string, state: errorState}}) => {
			errorZone.errors[error as keyof typeof errorZone.errors] = state;
		}
	},
	extraReducers: b => {
		b
			.addCase(singin.pending, ({credentials, ui}, action) => {
			// console.log('pending', action);
			const {email, password, confirmPassword} = credentials;

			let error = false;

			if (!isInputsValid({email, password})){
				if (ui.errorZone.errors.unfilledInputs === errorState.inactive) ui.errorZone.errors.unfilledInputs = errorState.active
				error = true;
			}else{
				if (ui.errorZone.errors.unfilledInputs !== errorState.inactive) ui.errorZone.errors.unfilledInputs = errorState.inactive
			}

			if (!isEmailValid(email)){
				if (ui.errorZone.errors.invalidEmail === errorState.inactive) ui.errorZone.errors.invalidEmail = errorState.active
				error = true;
			}else{
				if (ui.errorZone.errors.invalidEmail !== errorState.inactive) ui.errorZone.errors.invalidEmail = errorState.inactive
			}

			if (!isPasswordValid(password)){
				if (ui.errorZone.errors.invalidPassword === errorState.inactive) ui.errorZone.errors.invalidPassword = errorState.active
				error = true;
			}else{
				if (ui.errorZone.errors.invalidPassword !== errorState.inactive) ui.errorZone.errors.invalidPassword = errorState.inactive
			}

			ui.reject = error
				// console.log(current(ui.errors));




		})
			.addCase(singin.rejected, ({ ui }, action) => {
			// console.log('rejected');
			const payload = action.payload as string
			// if (!ui.errors.includes(payload))
			// 	ui.errors.push(payload);
		});
	},
});

export default authSlice.reducer;
export const actions = authSlice.actions;

const isInputsValid = (data: UserCreds) => data.email && data.password;
const isEmailValid = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i.test(email)
const isPasswordValid = (password: string) => /^(?!\s*$).{5,}/.test(password);

// errors: {
// 	unfilledInputs: errorState.inactive,
// 		invalidEmail: errorState.inactive,
// 		invalidPassword: errorState.inactive,
// 		wrongCreds: errorState.inactive,
// 		occupiedEmail: errorState.inactive,
// 		internalError: errorState.inactive
// }

export const errorMessages = {
	unfilledInputs: 'Please fill every available input',
	invalidEmail: 'Please provide valid email address',
	invalidPassword: 'Password can\'t be shorter than 3 characters and shouldn\'t consist only of spaces',
	wrongCreds: 'Wrong email or password',
	occupiedEmail: 'There is already a user with that email',
	internalError: 'Internal error. Please try again later'
} as {
	[key in ErrorType]: string
}
