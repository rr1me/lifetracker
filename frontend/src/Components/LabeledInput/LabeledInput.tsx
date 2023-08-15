import s from './Labelednput.module.scss';
import { memo, useLayoutEffect, useRef, useState } from 'react';

const LabeledInput = ({ className, label }: { className: string; label: string }) => {
	const [focus, setFocus] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (wrapperRef.current === null || inputRef.current === null || labelRef.current === null) return;

		const wrapperRect = wrapperRef.current.getBoundingClientRect();
		const inputRect = inputRef.current.getBoundingClientRect();

		const left = inputRect.left - wrapperRect.left;
		const top = inputRect.top - wrapperRect.top;

		wrapperRef.current.style.borderRadius = '5px';

		if (!focus) {
			labelRef.current.style.left = left - 5 + 'px';
			labelRef.current.style.top = top + 'px';
			labelRef.current.style.fontSize = '13px';
			wrapperRef.current.style.borderImage = '';
		}

		if (focus) {
			labelRef.current.style.left = left - 8 + 'px';
			labelRef.current.style.top = -9 + 'px';
			labelRef.current.style.fontSize = '12px';
		}
	}, [focus]);

	const focusEvent = (x: boolean) => () => setFocus(x);

	return (
		<div className={className + ' ' + s.blend} ref={wrapperRef}>
			<input type="text" className={s.input} ref={inputRef} onFocus={focusEvent(true)} onBlur={focusEvent(false)} />
			<div className={s.label} ref={labelRef}>
				{label}
			</div>
		</div>
	);
};

export default memo(LabeledInput);
