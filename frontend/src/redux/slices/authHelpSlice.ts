import { createSlice } from '@reduxjs/toolkit';

const errors = {
	unfilledInputs: false,
	invalidEmail: false,
	invalidPassword: false,
	nonequivalentPasswords: false,
	wrongCreds: false,
	occupiedEmail: false,
	internalError: false,
};

const authHelpSlice = createSlice({
	name: 'authHelp',
	initialState: {
		helpChoice: 0,
		errorZoneHeight: 0,
		errors
	},
	reducers: {
		setHelpChoice: (state, { payload }: { payload: number }) => {
			state.helpChoice = payload;
		},
		setErrorZoneHeight: (state, { payload }: {payload: number}) => {
			state.errorZoneHeight = payload;
		}
	}
});

export default authHelpSlice.reducer;
export const actions = authHelpSlice.actions;

// todo helpMenu errors:
//  confirmationMessageProblems/Resend: unfilledInputs, internalError, wrongCredentials(it should work for confirmed email cases too), invalidEmail
//  confirmationMessageProblems/ChangeEmail: unfilledInputs, internalError, wrongCredentials(it should work for confirmed email cases too), invalidEmail, newEmailIsInvalid
//  changePassword: unfilledInputs, internalError, invalidEmail. Don't tell the user that there is no such email, give him 'success' with text: If you provided a valid email, a help instructions was sent to it
