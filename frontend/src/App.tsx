import React from 'react';
import './App.css';
import Layout from './Components/Layout/Layout';
import { eventApi, useGetMonthQuery } from './redux/api/eventApi';

function App() {
	const { data, error, isLoading } = useGetMonthQuery('01.2023');

	console.log(data, error, isLoading);

	console.log(eventApi);

	return (
		<div className='App'>
			<Layout />
		</div>
	);
}

export default App;
