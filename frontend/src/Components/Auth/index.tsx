import s from './index.module.scss';
import Slider from '../Slider/Slider';
import AuthSlide from './AuthSlide/AuthSlide';
import { useAppSelector } from '../../redux/store';
import AuthSuccessSlide from './SuccessSlides/AuthSuccessSlide';
import HelpOptionsSlide from './HelpSlides/HelpOptions/HelpOptionsSlide';
import HelpActionsSlide from './HelpSlides/HelpActions/HelpActionsSlide';

const AuthMain = () => {
	const { slide } = useAppSelector(state => state.authSlice.ui);

	return (
		<div className={s.auth} id={'Auth'}>
			<Slider index={slide}>
				<AuthSuccessSlide />
				<AuthSlide />
				<HelpOptionsSlide />
				<HelpActionsSlide />
			</Slider>
		</div>
	);
};

export default AuthMain;
