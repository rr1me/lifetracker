import s from './TitleZone.module.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { UiStates, ZoneComponent } from '../../types';
import { actions } from '../../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import UiSelector from '../../../UiSelector/UiSelector';

const { setAuthAnimState } = actions;

const TitleZone: ZoneComponent = ({ isInitial, authAnimState }) => {
	const dispatch = useDispatch();

	const actualTitleRef = useRef<HTMLDivElement>(null);
	const uiSelectorRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!actualTitleRef.current || !uiSelectorRef.current) return;

		const actualTitleStyle = actualTitleRef.current.style;
		const uiSelectorStyle = uiSelectorRef.current.style;

		if (isInitial!.current) {
			const actualTitleRect = actualTitleRef.current.getBoundingClientRect();

			const authWidth = document.getElementById('Auth')!.getBoundingClientRect().width;
			const titleMiddle = authWidth / 2;
			const actualTitleMiddle = actualTitleRect.width / 2;

			actualTitleStyle.left = titleMiddle - actualTitleMiddle + 'px';

			const uiSelectorRect = uiSelectorRef.current.getBoundingClientRect();
			const uiSelectorMiddle = uiSelectorRect.width / 2;
			uiSelectorStyle.right = titleMiddle - uiSelectorMiddle + 'px';

			return;
		}

		if (authAnimState !== 0 && uiSelectorStyle.right !== '0') {
			actualTitleStyle.left = '0';
			uiSelectorStyle.right = '0';
		}
	}, [authAnimState]);

	const onSelectorClick = (i: number) => dispatch(setAuthAnimState((i + 1) as UiStates));

	return (
		<div className={s.title}>
			<div className={s.actualTitle} ref={actualTitleRef}>
				LifeTracker
			</div>

			<div className={s.uiSelector + (authAnimState !== 0 ? ' ' + s.uiSelectorShowed : '')} ref={uiSelectorRef}>
				<UiSelector index={authAnimState === 2 ? 1 : 0} options={['Log in', 'Sing up']} callback={onSelectorClick} />
			</div>
		</div>
	);
};

export default TitleZone;
