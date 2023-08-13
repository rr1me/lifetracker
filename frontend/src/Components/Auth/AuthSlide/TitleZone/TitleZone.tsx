import s from './TitleZone.module.scss';
import { useLayoutEffect, useRef } from 'react';
import { InteractiveZoneComponent, ZoneComponent } from '../../types';
import { delay } from '../AuthSlide';

const TitleZone: InteractiveZoneComponent = ({ uiState, setUiState, isInitial }) => {
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

		if (isInitial.current){
			const titleRect = titleRef.current.getBoundingClientRect();
			const actualTitleRect = actualTitleRef.current.getBoundingClientRect();

			const titleMiddle = titleRect.width / 2;
			const actualTitleMiddle = actualTitleRect.width / 2;
			actualTitleRef.current.style.left = titleMiddle - actualTitleMiddle + 'px';

			const uiSelectorRect = uiSelectorRef.current.getBoundingClientRect();
			const uiSelectorMiddle = uiSelectorRect.width / 2;
			uiSelectorRef.current.style.right = titleMiddle - uiSelectorMiddle + 'px';
			console.log('1');
			return;
		}

		const underlinePadding = 3;

		if (uiState !== 0) {
			actualTitleRef.current.style.left = '0';
			uiSelectorRef.current.style.right = '0';

			selectorUnderlineRef.current.style.opacity = '1';

			if (uiState === 1) {
				const loginSelectorButtonRect = loginSelectorButtonRef.current.getBoundingClientRect();

				selectorUnderlineRef.current.style.left = underlinePadding + 'px';
				selectorUnderlineRef.current.style.width = loginSelectorButtonRect.width - underlinePadding * 2 + 'px';

			} else if (uiState === 2) {
				const loginSelectorButtonRect = loginSelectorButtonRef.current.getBoundingClientRect();
				const singupSelectorButtonRect = singupSelectorButtonRef.current.getBoundingClientRect();
				selectorUnderlineRef.current.style.left = loginSelectorButtonRect.width + 10 + underlinePadding + 'px';
				selectorUnderlineRef.current.style.width = singupSelectorButtonRect.width - underlinePadding * 2 + 'px';
			}
		}
	}, [uiState]);

	return (
		<div className={s.title} ref={titleRef}>
			<div className={s.actualTitle} ref={actualTitleRef}>
				LifeTracker
			</div>

			<div className={s.uiSelector + (uiState === 0 ? ' ' + s.uiSelectorTransparent : '')} ref={uiSelectorRef}>
				<div className={s.selectorUnderline} ref={selectorUnderlineRef} />
				<button
					className={s.uiSelectorButton}
					ref={loginSelectorButtonRef}
					onClick={() => {
						setUiState(1);
					}}
				>
					Log in
				</button>
				<button
					className={s.uiSelectorButton}
					ref={singupSelectorButtonRef}
					onClick={() => {
						setUiState(2);
					}}
				>
					Sign up
				</button>
			</div>
		</div>
	);
};

export default TitleZone;
