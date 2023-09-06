import s from './HelpSlideWrapper.module.scss';
import { memo, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../../../redux/slices/authSlice';
import icons from '../../Icons/Icons';
import ErrorZone from '../AuthSlide/ErrorZone/ErrorZone';

const { backSlide } = actions;

const HelpSlideWrapper = ({ children }: {children: ReactNode}) => {
	const dispatch = useDispatch();

	const onBackClick = () => dispatch(backSlide());

	return (
		<div className={s.menu}>
			<div className={s.back} onClick={onBackClick}>
				{icons.arrowLeft}
			</div>
			{children}
			<ErrorZone/> {/*todo should be specialized*/}
		</div>
	);
};

export default memo(HelpSlideWrapper);
