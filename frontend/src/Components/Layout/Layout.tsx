import s from './Layout.module.scss';
import Navbar from '../Navbar/Navbar';
import { BrowserRouter } from 'react-router-dom';
import Schedule from '../Schedule/Schedule';

const Layout = () => {
	return (
		<div className={s.layout}>
			<BrowserRouter>
				<Navbar/>
				<div className={s.content}>
					<Schedule/>
				</div>
			</BrowserRouter>
		</div>
	)
};

export default Layout;