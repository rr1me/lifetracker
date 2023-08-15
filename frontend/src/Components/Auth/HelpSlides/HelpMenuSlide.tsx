import s from './HelpMenuSlide.module.scss';
import icons from '../../Icons/Icons';
import { actions } from '../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { memo } from 'react';
import HelpOptions from './HelpOptions/HelpOptions';
import HelpActions from './HelpActions/HelpActions';
import { HelpMenuPage } from '../types';

const { backSlide } = actions;

const HelpMenuSlide = ({ page }: { page: HelpMenuPage }) => {
	const dispatch = useDispatch();

	const onBackClick = () => dispatch(backSlide());

	return (
		<div className={s.menu}>
			<div className={s.back} onClick={onBackClick}>
				{icons.arrowLeft}
			</div>
			{menuPages[page as keyof typeof menuPages]}
		</div>
	);
};

const menuPages = {
	options: <HelpOptions/>,
	actions: <HelpActions/>
}

export default memo(HelpMenuSlide);
