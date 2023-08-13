import s from './HelpSlides.module.scss';
import { Slide } from '../types';
import icons from '../../Icons/Icons';
import { useState } from 'react';
import LabeledInput from '../../LabeledInput/LabeledInput';
import { actions, AuthData } from '../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const { setSlide, setHelpChoice } = actions;

const HelpSlides = () => {
	const { slide, helpChoice } = useSelector((state: { authSlice: AuthData }) => state.authSlice);
	const dispatch = useDispatch();

	// const [helpChoice, setHelpChoice] = useState(0); // 0 = password, 1 = message

	const onBackClick = () => dispatch(setSlide(0));
	const onOptionClick = (choice: number) => () => {
		if (choice !== helpChoice) dispatch(setHelpChoice(choice))
		dispatch(setSlide(2))
	};

	return (
		<>
			<div className={s.menu}>
				<div className={s.back} onClick={onBackClick}>
					{icons.arrowLeft}
				</div>
				<div className={s.option} onClick={onOptionClick(0)}>
					I forgot my password
				</div>
				<div className={s.option} onClick={onOptionClick(1)}>
					I have problems with confirmation message
				</div>
			</div>
			<div className={s.menu}>
				<div className={s.back} onClick={onBackClick}>
					{icons.arrowLeft}
				</div>
				{helpChoice === 0 ? (
					<div>
						<LabeledInput className={s.input} label={'Email'} labelWidth={16.8} offset={2} />
					</div>
				) : (
					<div></div>
				)}
			</div>
		</>
	);
};

export default HelpSlides;
