import { createSlice } from '@reduxjs/toolkit';

export type authData = {
	email: string,
	role: role
}

enum role{
	admin,
	user
}

const authSlice = createSlice({
	name: 'auth',
	initialState: {
	} as authData,
	reducers: {

	}
})

export default authSlice.reducer;
export const actions = authSlice.actions;
