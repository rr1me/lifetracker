'use client';

import s from './AuthInputZone.module.scss';
import { actions, AuthState } from '@/app/redux/slices/authSlice';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { ChangeEvent } from 'react';
import LabeledInput from '@/app/components/molecules/LabeledInput/LabeledInput';
import { createClassName, PickByType } from '@/app/components/shared/utils';
import clsx from 'clsx';

const { setEmail, setPassword, setConfirmPassword } = actions;

const AuthInputZone = () => {
	const ui = useAppSelector(s => s.authSlice.ui);
	const initial = useAppSelector(s => s.authSlice.initial);

	return (
		<div className={initial ? s.inputZone : createClassName(s.inputZone, ui ? s.signup : s.login)}>
			<EncapsulatedInput
				label="Email"
				sliceFieldName="email"
				actionSetter={setEmail}
				className={s.input} />
			<EncapsulatedInput
				label="Password"
				sliceFieldName="password"
				actionSetter={setPassword}
				className={s.input} />
			<EncapsulatedInput
				label="Confirm password"
				sliceFieldName="confirmPassword"
				actionSetter={setConfirmPassword}
				className={clsx({
					[s.input]: true,
					[s.invisible]: !ui
				})} />
		</div>
	);
};

export default AuthInputZone;

const EncapsulatedInput = ( // todo better make a standalone molecule of this
	{
		label,
		sliceFieldName,
		actionSetter,
		className
	}:
	{
		label: string,
		sliceFieldName: keyof PickByType<AuthState, string>,
		actionSetter: ActionCreatorWithPayload<string>,
		className: string
	}) => {
	const value = useAppSelector(s => s.authSlice[sliceFieldName]);
	const dispatch = useAppDispatch();

	const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
		dispatch(actionSetter(value));

	return <LabeledInput label={label} value={value} onChange={onChange} className={className} />;
};
