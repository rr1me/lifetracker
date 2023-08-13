import s from './Layout.module.scss';
import Navbar from '../Navbar/Navbar';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Schedule from '../Schedule/Schedule';
import { IScheduleSlice } from '../../redux/slices/scheduleSlice';
import { useSelector } from 'react-redux';
import { AuthData } from '../../redux/slices/authSlice';
import Index from '../Auth';
import { useLayoutEffect } from 'react';

const Layout = () => {
	const location = useLocation();

	const navigate = useNavigate();
	const authData = useSelector((state: { authSlice: AuthData }) => state.authSlice);

	const isInAuth = location.pathname != '/auth';

	// console.log(authData);
	// useLayoutEffect(() => {
	// 	if (authData.email === undefined && !isInAuth) navigate('/auth')
	// }, [location])

	return (
		<div className={s.layout}>
			<div className={s.inner + ' ' + (isInAuth ? s.baseColor : s.auth)}>
				{/*{!isInAuth ?? <Navbar />}*/}
				{/*<Navbar />*/}
				<div className={s.content}>
					<Routes>
						<Route path='/auth' element={<Index />} />
						<Route path='/schedule' element={<Schedule />} />
					</Routes>
				</div>
			</div>
		</div>
	);
};

export default Layout;
