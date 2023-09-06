import s from './HelpOptions.module.scss';
import { actions } from '../../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../redux/store';
import HelpSlideWrapper from '../HelpSlideWrapper';

const { forwardSlide, setHelpChoice } = actions;

const HelpOptionsSlide = () => {
	const helpChoice = useAppSelector(state => state.authSlice.ui.helpChoice);
	const dispatch = useDispatch();

	const onOptionClick = (choice: number) => () => {
		if (choice !== helpChoice) dispatch(setHelpChoice(choice));
		dispatch(forwardSlide());
	};

	return (
		<HelpSlideWrapper>
			<div className={s.option} onClick={onOptionClick(0)}>
				I forgot my password
			</div>
			<div className={s.option} onClick={onOptionClick(1)}>
				I have problems with confirmation message
			</div>
		</HelpSlideWrapper>
	);
};

export default HelpOptionsSlide;
