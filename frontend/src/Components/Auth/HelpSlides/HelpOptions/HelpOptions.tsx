import s from './HelpOptions.module.scss';
import { actions } from '../../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../redux/store';

const { forwardSlide, setHelpChoice } = actions;

const HelpOptions = () => {
	const helpChoice = useAppSelector(state => state.authSlice.ui.helpChoice);
	const dispatch = useDispatch();

	const onOptionClick = (choice: number) => () => {
		if (choice !== helpChoice) dispatch(setHelpChoice(choice));
		dispatch(forwardSlide());
	};

	return (
		<>
			<div className={s.option} onClick={onOptionClick(0)}>
				I forgot my password
			</div>
			<div className={s.option} onClick={onOptionClick(1)}>
				I have problems with confirmation message
			</div>
		</>
	);
};

export default HelpOptions;
