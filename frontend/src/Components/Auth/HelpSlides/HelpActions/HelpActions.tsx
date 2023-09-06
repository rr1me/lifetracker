import s from './HelpActions.module.scss';
import LabeledInput from '../../../LabeledInput/LabeledInput';
import UiSelector from '../../../UiSelector/UiSelector';
import { CSSProperties, useRef, useState } from 'react';
import DotsSeparator from '../../../DotsSeparator/DotsSeparator';
import { useAppSelector } from '../../../../redux/store';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../redux/slices/authSlice';

const { setSlide } = actions;

const HelpActions = () => {
	const dispatch = useDispatch();

	const inputZoneRef = useRef<HTMLDivElement>(null);

	const helpChoice = useAppSelector(state => state.authSlice.ui.helpChoice);

	const [selectorState, setSelectorState] = useState(0);
	const onSelectorClick = (i: number) => setSelectorState(i);
	const inputZoneStyle: CSSProperties = {
		height: selectorState !== 0 ? 153 : 97,
	};

	const onSubmitClick = () => dispatch(setSlide(1)); // todo should be to success slide(->)

	return (
		<div className={s.choice}>
			{helpChoice === 0 ? (
				<>
					<p className={s.text}>Type your email and we&apos;ll send you instructions to change your password</p>
					<LabeledInput label={'Email'} />
				</>
			) : (
				<>
					<div className={s.email}>
						<p>You can request confirmation message again or change email</p>
						<DotsSeparator />
						<div className={s.uiSelector}>
							<UiSelector index={selectorState} options={['Resend', 'Change email']} callback={onSelectorClick} />
						</div>
					</div>
					<div className={s.inputZone} ref={inputZoneRef} style={inputZoneStyle}>
						<LabeledInput label={'Email'} />
						<LabeledInput label={'Password'} additionalClassName={s.input} />
						<LabeledInput label={'New email'} additionalClassName={s.input} invisible={selectorState === 0}/>
					</div>
				</>
			)}
			<button className={s.button} onClick={onSubmitClick}>
				Submit
			</button>
		</div>
	);
};

export default HelpActions;

// todo helpMenu errors:
//  confirmationMessageProblems/Resend: unfilledInputs, internalError, wrongCredentials(it should work for confirmed email cases too), invalidEmail
//  confirmationMessageProblems/ChangeEmail: unfilledInputs, internalError, wrongCredentials(it should work for confirmed email cases too), invalidEmail, newEmailIsInvalid
//  changePassword: unfilledInputs, internalError, invalidEmail. Don't tell the user that there is no such email, give him 'success' with text: If you provided a valid email, a help instructions was sent to it
