import s from './SubmitZone.module.scss';
import { InteractiveZoneComponent, uiStates, ZoneComponent } from '../../types';
import { useLayoutEffect, useRef } from 'react';
import { delay } from '../AuthSlide';
import { actions, AuthData } from '../../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const { setAuthAnimState, setSlide } = actions;

const SubmitZone: ZoneComponent = ({ isInitial }) => {
	const { authAnimState } = useSelector((state: { authSlice: AuthData }) => state.authSlice);
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

		if (isInitial.current) {
			const authWidth = document.getElementById('Auth')!.getBoundingClientRect().width;
			const buttonRowMiddle = authWidth / 2;
			const buttonsMiddle = buttonsRect.width / 2;
			buttonsRef.current.style.left = buttonRowMiddle - buttonsMiddle + 'px';

			return;
		}

		if (authAnimState !== 0) {
			(async () => {
				if (authAnimState === 2) await delay(100);
				helpRef.current!.style.opacity = '1';
			})();

			if (authAnimState === 1) {
				const loginButtonRect = loginButtonRef.current.getBoundingClientRect();
				buttonsRef.current.style.left = buttonRowRect.width - loginButtonRect.width + 'px';
				singupButtonRef.current.style.opacity = '0';
				loginButtonRef.current.style.opacity = '1';
			} else if (authAnimState === 2) {
				buttonsRef.current.style.left = buttonRowRect.width - buttonsRect.width + 'px';
				loginButtonRef.current.style.opacity = '0';
				singupButtonRef.current.style.opacity = '1';
			}
		}
	}, [authAnimState]);

	const onSelectorButtonClick = (i: uiStates) => () => dispatch(setAuthAnimState(i));
	const onHelpClick = () => dispatch(setSlide(1))

	return (
		<div className={s.submitZone} ref={buttonRowRef}>
			<div onClick={onHelpClick} className={s.help} ref={helpRef}>
				I need help
			</div>
			<div className={s.buttons} ref={buttonsRef}>
				<button className={s.button} ref={loginButtonRef} onClick={onSelectorButtonClick(1)}>
					Log in
				</button>
				<button className={s.button} ref={singupButtonRef} onClick={onSelectorButtonClick(2)}>
					Sign up
				</button>
			</div>
		</div>
	);
};

export default SubmitZone;
