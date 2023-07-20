import { createSlice } from '@reduxjs/toolkit';

type IDate = {
	year: number;
	month: number;
	week: number;
};

export interface IScheduleSlice {
	monthOrWeek: boolean;
	date: IDate;
}

const currentDate = new Date();
const currentDayNumber = currentDate.getDate();
currentDate.setDate(1);

const scheduleSlice = createSlice({
	name: 'scheduleSlice',
	initialState: {
		monthOrWeek: false,
		date: {
			year: currentDate.getFullYear(),
			month: currentDate.getMonth(),
			week: Math.round((currentDate.getDay() - 1 + currentDayNumber) / 6 - 1),
		} as IDate,
	} as IScheduleSlice,
	reducers: {
		setMonthOrWeek: (state: IScheduleSlice, { payload }: { payload: boolean }) => {
			state.monthOrWeek = payload;
		},
		setDate: (state: IScheduleSlice, { payload }: { payload: IDate }) => {
			state.date = payload;
		},
	},
});

export default scheduleSlice.reducer;
export const actions = scheduleSlice.actions;
