import s from './index.module.scss';
import Slider from '../Slider/Slider';
import AuthSlide from './AuthSlide/AuthSlide';
import HelpMenuSlide from './HelpSlides/HelpMenuSlide';
import { AuthData } from '../../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const AuthMain = () => {
	const { slide } = useSelector((state: { authSlice: AuthData }) => state.authSlice.ui);

	return (
		<div className={s.auth} id={'Auth'}>
			<Slider index={slide}>
				<AuthSlide />
				<HelpMenuSlide page={'options'} />
				<HelpMenuSlide page={'actions'} />
			</Slider>
		</div>
	);
};

export default AuthMain;
