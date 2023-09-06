import s from './AuthSlide.module.scss';
import { memo } from 'react';
import TitleZone from './TitleZone/TitleZone';
import SubmitZone from './SubmitZone/SubmitZone';
import InputZone from './InputZone/InputZone';
import ErrorZone from './ErrorZone/ErrorZone';
import { useAppSelector } from '../../../redux/store';
import { actions, errorMessages } from '../../../redux/slices/authSlice';

const { setErrorZoneHeight } = actions;

const AuthSlide = () => {
	const { height, errors } = useAppSelector(state => state.authSlice.ui.errorZone);

	return (
		<div className={s.authSlide} style={{ marginTop: height + 10 + 'px' }}>
			<TitleZone />
			<InputZone />
			<SubmitZone />
			<ErrorZone height={height} errors={errors} errorMessages={errorMessages} heightReducer={setErrorZoneHeight} />
		</div>
	);
};

export default memo(AuthSlide);
