import { createSlice } from '@reduxjs/toolkit';

type AuthHelp = {
	helpChoice: number,
	errorZoneHeight: number,
	errors: Errors
}

const errors = {
	unfilledInputs: false,
	wrongCreds: false,
	invalidEmail: false,
	invalidNewEmail: false,
	internalError: false,
} as Errors;

const authHelpSlice = createSlice({
	name: 'authHelp',
	initialState: {
		helpChoice: 0,
		errorZoneHeight: 0,
		errors,
	} as AuthHelp,
	reducers: {
		setHelpChoice: (state, { payload }: { payload: number }) => {
			state.helpChoice = payload;
		},
		setErrorZoneHeight: (state, { payload }: { payload: number }) => {
			state.errorZoneHeight = payload;
		},
	},
});

export default authHelpSlice.reducer;
export const actions = authHelpSlice.actions;

type ErrorType = 'unfilledInputs' | 'wrongCreds' | 'invalidEmail' | 'invalidNewEmail' | 'internalError'

export const errorMessages = {
	unfilledInputs: 'Please fill every available input',
	wrongCreds: 'Wrong email or password',
	invalidEmail: 'Please provide valid email address',
	invalidNewEmail: 'Please provide valid new email address',
	internalError: 'Internal error. Please try again later',
} as {
	[key in ErrorType]: string;
};

type Errors = {
	[key in ErrorType]: boolean
}

// todo helpMenu errors:
//  confirmationMessageProblems/Resend: unfilledInputs, internalError, wrongCredentials(it should work for confirmed email cases too), invalidEmail
//  confirmationMessageProblems/ChangeEmail: unfilledInputs, internalError, wrongCredentials(it should work for confirmed email cases too), invalidEmail, newEmailIsInvalid
//  changePassword: unfilledInputs, internalError, invalidEmail. Don't tell the user that there is no such email, give him 'success' with text: If you provided a valid email, a help instructions was sent to it
