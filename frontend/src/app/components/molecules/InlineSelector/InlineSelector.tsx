'use client';

import s from './InlineSelector.module.scss';
import React, { useEffect, useRef } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

const InlineSelector = ({ items, selected, onSelect }:
	{items: string[], selected: number, onSelect: (i: number) => void}) => {
	const selectorRef = useRef<HTMLDivElement>(null);
	const lineRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const selector = selectorRef.current;
		const line = lineRef.current;

		if (!selector || !line) return;

		const htmlCollection = selector.children;
		const items = Array.from(htmlCollection).slice(1);
		const selectedItemRect = items[selected].getBoundingClientRect();
		const selectorRect = selector.getBoundingClientRect();

		const left = selectedItemRect.left - selectorRect.left + 2;
		const width = selectedItemRect.width - 4;

		line.style.left = left + 'px';
		line.style.width = width + 'px';
	}, [selected]);


	const onItemClick = (e: React.MouseEvent<HTMLButtonElement>) =>
		onSelect(Number(e.currentTarget.getAttribute('data-item')!));

	return (
		<div className={s.selector} ref={selectorRef}>
			<div className={s.line} ref={lineRef}/>

			{items.map((x, i) =>
				(
					<button key={x} data-item={i} onClick={onItemClick}>{x}</button>
				))}
		</div>
	);
};

export default InlineSelector;

export const EncapsulatedInlineSelector = ({ selector, actionSetter }:
	{selector: (s: RootState) => number, actionSetter: ActionCreatorWithPayload<number>}) => {
	const ui = useAppSelector(selector);
	const dispatch = useAppDispatch();
	const onUiSelect = (u: number) => dispatch(actionSetter(u));

	return <InlineSelector
		items={['Log in', 'Sign up']}
		selected={ui} onSelect={onUiSelect} />;
};
