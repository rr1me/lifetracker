import React from 'react';
import './App.css';
import Layout from './Components/Layout/Layout';
import { eventApi, useGetMonthQuery } from './redux/api/eventApi';

function App() {
	const { data, error, isLoading } = useGetMonthQuery('2023.05');

	console.log(data, error, isLoading);

	return (
		<div className='App'>
			<Layout />
		</div>
	);
}

export default App;
