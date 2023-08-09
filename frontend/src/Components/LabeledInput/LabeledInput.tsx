import s from './Labelednput.module.scss';
import { FC, useLayoutEffect, useRef, useState } from 'react';

const LabeledInput: FC<{ className: string; label: string; labelWidth: number; offset: number }> = ({
	className,
	label,
	labelWidth,
	offset,
}) => {
	const [focus, setFocus] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (wrapperRef.current === null || inputRef.current === null || labelRef.current === null) return;

		const wrapperRect = wrapperRef.current.getBoundingClientRect();
		const inputRect = inputRef.current.getBoundingClientRect();
		const labelRect = labelRef.current.getBoundingClientRect();

		const left = inputRect.left - wrapperRect.left;
		const top = inputRect.top - wrapperRect.top;

		const color = '#383838';
		wrapperRef.current.style.borderRadius = '5px';

		if (!focus) {
			labelRef.current.style.left = left + 'px';
			labelRef.current.style.top = top + 'px';
			labelRef.current.style.fontSize = '13px';
			wrapperRef.current.style.borderImage = '';
		}

		if (focus) {
			wrapperRef.current.style.borderImage = `conic-gradient(from 264deg, ${color} 11deg, transparent 14.3deg ${labelWidth}deg, ${color} ${
				offset + labelWidth
			}deg) 1`; // 164
			labelRef.current.style.left = left - 5 + 'px';
			labelRef.current.style.top = -9 + 'px';
			labelRef.current.style.fontSize = '12px';
		}
	}, [focus]);

	const focusEvent = (x: boolean) => () => setFocus(x);

	return (
		<div className={className} style={{ position: 'relative' }} ref={wrapperRef}>
			<input
				type="text"
				className={s.input}
				ref={inputRef}
				onFocus={focusEvent(true)}
				onBlur={focusEvent(false)}
			/>
			<div className={s.label} ref={labelRef}>
				{label}
			</div>
		</div>
	);
};

export default LabeledInput;
