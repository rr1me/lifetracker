import s from './Labelednput.module.scss';
import { ChangeEvent, HTMLInputTypeAttribute, memo, useLayoutEffect, useRef, useState } from 'react';
import { useIsFirstRender } from '../Utils/utils';

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
	const isFirstRender = useIsFirstRender();
	const [focus, setFocus] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (isFirstRender || !wrapperRef.current || !inputRef.current || !labelRef.current) return;

		const wrapperRect = wrapperRef.current.getBoundingClientRect();
		const inputRect = inputRef.current.getBoundingClientRect();

		const left = inputRect.left - wrapperRect.left;
		const top = inputRect.top - wrapperRect.top;

		const labelStyle = labelRef.current.style;

		if (!focus) {
			if (inputRef.current.value !== '') return;

			labelStyle.left = left - 5 + 'px';
			labelStyle.top = top + 'px';
			labelStyle.fontSize = '13px';
			wrapperRef.current.style.borderImage = '';
		}

		if (focus) {
			labelStyle.left = left - 8 + 'px';
			labelStyle.top = -9 + 'px';
			labelStyle.fontSize = '12px';
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
