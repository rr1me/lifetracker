import s from './AuthSlide.module.scss';
import { memo } from 'react';
import TitleZone from './TitleZone/TitleZone';
import SubmitZone from './SubmitZone/SubmitZone';
import InputZone from './InputZone/InputZone';

const AuthSlide = () => {
	return (
		<div className={s.authSlide}>
			<TitleZone />
			<InputZone />
			<SubmitZone />
		</div>
	);
};

export const delay = (t: number) => new Promise(x => setTimeout(x, t));

export default memo(AuthSlide);
