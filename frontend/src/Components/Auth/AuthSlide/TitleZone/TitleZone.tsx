import s from './TitleZone.module.scss';
import { useLayoutEffect, useRef } from 'react';
import { uiStates, ZoneComponent } from '../../types';
import { actions, AuthData } from '../../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const { setAuthAnimState } = actions;

const underlinePadding = 3;

const TitleZone: ZoneComponent = ({ isInitial }) => {
	const { authAnimState } = useSelector((state: { authSlice: AuthData }) => state.authSlice);
	const dispatch = useDispatch();

	const titleRef = useRef<HTMLDivElement>(null);
	const actualTitleRef = useRef<HTMLDivElement>(null);
	const uiSelectorRef = useRef<HTMLDivElement>(null);

	const selectorUnderlineRef = useRef<HTMLDivElement>(null);
	const loginSelectorButtonRef = useRef<HTMLButtonElement>(null);
	const singupSelectorButtonRef = useRef<HTMLButtonElement>(null);

	useLayoutEffect(() => {
		if (
			!titleRef.current ||
			!actualTitleRef.current ||
			!uiSelectorRef.current ||
			!selectorUnderlineRef.current ||
			!loginSelectorButtonRef.current ||
			!singupSelectorButtonRef.current
		)
			return;

		if (isInitial.current) {
			// const titleRect = titleRef.current.getBoundingClientRect();
			const actualTitleRect = actualTitleRef.current.getBoundingClientRect();

			// const titleMiddle = titleRect.width / 2;

			const authWidth = document.getElementById('Auth')!.getBoundingClientRect().width;
			const titleMiddle = authWidth / 2;
			const actualTitleMiddle = actualTitleRect.width / 2;

			actualTitleRef.current.style.left = titleMiddle - actualTitleMiddle + 'px';

			const uiSelectorRect = uiSelectorRef.current.getBoundingClientRect();
			const uiSelectorMiddle = uiSelectorRect.width / 2;
			uiSelectorRef.current.style.right = titleMiddle - uiSelectorMiddle + 'px';

			return;
		}

		if (authAnimState !== 0) {
			actualTitleRef.current.style.left = '0';
			uiSelectorRef.current.style.right = '0';

			selectorUnderlineRef.current.style.opacity = '1';

			if (authAnimState === 1) {
				const loginSelectorButtonRect = loginSelectorButtonRef.current.getBoundingClientRect();

				selectorUnderlineRef.current.style.left = underlinePadding + 'px';
				selectorUnderlineRef.current.style.width = loginSelectorButtonRect.width - underlinePadding * 2 + 'px';
			} else if (authAnimState === 2) {
				const loginSelectorButtonRect = loginSelectorButtonRef.current.getBoundingClientRect();
				const singupSelectorButtonRect = singupSelectorButtonRef.current.getBoundingClientRect();

				selectorUnderlineRef.current.style.left = loginSelectorButtonRect.width + 10 + underlinePadding + 'px';
				selectorUnderlineRef.current.style.width = singupSelectorButtonRect.width - underlinePadding * 2 + 'px';
			}
		}
	}, [authAnimState]);

	const onSelectorButtonClick = (i: uiStates) => () => dispatch(setAuthAnimState(i));

	return (
		<div className={s.title} ref={titleRef}>
			<div className={s.actualTitle} ref={actualTitleRef}>
				LifeTracker
			</div>

			<div className={s.uiSelector + (authAnimState === 0 ? ' ' + s.uiSelectorTransparent : '')} ref={uiSelectorRef}>
				<div className={s.selectorUnderline} ref={selectorUnderlineRef} />
				<button className={s.uiSelectorButton} ref={loginSelectorButtonRef} onClick={onSelectorButtonClick(1)}>
					Log in
				</button>
				<button className={s.uiSelectorButton} ref={singupSelectorButtonRef} onClick={onSelectorButtonClick(2)}>
					Sign up
				</button>
			</div>
		</div>
	);
};

export default TitleZone;
