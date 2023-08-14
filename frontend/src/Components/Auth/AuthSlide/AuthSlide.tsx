import s from './AuthSlide.module.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import InputZone from './InputZone/InputZone';
import TitleZone from './TitleZone/TitleZone';
import SubmitZone from './SubmitZone/SubmitZone';

const AuthSlide = () => {
	const isInitial = useRef(true);

	useLayoutEffect(() => {
		isInitial.current = false;
	}, []);

	return (
		<div className={s.auth}>
			<TitleZone isInitial={isInitial} />
			<InputZone />
			<SubmitZone isInitial={isInitial} />
		</div>
	);
};

export const delay = (t: number) => new Promise(x => setTimeout(x, t));

export default AuthSlide;
