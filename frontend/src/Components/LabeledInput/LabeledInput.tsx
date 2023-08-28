import s from './Labelednput.module.scss';
import { ChangeEvent, HTMLInputTypeAttribute, memo, useLayoutEffect, useRef, useState } from 'react';

const LabeledInput = ({
	label,
	additionalClassName,
	onChange = undefined,
	type = 'text',
}: {
	label: string;
	additionalClassName?: string;
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
	type?: HTMLInputTypeAttribute;
}) => {
	const [focus, setFocus] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);

	const isInitial = useRef(true);
	useLayoutEffect(() => {
		if (isInitial.current) {
			isInitial.current = false;
			return;
		}
		if (wrapperRef.current === null || inputRef.current === null || labelRef.current === null) return;

		const wrapperRect = wrapperRef.current.getBoundingClientRect();
		const inputRect = inputRef.current.getBoundingClientRect();

		const left = inputRect.left - wrapperRect.left;
		const top = inputRect.top - wrapperRect.top;

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
		<div className={s.inputWrapper + ' ' + s.blend + (additionalClassName ? ' ' + additionalClassName : '')} ref={wrapperRef}>
			<input type={type} className={s.input} ref={inputRef} onFocus={focusEvent(true)} onBlur={focusEvent(false)} onChange={onChange} />
			<div className={s.label} ref={labelRef}>
				{label}
			</div>
		</div>
	);
};

export default memo(LabeledInput);
