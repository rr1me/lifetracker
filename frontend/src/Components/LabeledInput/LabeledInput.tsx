import s from './Labelednput.module.scss';
import React, { HTMLProps, memo, useLayoutEffect, useRef, useState } from 'react';
import { combinedStyle, useIsFirstRender } from '../Utils/utils';

const LabeledInput = ({
	label,
	additionalClassName = '',
	invisible = false,
	...props
}: {
	label: string;
	additionalClassName?: string;
	invisible?: boolean;
} & HTMLProps<HTMLInputElement>) => {
	const isFirstRender = useIsFirstRender();
	const [focus, setFocus] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (isFirstRender || !wrapperRef.current || !inputRef.current || !labelRef.current) return;

		const left = 15; // like padding
		const top = 11;

		const labelStyle = labelRef.current.style;

		if (!focus) {
			if (inputRef.current.value !== '') return;

			labelStyle.left = left - 5 + 'px';
			labelStyle.top = top + 'px';
			labelStyle.fontSize = '13px';
			wrapperRef.current.style.borderImage = '';

			return;
		}

		if (focus) {
			labelStyle.left = left - 8 + 'px';
			labelStyle.top = -9 + 'px';
			labelStyle.fontSize = '12px';
		}
	}, [focus]);

	const focusEvent = (x: boolean) => () => setFocus(x);

	const inputClassName =
		s.inputWrapper + ' ' + s.blend + combinedStyle(!!additionalClassName, additionalClassName) + combinedStyle(invisible, s.inputInvisible);

	return (
		<div className={inputClassName} ref={wrapperRef}>
			<input {...props} className={s.input} ref={inputRef} onFocus={focusEvent(true)} onBlur={focusEvent(false)} />
			<div className={s.label} ref={labelRef}>
				{label}
			</div>
		</div>
	);
};

export default memo(LabeledInput);
