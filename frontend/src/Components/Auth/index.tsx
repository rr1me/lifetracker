import s from './index.module.scss';
import Slider from '../Slider/Slider';
import AuthSlide from './AuthSlide/AuthSlide';
import HelpMenuSlide from './HelpSlides/HelpMenuSlide';
import { useAppSelector } from '../../redux/store';
import AuthSuccessSlide from './SuccessSlides/AuthSuccessSlide';

const AuthMain = () => {
	const { slide } = useAppSelector(state => state.authSlice.ui);

	return (
		<div className={s.auth} id={'Auth'}>
			<Slider index={slide}>
				<AuthSuccessSlide/>
				<AuthSlide />
				<HelpMenuSlide page={'options'} />
				<HelpMenuSlide page={'actions'} />
			</Slider>
		</div>
	);
};

export default AuthMain;
