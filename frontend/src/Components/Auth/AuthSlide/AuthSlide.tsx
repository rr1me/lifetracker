import s from './AuthSlide.module.scss';
import LabeledInput from '../../LabeledInput/LabeledInput';
import { Dispatch, SetStateAction, useLayoutEffect, useRef, useState } from 'react';
import InputZone from './InputZone/InputZone';
import { uiStates } from '../types';
import TitleZone from './TitleZone/TitleZone';
import SubmitZone from './SubmitZone/SubmitZone';

const AuthSlide = ({ setSliderIndex }: {setSliderIndex: Dispatch<SetStateAction<number>>}) => {
	const [uiState, setUiState] = useState<uiStates>(0); // 0 = buttons, 1 = login, 2 = register
	const isInitial = useRef(true);

	// const titleRef = useRef<HTMLDivElement>(null);
	// const actualTitleRef = useRef<HTMLDivElement>(null);
	// const uiSelectorRef = useRef<HTMLDivElement>(null);
	// const inputZoneRef = useRef<HTMLDivElement>(null);

	// const buttonRowRef = useRef<HTMLDivElement>(null);
	// const buttonsRef = useRef<HTMLDivElement>(null);
	// const loginButtonRef = useRef<HTMLButtonElement>(null);
	// const singupButtonRef = useRef<HTMLButtonElement>(null);

	// const selectorUnderlineRef = useRef<HTMLDivElement>(null);
	// const loginSelectorButtonRef = useRef<HTMLButtonElement>(null);
	// const singupSelectorButtonRef = useRef<HTMLButtonElement>(null);

	// const helpRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
	// 	if (
	// 		!buttonRowRef.current ||
	// 		!buttonsRef.current ||
	// 		!loginButtonRef.current ||
	// 		!singupButtonRef.current
	// 	)
	// 		return;
	//
	// 	const buttonRowRect = buttonRowRef.current.getBoundingClientRect();
	// 	const buttonsRect = buttonsRef.current.getBoundingClientRect();
	//
	// 	const buttonRowMiddle = buttonRowRect.width / 2;
	// 	const buttonsMiddle = buttonsRect.width / 2;
	// 	buttonsRef.current.style.left = buttonRowMiddle - buttonsMiddle + 'px';
	//
		isInitial.current = false;
	//
	// 	if (uiState !== 0) {
	//
	// 		(async () => {
	// 			if (uiState === 2) await delay(100);
	// 			helpRef.current!.style.opacity = '1';
	// 		})();
	//
	// 		if (uiState === 1) {
	// 			const loginButtonRect = loginButtonRef.current.getBoundingClientRect();
	// 			buttonsRef.current.style.left = buttonRowRect.width - loginButtonRect.width + 'px';
	// 			singupButtonRef.current.style.opacity = '0';
	// 			loginButtonRef.current.style.opacity = '1';
	//
	// 		} else if (uiState === 2) {
	// 			buttonsRef.current.style.left = buttonRowRect.width - buttonsRect.width + 'px';
	// 			loginButtonRef.current.style.opacity = '0';
	// 			singupButtonRef.current.style.opacity = '1';
	// 		}
	// 	}
	}, []);

	return (
		<div className={s.auth}>
			{/*<div className={s.title} ref={titleRef}>*/}
			{/*	<div className={s.actualTitle} ref={actualTitleRef}>*/}
			{/*		LifeTracker*/}
			{/*	</div>*/}

			{/*	<div className={s.uiSelector + (uiState === 0 ? ' ' + s.uiSelectorTransparent : '')} ref={uiSelectorRef}>*/}
			{/*		<div className={s.selectorUnderline} ref={selectorUnderlineRef} />*/}
			{/*		<button*/}
			{/*			className={s.uiSelectorButton}*/}
			{/*			ref={loginSelectorButtonRef}*/}
			{/*			onClick={() => {*/}
			{/*				setUiState(1);*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			Log in*/}
			{/*		</button>*/}
			{/*		<button*/}
			{/*			className={s.uiSelectorButton}*/}
			{/*			ref={singupSelectorButtonRef}*/}
			{/*			onClick={() => {*/}
			{/*				setUiState(2);*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			Sign up*/}
			{/*		</button>*/}
			{/*	</div>*/}
			{/*</div>*/}

			{/*<div className={s.inputZone} ref={inputZoneRef}>*/}
			{/*	<LabeledInput className={s.input} label={'Email'} labelWidth={16.8} offset={2} />*/}
			{/*	<LabeledInput className={s.input} label={'Password'} labelWidth={20} offset={4} />*/}
			{/*	<LabeledInput className={s.input} label={'Confirm password'} labelWidth={37} offset={15} />*/}
			{/*</div>*/}

			<TitleZone uiState={uiState} setUiState={setUiState} isInitial={isInitial}/>

			<InputZone uiState={uiState} isInitial={isInitial}/>

			{/*<div className={s.submitZone} ref={buttonRowRef}>*/}
			{/*	<div onClick={() => setSliderIndex(1)} className={s.help} ref={helpRef}>*/}
			{/*		I need help*/}
			{/*	</div>*/}
			{/*	<div className={s.buttons} ref={buttonsRef}>*/}
			{/*		<button*/}
			{/*			className={s.button}*/}
			{/*			ref={loginButtonRef}*/}
			{/*			onClick={() => {*/}
			{/*				setUiState(1);*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			Log in*/}
			{/*		</button>*/}
			{/*		<button*/}
			{/*			className={s.button}*/}
			{/*			ref={singupButtonRef}*/}
			{/*			onClick={() => {*/}
			{/*				setUiState(2);*/}
			{/*			}}*/}
			{/*		>*/}
			{/*			Sign up*/}
			{/*		</button>*/}
			{/*	</div>*/}
			{/*</div>*/}

			<SubmitZone uiState={uiState} setUiState={setUiState} isInitial={isInitial} setSliderIndex={setSliderIndex}/>

		</div>
	);
};

export const delay = (t: number) => new Promise(x=>setTimeout(x, t));

export default AuthSlide;
