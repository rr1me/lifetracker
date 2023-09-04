import s from './HelpActions.module.scss';
import LabeledInput from '../../../LabeledInput/LabeledInput';
import UiSelector from '../../../UiSelector/UiSelector';
import { CSSProperties, useRef, useState } from 'react';
import DotsSeparator from '../../../DotsSeparator/DotsSeparator';
import { useAppSelector } from '../../../../redux/store';

const HelpActions = () => {
	const inputZoneRef = useRef<HTMLDivElement>(null);

	const helpChoice = useAppSelector(state => state.authSlice.ui.helpChoice);

	const [selectorState, setSelectorState] = useState(0);
	const onSelectorClick = (i: number) => setSelectorState(i);
	const inputZoneStyle: CSSProperties = {
		height: selectorState !== 0 ? 153 : 41,
	};

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
					<div className={s.email}>
						<p>You can request confirmation message again or change email</p>
						<DotsSeparator />
						<div className={s.uiSelector}>
							<UiSelector index={selectorState} options={['Resend', 'Change email']} callback={onSelectorClick} />
						</div>
					</div>
					<div className={s.inputZone} ref={inputZoneRef} style={inputZoneStyle}>
						<LabeledInput label={'Email'} />
						<LabeledInput label={'Password'} additionalClassName={s.input + (selectorState !== 0 ? ' ' + s.inputShowed : '')} />
						<LabeledInput label={'New email'} additionalClassName={s.input + (selectorState !== 0 ? ' ' + s.inputShowed : '')} />
					</div>
					<button className={s.button}>Submit</button>
				</>
			)}
		</div>
	);
};

export default HelpActions;
