import s from './AuthSlide.module.scss';
import { Dispatch, SetStateAction, useLayoutEffect, useRef, useState } from 'react';
import InputZone from './InputZone/InputZone';
import { uiStates } from '../types';
import TitleZone from './TitleZone/TitleZone';
import SubmitZone from './SubmitZone/SubmitZone';

const AuthSlide = ({ setSliderIndex }: {setSliderIndex: Dispatch<SetStateAction<number>>}) => {
	const [uiState, setUiState] = useState<uiStates>(0); // 0 = buttons, 1 = login, 2 = register
	const isInitial = useRef(true);

	useLayoutEffect(() => {
		isInitial.current = false;
	}, []);

	return (
		<div className={s.auth}>
			<TitleZone uiState={uiState} setUiState={setUiState} isInitial={isInitial}/>
			<InputZone uiState={uiState}/>
			<SubmitZone uiState={uiState} setUiState={setUiState} isInitial={isInitial} setSliderIndex={setSliderIndex}/>
		</div>
	);
};

export const delay = (t: number) => new Promise(x=>setTimeout(x, t));

export default AuthSlide;
