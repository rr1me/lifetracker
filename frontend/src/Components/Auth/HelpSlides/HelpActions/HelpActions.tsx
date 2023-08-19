import s from './HelpActions.module.scss';
import { AuthData } from '../../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import LabeledInput from '../../../LabeledInput/LabeledInput';
import UiSelector from '../../../UiSelector/UiSelector';
import { useState } from 'react';

const HelpActions = () => {
	const helpChoice = useSelector((state: { authSlice: AuthData }) => state.authSlice.helpChoice);

	const [selectorState, setSelectorState] = useState(0);

	const onSelectorClick = (i: number) => setSelectorState(i);

	return (
		<div className={s.choice}>
			{helpChoice === 0 ? (
				<>
					<p className={s.text}>Type your email and we&apos;ll send you instructions to change your password</p>
					<LabeledInput label={'Email'} />
					<button className={s.button}>Submit</button>
				</>
			) : (
				<>

					<LabeledInput label={'Email'} />
					{/*<LabeledInput label={'Password'} />*/}
					<UiSelector index={selectorState} options={['Log innnnn', 'Sing up']} callback={onSelectorClick}/>
					<button className={s.button}>Submit</button>
				</>
			)}
		</div>
	);
};

export default HelpActions;
