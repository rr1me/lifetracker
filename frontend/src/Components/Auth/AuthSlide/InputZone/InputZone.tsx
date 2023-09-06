import s from './InputZone.module.scss';
import LabeledInput from '../../../LabeledInput/LabeledInput';
import { ChangeEvent, useLayoutEffect, useRef, useState } from 'react';
import { actions } from '../../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { delay } from '../../../Utils/utils';
import { useAppSelector } from '../../../../redux/store';

const { setEmail, setPassword, setConfirmPassword } = actions;

const InputZone = () => {
	const dispatch = useDispatch();
	const authAnimState = useAppSelector(state => state.authSlice.ui.authAnimState);
	const inputZoneRef = useRef<HTMLDivElement>(null);

	const [inputInvisibility, setInputInvisibility] = useState<{ email: boolean; password: boolean; confirmPassword: boolean }>({
		email: true,
		password: true,
		confirmPassword: true,
	});

	useLayoutEffect(() => {
		if (!inputZoneRef.current) return;

		if (authAnimState !== 0) {
			const inputs = inputZoneRef.current.children;
			const inputZoneStyle = inputZoneRef.current.style;

			const isInitial = inputZoneStyle.height === '';

			(async () => {
				if (isInitial) await delay(300);

				const inputRect = inputs[0].getBoundingClientRect();
				inputZoneStyle.height = inputRect.height * (authAnimState + 1) + 15 * authAnimState + 10 + 'px';

				if (!isInitial) return;

				setInputInvisibility(x => ({ ...x, email: false }));
				await delay(50);
				setInputInvisibility(x => ({ ...x, password: false }));
			})();

			if (authAnimState === 1 && !inputInvisibility.confirmPassword) setInputInvisibility(x => ({ ...x, confirmPassword: true }));
			else if (authAnimState === 2) {
				(async () => {
					if (isInitial) await delay(400);
					setInputInvisibility(x => ({ ...x, confirmPassword: false }));
				})();
			}
		}
	}, [authAnimState]);

	const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => dispatch(setEmail(e.target.value));
	const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => dispatch(setPassword(e.target.value));
	const onConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => dispatch(setConfirmPassword(e.target.value));

	return (
		<div className={s.inputZone} ref={inputZoneRef}>
			<LabeledInput label={'Email'} additionalClassName={s.input} onChange={onEmailChange} invisible={inputInvisibility.email} />
			<LabeledInput label={'Password'} additionalClassName={s.input} onChange={onPasswordChange} invisible={inputInvisibility.password} />
			<LabeledInput label={'Confirm password'} additionalClassName={s.input} onChange={onConfirmPasswordChange} invisible={inputInvisibility.confirmPassword} />
		</div>
	);
};

export default InputZone;
