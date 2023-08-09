import s from './Auth.module.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import LabeledInput from '../LabeledInput/LabeledInput';

const Auth = () => {
	const [uiState, setUiState] = useState<uiStates>(0); // 0 = buttons, 1 = login, 2 = register

	const titleRef = useRef<HTMLDivElement>(null);
	const actualTitleRef = useRef<HTMLDivElement>(null);
	const uiSelectorRef = useRef<HTMLDivElement>(null);
	const inputZoneRef = useRef<HTMLDivElement>(null);

	const buttonRowRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const loginButtonRef = useRef<HTMLButtonElement>(null);
	const singupButtonRef = useRef<HTMLButtonElement>(null);

	const selectorUnderlineRef = useRef<HTMLDivElement>(null);
	const loginSelectorButtonRef = useRef<HTMLButtonElement>(null);
	const singupSelectorButtonRef = useRef<HTMLButtonElement>(null);

	useLayoutEffect(() => {
		if (
			titleRef.current === null ||
			actualTitleRef.current === null ||
			uiSelectorRef.current === null ||
			inputZoneRef.current === null ||
			buttonRowRef.current === null ||
			buttonsRef.current === null ||
			loginButtonRef.current === null ||
			singupButtonRef.current === null ||
			selectorUnderlineRef.current === null ||
			loginSelectorButtonRef.current === null ||
			singupSelectorButtonRef.current === null
		)
			return;

		const titleRect = titleRef.current.getBoundingClientRect();
		const actualTitleRect = actualTitleRef.current.getBoundingClientRect();

		const titleMiddle = titleRect.width / 2;
		const actualTitleMiddle = actualTitleRect.width / 2;
		actualTitleRef.current.style.left = titleMiddle - actualTitleMiddle + 'px';

		const uiSelectorRect = uiSelectorRef.current.getBoundingClientRect();
		const uiSelectorMiddle = uiSelectorRect.width / 2;
		uiSelectorRef.current.style.right = titleMiddle - uiSelectorMiddle + 'px';

		const buttonRowRect = buttonRowRef.current.getBoundingClientRect();
		const buttonsRect = buttonsRef.current.getBoundingClientRect();

		const buttonRowMiddle = buttonRowRect.width / 2;
		const buttonsMiddle = buttonsRect.width / 2;
		buttonsRef.current.style.left = buttonRowMiddle - buttonsMiddle + 'px';
		const underlinePadding = 3;

		if (uiState !== 0) {
			actualTitleRef.current.style.left = '0';
			uiSelectorRef.current.style.right = '0';
			inputZoneRef.current.style.opacity = '1';

			selectorUnderlineRef.current.style.opacity = '1';

			const inputRect = inputZoneRef.current.children[0].getBoundingClientRect();
			inputZoneRef.current.style.height = inputRect.height * (uiState + 1) + 15 * uiState + 10 + 'px';
		}
		if (uiState === 1) {
			const loginButtonRect = loginButtonRef.current.getBoundingClientRect();
			buttonsRef.current.style.left = buttonRowRect.width - loginButtonRect.width + 'px';
			singupButtonRef.current.style.opacity = '0';
			loginButtonRef.current.style.opacity = '1';

			const loginSelectorButtonRect = loginSelectorButtonRef.current.getBoundingClientRect();

			selectorUnderlineRef.current.style.left = underlinePadding + 'px';
			selectorUnderlineRef.current.style.width = loginSelectorButtonRect.width - underlinePadding * 2 + 'px';
		}
		if (uiState === 2) {
			buttonsRef.current.style.left = buttonRowRect.width - buttonsRect.width + 'px';
			loginButtonRef.current.style.opacity = '0';
			singupButtonRef.current.style.opacity = '1';

			const loginSelectorButtonRect = loginSelectorButtonRef.current.getBoundingClientRect();
			const singupSelectorButtonRect = singupSelectorButtonRef.current.getBoundingClientRect();
			selectorUnderlineRef.current.style.left = loginSelectorButtonRect.width + 10 + underlinePadding + 'px';
			selectorUnderlineRef.current.style.width = singupSelectorButtonRect.width - underlinePadding * 2 + 'px';
		}
	}, [uiState]);

	return (
		<div className={s.auth}>
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

			<div className={s.inputZone} ref={inputZoneRef}>
				<LabeledInput className={s.input + (uiState === 0 ? ' ' + s.inputTransparent : '')} label={'Email'} labelWidth={16.8} offset={2} />
				<LabeledInput className={s.input + (uiState === 0 ? ' ' + s.inputTransparent : '')} label={'Password'} labelWidth={20} offset={4} />
				<LabeledInput className={s.input + (uiState !== 2 ? ' ' + s.inputTransparent : '')} label={'Confirm password'} labelWidth={37} offset={15} />
			</div>

			<div ref={buttonRowRef}>
				<div className={s.buttons} ref={buttonsRef}>
					<button
						className={s.button}
						ref={loginButtonRef}
						onClick={() => {
							setUiState(1);
						}}
					>
						Log in
					</button>
					<button
						className={s.button}
						ref={singupButtonRef}
						onClick={() => {
							setUiState(2);
						}}
					>
						Sign up
					</button>
				</div>
			</div>
		</div>
	);
};

type uiStates = 0 | 1 | 2;

export default Auth;
