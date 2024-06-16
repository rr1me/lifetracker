'use client';

import s from './AuthHeaderZone.module.scss';
import { EncapsulatedInlineSelector } from '@/app/components/molecules/InlineSelector/InlineSelector';
import { actions } from '@/app/redux/slices/authSlice';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/app/redux/store';

const { setUi } = actions;

const AuthHeaderZone = () => {
	const initial = useAppSelector(s => s.authSlice.initial);

	const wrapperRef = useRef<HTMLElement>(null);
	const nameRef = useRef<HTMLHeadingElement>(null);
	const selectorRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		const name = nameRef.current;
		const selector = selectorRef.current;
		if (!wrapper || !name || !selector) return;

		const availableWidth = wrapper.getBoundingClientRect().width;
		const nameWidth = name.getBoundingClientRect().width;
		const selectorWidth = selector.getBoundingClientRect().width;

		const nameStyle = name.style;
		const selectorStyle = selector.style;

		if (initial){
			const halvedAvailableWidth = availableWidth/2;
			nameStyle.left = halvedAvailableWidth - nameWidth/2 + 'px';
			selectorStyle.left = halvedAvailableWidth - selectorWidth/2 + 'px';
			return;
		}

		nameStyle.left = '0';
		selectorStyle.left = availableWidth - selectorWidth + 'px';
		selectorStyle.opacity = '1';
		selectorStyle.display = 'block';

	}, [initial]);

	return (
		<article className={s.authHeader} ref={wrapperRef}>
			<h1 className={s.name} ref={nameRef}>LifeTracker</h1>
			<span className={s.selector} ref={selectorRef}>
				<EncapsulatedInlineSelector
					selector={s => s.authSlice.ui}
					actionSetter={setUi} />
			</span>
		</article>
	);
};

export default AuthHeaderZone;
