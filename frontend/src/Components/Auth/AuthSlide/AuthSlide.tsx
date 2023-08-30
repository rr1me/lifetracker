import s from './AuthSlide.module.scss';
import { memo } from 'react';
import TitleZone from './TitleZone/TitleZone';
import SubmitZone from './SubmitZone/SubmitZone';
import InputZone from './InputZone/InputZone';
import ErrorZone from './ErrorZone/ErrorZone';
import { useSelector } from 'react-redux';
import { AuthData } from '../../../redux/slices/authSlice';

const AuthSlide = () => {
	const errorZoneHeight = useSelector((state: { authSlice: AuthData }) => state.authSlice.ui.errorZoneHeight);

	return (
		<div className={s.authSlide}>
			<div style={{marginTop: errorZoneHeight + 'px'}}>
				<TitleZone />
				<InputZone />
				<SubmitZone />
			</div>
			<div>
				<ErrorZone />
			</div>
		</div>
	);
};

export default memo(AuthSlide);
