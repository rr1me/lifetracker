import s from './ErrorZone.module.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { delay, useIsFirstRender } from '../../../Utils/utils';
import store from '../../../../redux/store';
import { AnyAction } from '@reduxjs/toolkit';

const ErrorZone = ({
	height,
	heightReducer,
	errors,
	errorMessages,
}: {
	height: number;
	heightReducer: (x: number) => AnyAction;
	errors: object;
	errorMessages: object;
}) => {
	const errorZoneInnerRef = useRef<HTMLDivElement>(null);

	const [errorBuffer, setErrorBuffer] = useState<string[]>([]);

	const isFirstRender = useIsFirstRender();

	useLayoutEffect(() => {
		if (isFirstRender || !errorZoneInnerRef.current) return;

		const entries = Object.entries(errors);

		for (const [errorType, state] of entries) {
			const error = errorMessages[errorType as keyof typeof errorMessages];

			if (state && !errorBuffer.includes(error)) {
				setErrorBuffer(v => [...v, error]);

				requestAnimationFrame(() => {
					const elem = errorZoneInnerRef.current as HTMLDivElement;
					const children = elem.children;
					const child = children.namedItem(error)!;

					child.className = s.error + ' ' + s.errorShowed;

					const childIndex = Number(child.ariaRowIndex);

					let height = 0;
					for (let i = 0; i < childIndex; i++) {
						const prevChild = children[i];
						if (prevChild.className === s.error) continue;
						height += prevChild.getBoundingClientRect().height;
					}

					child.setAttribute('style', `transform: translateY(${height}px)`);

					changeZoneHeight(children, heightReducer);
				});

				continue;
			}

			if (!state && errorBuffer.includes(error)) {
				const elem = errorZoneInnerRef.current as HTMLDivElement;
				const children = elem.children;
				const child = children.namedItem(error)!;

				child.className = s.error;

				const index = Number(child.ariaRowIndex) + 1;
				for (let i = index; i < children.length; i++) {
					const childBelow = children[i];
					const currentTranslate = Number(childBelow.getAttribute('style')!.match(/\d+/)![0]);
					childBelow.setAttribute('style', `transform: translateY(${currentTranslate - child.getBoundingClientRect().height}px)`);
				}

				(async () => {
					await delay(250);
					setErrorBuffer(v => v.filter(x => x !== error));

					requestAnimationFrame(() => {
						changeZoneHeight(elem.children, heightReducer);
					});
				})();
			}
		}
	}, [errors]);

	return (
		<div className={s.errorZone}>
			<div ref={errorZoneInnerRef} style={{ height: height === 0 ? 'auto' : height }} className={s.errorZoneInner}>
				{errorBuffer.map((v, i) => (
					<div key={v} className={s.error} id={v} aria-rowindex={i}>
						• {v}
					</div>
				))}
			</div>
		</div>
	);
};

export default ErrorZone;

const changeZoneHeight = (children: HTMLCollection, reducer: (x: number) => AnyAction) => {
	let heightCalc = 0;
	for (const child of children) {
		heightCalc += child.getBoundingClientRect().height;
	}
	store.dispatch(reducer(heightCalc));
};
