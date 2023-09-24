import s from './HelpSlideWrapper.module.scss';
import { memo, ReactNode } from 'react';
import { actions } from '../../../redux/slices/authSlice';
import { actions as helpActions, errorMessages } from '../../../redux/slices/authHelpSlice';
import icons from '../../Icons/Icons';
import ErrorZone from '../AuthSlide/ErrorZone/ErrorZone';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

const { backSlide } = actions;
const { setErrorZoneHeight } = helpActions;

const HelpSlideWrapper = ({ children }: { children: ReactNode }) => {
	const dispatch = useAppDispatch();
	const { errorZoneHeight, errors } = useAppSelector(state => state.authHelpSlice);

	const onBackClick = () => dispatch(backSlide());

	return (
		<div className={s.menu} style={{ marginTop: errorZoneHeight + 10 + 'px' }}>
			<div className={s.back} onClick={onBackClick}>
				{icons.arrowLeft}
			</div>
			{children}
			<ErrorZone errors={errors} errorMessages={errorMessages} height={errorZoneHeight} heightReducer={setErrorZoneHeight} />
		</div>
	);
};

export default memo(HelpSlideWrapper);
