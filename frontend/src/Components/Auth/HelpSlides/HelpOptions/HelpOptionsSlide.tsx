import s from './HelpOptions.module.scss';
import { actions } from '../../../../redux/slices/authSlice';
import { actions as helpActions } from '../../../../redux/slices/authHelpSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/store';
import HelpSlideWrapper from '../HelpSlideWrapper';

const { forwardSlide } = actions;
const { setHelpChoice } = helpActions;

const HelpOptionsSlide = () => {
	const helpChoice = useAppSelector(state => state.authHelpSlice.helpChoice);
	const dispatch = useAppDispatch();

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
