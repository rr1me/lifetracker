import s from './Layout.module.scss';
import Navbar from '../Navbar/Navbar';
import { BrowserRouter } from 'react-router-dom';
import Schedule from '../Schedule/Schedule';

const Layout = () => {
	return (
		<BrowserRouter>
			<Navbar/>
			<div className={s.content}>
				<Schedule/>
			</div>
		</BrowserRouter>
	)
};

export default Layout;