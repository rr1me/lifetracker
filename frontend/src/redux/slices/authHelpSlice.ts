import { createSlice } from '@reduxjs/toolkit';

const authHelpSlice = createSlice({
	name: 'authHelp',
	initialState: {
		helpChoice: 0,

	},
	reducers: {
		setHelpChoice: (state, { payload }: { payload: number }) => {
			state.helpChoice = payload;
		}
	}
});

export default authHelpSlice.reducer;
export const actions = authHelpSlice.actions;
