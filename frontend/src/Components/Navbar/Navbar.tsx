import s from './Navbar.module.scss';
import { Link } from 'react-router-dom';
import icons from '../Icons/Icons';
import Datepicker from '../Datepicker/Datepicker';

const Navbar = () => {
	return (
		<nav className={s.navbar}>
			<div className={s.outer}>
				<div className={s.inner}>
					<Link to={'/schedule'}>Schedule</Link>
					<Link to={'/tracker'}>Tracker</Link>
					<div className={s.right}>
						<Datepicker />
						{/*<div>username</div>*/}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
