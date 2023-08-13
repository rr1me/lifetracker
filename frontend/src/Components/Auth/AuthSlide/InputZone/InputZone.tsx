import s from './InputZone.module.scss';
import LabeledInput from '../../../LabeledInput/LabeledInput';
import { useLayoutEffect, useRef } from 'react';
import { delay } from '../AuthSlide';
import { ZoneComponent } from '../../types';

const InputZone: ZoneComponent = ({ uiState }) => {
	const inputZoneRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!inputZoneRef.current) return;

		if (uiState !== 0) {
			const inputShowed = s.input + ' ' + s.inputShowed;

			const isInitial = inputZoneRef.current.style.height === '';
			(async () => {
				if (isInitial) {
					await delay(300);
				}

				const inputRect = inputZoneRef.current!.children[0].getBoundingClientRect();
				inputZoneRef.current!.style.height = inputRect.height * (uiState + 1) + 15 * uiState + 10 + 'px';

				if (!isInitial) return;

				const inputs = inputZoneRef.current!.children;
				inputs[0].className = inputShowed;
				await delay(50);
				inputs[1].className = inputShowed;
			})();

			if (uiState === 1) {
				const inputZoneChildren = inputZoneRef.current.children;
				if (inputZoneChildren[0].className !== s.input) inputZoneChildren[2].className = s.input;
			} else if (uiState === 2) {
				(async () => {
					if (isInitial) await delay(400);
					inputZoneRef.current!.children[2].className = inputShowed;
				})();
			}
		}
	}, [uiState]);

	return (
		<div className={s.inputZone} ref={inputZoneRef}>
			<LabeledInput className={s.input} label={'Email'} labelWidth={16.8} offset={2} />
			<LabeledInput className={s.input} label={'Password'} labelWidth={20} offset={4} />
			<LabeledInput className={s.input} label={'Confirm password'} labelWidth={37} offset={15} />
		</div>
	);
};

export default InputZone;
