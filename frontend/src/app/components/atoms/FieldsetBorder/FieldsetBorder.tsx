import s from './FieldsetBorder.module.scss';
import React, { CSSProperties, forwardRef } from 'react';
import clsx from 'clsx';

const FieldsetBorder = forwardRef<
	HTMLLegendElement,
	{
		label: string,
		borderStyle?: CSSProperties,
		labelPlaceStyle?: CSSProperties,
		className?: string
	}>
	((
		{
			label,
			borderStyle,
			labelPlaceStyle,
			className = ''
		},
		ref
	) =>
		(
			<fieldset className={s.fieldsetBorder} style={borderStyle}>
				<legend className={clsx({
					[s.legend]: true,
					[className]: !!className
				})} style={labelPlaceStyle} ref={ref}>
					<span>{label}</span>
				</legend>
			</fieldset>
		));
FieldsetBorder.displayName = 'FieldsetBorder';

export default FieldsetBorder;
