import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type event = {
	start: number,
	end: number,
	description: string
}

interface Month {
	month: string,
	events: event[]
}

export const eventApi = createApi({
	reducerPath: 'eventApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'https://localhost:7121' }),
	endpoints: (builder) => ({
		getMonth: builder.query<Month, string>({
			query: (datemark) => `month?datemark=${datemark}`,
		}),
	}),
});

export const { useGetMonthQuery } = eventApi;

export default eventApi