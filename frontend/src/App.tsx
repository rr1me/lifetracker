import React from 'react';
import './App.scss';
import Layout from './Components/Layout/Layout';
import Auth from './Components/Auth/Auth';
import { BrowserRouter } from 'react-router-dom';

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Layout />
			</BrowserRouter>
			{/*<Auth/>*/}
		</div>
	);
}

export default App;
