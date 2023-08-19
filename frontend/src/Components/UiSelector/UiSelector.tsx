import s from './UiSelector.module.scss';
import { useEffect, useLayoutEffect, useRef } from 'react';

const underlinePadding = 3;

const UiSelector = ({ index, options, callback }: { index: number; options: string[]; callback: (i: number) => void }) => {
	const selectorUnderlineRef = useRef<HTMLDivElement>(null);
	const buttonsRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!selectorUnderlineRef.current || !buttonsRef.current) return;

		const buttonsRect = buttonsRef.current.getBoundingClientRect();
		const childRect = buttonsRef.current.children[index].getBoundingClientRect();

		const selectorUnderlineStyle = selectorUnderlineRef.current.style;

		selectorUnderlineStyle.left = childRect.left - buttonsRect.left + underlinePadding + 'px';
		selectorUnderlineStyle.width = childRect.width - underlinePadding * 2 + 'px';
	}, [index]);

	useEffect(() => {
		if (!selectorUnderlineRef.current) return;
		const selectorUnderlineStyle = selectorUnderlineRef.current.style;
		if (!selectorUnderlineStyle.transition) selectorUnderlineStyle.transition = '250ms';
	}, []);

	const onOptionClick = (i: number) => () => callback(i);

	return (
		<div className={s.uiSelector}>
			<div className={s.selectorUnderline} ref={selectorUnderlineRef} />

			<div className={s.buttons} ref={buttonsRef}>
				{options.map((v, i) => {
					return (
						<button key={v} onClick={onOptionClick(i)}>
							{v}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default UiSelector;
