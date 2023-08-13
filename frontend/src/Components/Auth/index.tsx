import s from './index.module.scss';
import Slider from '../Slider/Slider';
import AuthSlide from './AuthSlide/AuthSlide';
import { useState } from 'react';

const AuthMain = () => {
	const [sliderIndex, setSliderIndex] = useState(0);

	return (
		<div className={s.auth} id={'Auth'}>
			<Slider index={sliderIndex}>
				<AuthSlide setSliderIndex={setSliderIndex}/>
				<div>
					secondslide
					<button onClick={()=>setSliderIndex(0)}>back</button>
				</div>
			</Slider>
		</div>
	);
};

export default AuthMain;
