import s from './SubmitZone.module.scss'
import { InteractiveZoneComponent } from '../../types';
import { useLayoutEffect, useRef } from 'react';
import { delay } from '../AuthSlide';

const SubmitZone: InteractiveZoneComponent = ({uiState, setUiState, isInitial, setSliderIndex}) => {
	const buttonRowRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);
	const loginButtonRef = useRef<HTMLButtonElement>(null);
	const singupButtonRef = useRef<HTMLButtonElement>(null);

	const helpRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (
			!buttonRowRef.current ||
			!buttonsRef.current ||
			!loginButtonRef.current ||
			!singupButtonRef.current ||
			!helpRef.current
		)
			return;

		const buttonRowRect = buttonRowRef.current.getBoundingClientRect();
		const buttonsRect = buttonsRef.current.getBoundingClientRect();

		if (isInitial.current){
			const buttonRowMiddle = buttonRowRect.width / 2;
			const buttonsMiddle = buttonsRect.width / 2;
			buttonsRef.current.style.left = buttonRowMiddle - buttonsMiddle + 'px';

			return;
		}

		if (uiState !== 0) {

			(async () => {
				if (uiState === 2) await delay(100);
				helpRef.current!.style.opacity = '1';
			})();

			if (uiState === 1) {
				const loginButtonRect = loginButtonRef.current.getBoundingClientRect();
				buttonsRef.current.style.left = buttonRowRect.width - loginButtonRect.width + 'px';
				singupButtonRef.current.style.opacity = '0';
				loginButtonRef.current.style.opacity = '1';

			} else if (uiState === 2) {
				buttonsRef.current.style.left = buttonRowRect.width - buttonsRect.width + 'px';
				loginButtonRef.current.style.opacity = '0';
				singupButtonRef.current.style.opacity = '1';
			}
		}
	}, [uiState])

	return (
		<div className={s.submitZone} ref={buttonRowRef}>
			<div onClick={() => setSliderIndex!(1)} className={s.help} ref={helpRef}>
				I need help
			</div>
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
	)
};

export default SubmitZone;
