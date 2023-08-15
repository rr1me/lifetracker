import s from './HelpOptions.module.scss';
import { actions, AuthData } from '../../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const { setSlide, setHelpChoice } = actions;

const HelpOptions = () => {
	const helpChoice = useSelector((state: { authSlice: AuthData }) => state.authSlice.helpChoice);
	const dispatch = useDispatch();

	const onOptionClick = (choice: number) => () => {
		if (choice !== helpChoice) dispatch(setHelpChoice(choice));
		dispatch(setSlide(2));
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
	)
};

export default HelpOptions;
