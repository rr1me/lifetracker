'use client';

import s from './AuthSubmitZone.module.scss';
import Button from '@/app/components/atoms/Button/Button';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/app/redux/store';
import { actions } from '@/app/redux/slices/authSlice';

const { setUi } = actions;

const AuthSubmitZone = () => {
	
	const dispatch = useAppDispatch();
	const loginRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const login = loginRef.current;
		if (!login) return;
	}, []);

	const onLoginClick = () => dispatch(setUi(0));
	const onSignUpClick = () => dispatch(setUi(1));

	return (
		<div className={s.submitZone}>
			<Button className={s.button} ref={loginRef} onClick={onLoginClick}>Log in</Button>
			<Button className={s.button} onClick={onSignUpClick}>Sign up</Button>
		</div>
	);
};

export default AuthSubmitZone;
