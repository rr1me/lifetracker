import s from './SubmitZone.module.scss';
import { UiStates } from '../../types';
import { useLayoutEffect, useRef } from 'react';
import { actions } from '../../../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { combinedStyle, useIsFirstRender } from '../../../Utils/utils';
import { auth } from '../../../../redux/thunks/authThunks';
import { useAppSelector } from '../../../../redux/store';

const { setAuthAnimState, forwardSlide } = actions;

const SubmitZone = () => {
	const { authAnimState, requestProcessing } = useAppSelector(state => state.authSlice.ui);
	const isFirstRender = useIsFirstRender();
	const dispatch = useDispatch();

	const buttonRowRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const loginButtonRef = useRef<HTMLButtonElement>(null);
	const singupButtonRef = useRef<HTMLButtonElement>(null);

	const helpRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!buttonRowRef.current || !buttonsRef.current || !loginButtonRef.current || !singupButtonRef.current || !helpRef.current) return;

		const buttonRowRect = buttonRowRef.current.getBoundingClientRect();
		const buttonsRect = buttonsRef.current.getBoundingClientRect();

		if (isFirstRender) {
			const authWidth = document.getElementById('Auth')!.getBoundingClientRect().width;
			const buttonRowMiddle = authWidth / 2;
			const buttonsMiddle = buttonsRect.width / 2;
			buttonsRef.current.style.left = buttonRowMiddle - buttonsMiddle + 'px';

			return;
		}

		if (authAnimState === 0) return;

		if (authAnimState === 1) {
			const loginButtonRect = loginButtonRef.current.getBoundingClientRect();
			buttonsRef.current.style.left = buttonRowRect.width - loginButtonRect.width + 'px';
		} else if (authAnimState === 2)
			buttonsRef.current.style.left = buttonRowRect.width - buttonsRect.width + 'px';
	}, [authAnimState]);

	const onSelectorButtonClick = (i: UiStates) => () => {
		if (authAnimState === 0) {
			dispatch(setAuthAnimState(i));
			return;
		}

		if (!requestProcessing) dispatch(auth());
	};
	const onHelpClick = () => dispatch(forwardSlide());

	return (
		<div className={s.submitZone} ref={buttonRowRef}>
			<div onClick={onHelpClick} className={s.help + combinedStyle(authAnimState !== 0, s.helpShowed)} ref={helpRef}>
				I need help
			</div>
			<div className={s.buttons} ref={buttonsRef}>
				<button className={s.button + combinedStyle(authAnimState === 2, s.buttonInvisible)} ref={loginButtonRef} onClick={onSelectorButtonClick(1)}>
					Log in
				</button>
				<button className={s.button + combinedStyle(authAnimState === 1, s.buttonInvisible)} ref={singupButtonRef} onClick={onSelectorButtonClick(2)}>
					Sign up
				</button>
			</div>
		</div>
	);
};

export default SubmitZone;
