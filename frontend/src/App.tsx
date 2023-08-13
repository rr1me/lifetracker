import React from 'react';
import './App.scss';
import Layout from './Components/Layout/Layout';
// import Index from './Components/Auth';
import { BrowserRouter } from 'react-router-dom';
import Auth from './Components/Auth';

function App() {
	return (
		<div className='App'>
			<BrowserRouter>
				<Layout />
			</BrowserRouter>

			{/*<Index/>*/}
		</div>
	);
}

export default App;
