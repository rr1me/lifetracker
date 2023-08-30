import s from './InputZone.module.scss';
import LabeledInput from '../../../LabeledInput/LabeledInput';
import { ChangeEvent, useLayoutEffect, useRef } from 'react';
import { actions, AuthData } from '../../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { delay } from '../../../Utils/utils';

const { setEmail, setPassword, setConfirmPassword } = actions;

const InputZone = () => {
	const dispatch = useDispatch();
	const authAnimState = useSelector((state: { authSlice: AuthData }) => state.authSlice.ui.authAnimState);
	const inputZoneRef = useRef<HTMLDivElement>(null);
	const baseInputClassName = useRef('');

	useLayoutEffect(() => {
		if (!inputZoneRef.current) return;

		if (authAnimState !== 0) {
			const inputs = inputZoneRef.current.children;
			const inputZoneStyle = inputZoneRef.current.style;

			const currentInputClassName = inputs[0].className;
			const inputShowed = currentInputClassName + ' ' + s.inputShowed;
			const isInitial = inputZoneStyle.height === '';

			if (isInitial) baseInputClassName.current = currentInputClassName;

			(async () => {
				if (isInitial) await delay(300);

				const inputRect = inputs[0].getBoundingClientRect();
				inputZoneStyle.height = inputRect.height * (authAnimState + 1) + 15 * authAnimState + 10 + 'px';

				if (!isInitial) return;

				inputs[0].className = inputShowed;
				await delay(50);
				inputs[1].className = inputShowed;
			})();

			if (authAnimState === 1) {
				const baseClassName = baseInputClassName.current;
				if (inputs[2].className !== baseClassName) inputs[2].className = baseClassName;
			} else if (authAnimState === 2) {
				(async () => {
					if (isInitial) await delay(400);
					inputs[2].className = inputShowed;
				})();
			}
		}
	}, [authAnimState]);

	const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => dispatch(setEmail(e.target.value));
	const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => dispatch(setPassword(e.target.value));
	const onConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => dispatch(setConfirmPassword(e.target.value));

	return (
		<div className={s.inputZone} ref={inputZoneRef}>
			<LabeledInput label={'Email'} additionalClassName={s.input} onChange={onEmailChange} />
			<LabeledInput label={'Password'} additionalClassName={s.input} onChange={onPasswordChange} />
			<LabeledInput label={'Confirm password'} additionalClassName={s.input} onChange={onConfirmPasswordChange} />
		</div>
	);
};

export default InputZone;
