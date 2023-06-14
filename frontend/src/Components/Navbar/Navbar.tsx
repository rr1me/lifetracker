import s from './Navbar.module.scss';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<nav className={s.navbar}>
			<div className={s.inner}>
				 <div className={s.links}>
					 <Link to={'/schedule'}>Schedule</Link>
					 <Link to={'/tracker'}>Tracker</Link>
				 </div>
			</div>
		</nav>
	);
};

export default Navbar;