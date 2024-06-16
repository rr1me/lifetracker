'use client';

import s from './Labelednput.module.scss';
import React, { CSSProperties, HTMLProps, useEffect, useRef, useState } from 'react';
import FieldsetBorder from '@/app/components/atoms/FieldsetBorder/FieldsetBorder';
import clsx from 'clsx';
import { createClassName } from '@/app/components/shared/utils';
import { robotoLight } from '@/app/theme';

export type LabeledInputProps = {
	label: string;
	className?: string;
	invisible?: boolean;
	error?: boolean;
	borderStyle?: CSSProperties
} & HTMLProps<HTMLInputElement>

const LabeledInput = ({
	label,
	className = '',
	invisible = false,
	error = false,
	readOnly,
	borderStyle,
	...props
}: LabeledInputProps) => {
	const [focusUpdate, setFocus] = useState(false);
	const elemRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLLabelElement>(null);
	const fieldsetRef = useRef<HTMLLegendElement>(null);

	useEffect(() => {
		const element = elemRef.current;
		const input = inputRef.current;
		const label = labelRef.current;
		const fieldset = fieldsetRef.current;
		if (!input || !label || !fieldset || !element) return;

		const labelStyle = label.style;
		const legendStyle = fieldset.style;

		const elemRect = element.getBoundingClientRect();
		const inputRect = input.getBoundingClientRect();
		const labelRect = label.getBoundingClientRect();

		const inputValue = input.value;
		const focus = document.activeElement === input;

		if (!focus && inputValue === '') { // getting back
			labelStyle.top = elemRect.height/2 - labelRect.height/2 + 'px';
			labelStyle.left = inputRect.left - elemRect.left + 'px';
			labelStyle.fontSize = '1em';

			legendStyle.maxWidth = '0.01px';
			legendStyle.padding = '0';
		}
		else if ((focus && inputValue === '') || inputValue !== '') { // up position
			labelStyle.top = -(labelRect.height / 2) -1 + 'px';
			labelStyle.left = (inputRect.left - elemRect.left) + 'px';
			labelStyle.fontSize = '0.8em';

			legendStyle.maxWidth = '100%';
			legendStyle.padding = `0 ${(inputRect.left - elemRect.left) / 1.5}px`;
			legendStyle.marginLeft = (inputRect.left - elemRect.left) / 3 + 'px';
		}

		if (labelStyle.opacity === '')
			requestAnimationFrame(() => {
				labelStyle.opacity = '1';
			});

	}, [focusUpdate]);

	const focusEvent = (x: boolean) => () => setFocus(x);

	const inputClassName = clsx({
		[s.inputWrapper]: true,
		[className]: !!className,
		[s.inputInvisible]: invisible,
		[s.error]: error
	});

	return (
		<div className={inputClassName} style={borderStyle} ref={elemRef}>
			<input {...props} className={s.input} ref={inputRef} onFocus={focusEvent(true)}
						 onBlur={focusEvent(false)} disabled={readOnly}
			/>

			<label className={createClassName(s.label, robotoLight)} ref={labelRef}>{label}</label>

			<FieldsetBorder label={label} className={s.fieldsetBorder} ref={fieldsetRef}
				borderStyle={borderStyle} labelPlaceStyle={{ fontSize: '0.8em' }}/>
		</div>
	);
};

export default LabeledInput;
