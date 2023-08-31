import s from './AuthSlide.module.scss';
import { memo } from 'react';
import TitleZone from './TitleZone/TitleZone';
import SubmitZone from './SubmitZone/SubmitZone';
import InputZone from './InputZone/InputZone';
import ErrorZone from './ErrorZone/ErrorZone';
import { useSelector } from 'react-redux';
import { AuthData } from '../../../redux/slices/authSlice';

const AuthSlide = () => {
	const errorZoneHeight = useSelector((state: { authSlice: AuthData }) => state.authSlice.ui.errorZone.height);

	return (
		<div className={s.authSlide} style={{ marginTop: errorZoneHeight + 'px' }}>
			<TitleZone />
			<InputZone />
			<SubmitZone />
			<ErrorZone />
		</div>
	);
};

export default memo(AuthSlide);
