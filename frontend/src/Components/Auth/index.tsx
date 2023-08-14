import s from './index.module.scss';
import Slider from '../Slider/Slider';
import AuthSlide from './AuthSlide/AuthSlide';
import HelpSlides from './HelpSlides/HelpSlides';
import { AuthData } from '../../redux/slices/authSlice';
import { useSelector } from 'react-redux';

const AuthMain = () => {
	const { slide } = useSelector((state: { authSlice: AuthData }) => state.authSlice);

	return (
		<div className={s.auth} id={'Auth'}>
			<Slider index={slide}>
				<AuthSlide />
				<HelpSlides />
			</Slider>
		</div>
	);
};

export default AuthMain;
