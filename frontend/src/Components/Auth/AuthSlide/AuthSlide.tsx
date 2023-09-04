import s from './AuthSlide.module.scss';
import { memo } from 'react';
import TitleZone from './TitleZone/TitleZone';
import SubmitZone from './SubmitZone/SubmitZone';
import InputZone from './InputZone/InputZone';
import ErrorZone from './ErrorZone/ErrorZone';
import { useAppSelector } from '../../../redux/store';

const AuthSlide = () => {
	const errorZoneHeight = useAppSelector(state => state.authSlice.ui.errorZone.height);

	return (
		<div className={s.authSlide} style={{ marginTop: errorZoneHeight + 10 + 'px' }}>
			<TitleZone />
			<InputZone />
			<SubmitZone />
			<ErrorZone />
		</div>
	);
};

export default memo(AuthSlide);
