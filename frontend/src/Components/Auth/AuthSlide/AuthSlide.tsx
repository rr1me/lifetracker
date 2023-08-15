import s from './AuthSlide.module.scss';
import { memo, useLayoutEffect, useRef } from 'react';
import TitleZone from './TitleZone/TitleZone';
import SubmitZone from './SubmitZone/SubmitZone';
import { AuthData } from '../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import InputZone from './InputZone/InputZone';

const AuthSlide = () => {
	const authAnimState = useSelector((state: { authSlice: AuthData }) => state.authSlice.authAnimState);
	const isInitial = useRef(true);

	useLayoutEffect(() => {
		isInitial.current = false;
	}, []);

	return (
		<div className={s.authSlide}>
			<TitleZone isInitial={isInitial} authAnimState={authAnimState}/>
			<InputZone authAnimState={authAnimState}/>
			<SubmitZone isInitial={isInitial} authAnimState={authAnimState}/>
		</div>
	);
};

export const delay = (t: number) => new Promise(x => setTimeout(x, t));

export default memo(AuthSlide);
