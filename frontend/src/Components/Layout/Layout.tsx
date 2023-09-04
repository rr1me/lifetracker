import s from './Layout.module.scss';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Schedule from '../Schedule/Schedule';
import Index from '../Auth';
import { useAppSelector } from '../../redux/store';

const Layout = () => {
	const location = useLocation();

	const navigate = useNavigate();
	const authData = useAppSelector(state => state.authSlice.ui);

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
