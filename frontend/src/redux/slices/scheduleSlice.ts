import { createSlice } from '@reduxjs/toolkit';
import schedule from '../../Components/Schedule/Schedule';

export interface IScheduleSlice{
	monthOrWeek: boolean
}

const scheduleSlice = createSlice({
	name: 'scheduleSlice',
	initialState: {
		monthOrWeek: false,

	} as IScheduleSlice,
	reducers: {
		setMonthOrWeek: (state: IScheduleSlice, {payload}: {payload: boolean}) => {
			state.monthOrWeek = payload
		}
	},
});

export default scheduleSlice.reducer;
export const actions = scheduleSlice.actions;