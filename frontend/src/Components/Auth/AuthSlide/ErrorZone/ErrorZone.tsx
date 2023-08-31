import s from './ErrorZone.module.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { actions, AuthData, errorMessages } from '../../../../redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { delay, useIsFirstRender } from '../../../Utils/utils';
import { errorState } from '../../../../redux/thunks/authThunks';
import store from '../../../../redux/store';

const { setErrorZoneHeight } = actions;

const ErrorZone = () => {
	const { height, errors } = useSelector((state: { authSlice: AuthData }) => state.authSlice.ui.errorZone);

	const errorZoneInnerRef = useRef<HTMLDivElement>(null);

	const [errorBuffer, setErrorBuffer] = useState<string[]>([]);

	const isFirstRender = useIsFirstRender();

	useLayoutEffect(() => {
		if (isFirstRender || !errorZoneInnerRef.current) return;

		const entries = Object.entries(errors);

		for (const [errorType, state] of entries) {
			const error = errorMessages[errorType as keyof typeof errorMessages];

			if (state === errorState.active && !errorBuffer.includes(error)) {
				console.log(errorBuffer);
				setErrorBuffer(v => [...v, error]);

				requestAnimationFrame(() => {
					const elem = errorZoneInnerRef.current as HTMLDivElement;
					const children = elem.children;
					const child = children.namedItem(error)!;

					child.className = s.error + ' ' + s.errorShowed;

					const childIndex = Number(child.ariaRowIndex)

					let height = 0;
					for (let i = 0; i<childIndex; i++){
						const prevChild = children[i];
						if (prevChild.className === s.error) continue;
						height += prevChild.getBoundingClientRect().height
					}

					child.setAttribute('style', `transform: translateY(${height}px)`)

					changeZoneHeight(children)
				});

				continue;
			}

			if (state === errorState.inactive && errorBuffer.includes(error)) {
				const elem = errorZoneInnerRef.current as HTMLDivElement;
				const children = elem.children;
				const child = children.namedItem(error)!;

				child.className = s.error;

				const index = Number(child.ariaRowIndex)+1;
				for (let i = index; i<children.length; i++){
					const childBelow = children[i];
					const currentTranslate = Number(childBelow.getAttribute('style')!.match(/\d+/)![0]);
					childBelow.setAttribute('style', `transform: translateY(${currentTranslate - child.getBoundingClientRect().height}px)`)
				}

				(async () => {
					await delay(250);
					console.log(errorBuffer);
					setErrorBuffer(v => v.filter(x => x !== error));

					requestAnimationFrame(() => {
						changeZoneHeight(elem.children);
					});
				})();
			}
		}
	}, [errors]);

	return (
		<div className={s.errorZone} >
			<div ref={errorZoneInnerRef}
				 style={{ height: height === 0 ? 'auto' : height }}
				 className={s.errorZoneInner}>
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

const changeZoneHeight = (children: HTMLCollection) => {
	let heightCalc = 0;
	for(const child of children){
		heightCalc += child.getBoundingClientRect().height
	}
	store.dispatch(setErrorZoneHeight(heightCalc));
}

//
//
//
//
//
//
//
//
//
//
//
//
//

// const entries = Object.entries(errors)
// console.log('h');
// for (const entry of entries){
// 	const error = entry[0]
// 	const state = entry[1]
//
// 	// console.log(entry);
// 	const includes = errorBuffer.includes(error);
// 	if (state === errorState.push && !includes){
// 		setErrorBuffer(v=>[...v, error])
// 		dispatch(setErrorState({error, state: errorState.active}))
// 		console.log(errorZoneInnerRef.current.children);
// 		continue;
// 	}
//
// 	if (state === errorState.pop && includes){
// 		setErrorBuffer(v=>v.filter(x=>x === error))
// 		dispatch(setErrorState({error, state: errorState.inactive}))
// 	}
// }
// console.log(errorBuffer, errorZoneInnerRef.current.children);
//
//
// if (errorBuffer.length < 1) return;
//
// const height = errorZoneInnerRef.current.getBoundingClientRect().height;
// dispatch(setErrorZoneHeight(height));
// const children = errorZoneInnerRef.current.children;
//
// for (const child of children){
// 	child.className = s.error + ' ' + s.errorShowed
// }
//
// children[children.length-1].className = s.error + ' ' + s.errorShowed

// useLayoutEffect(() => {
// 	if (isFirstRender || !errorZoneInnerRef.current) return;
//
// 	const entries = Object.entries(errors);
//
// 	for (const [error, state] of entries) {
//
// 		if (state === errorState.push) setErrorBuffer(v => [...v, error]);
//
// 	}
//
//
// 	if (errorBuffer.length < 1) return;
//
// 	const height = errorZoneInnerRef.current.getBoundingClientRect().height;
// 	dispatch(setErrorZoneHeight(height));
// 	const children = errorZoneInnerRef.current.children;
//
// }, [errors]);
//
// useEffect(() => {
// 	if (isFirstRender || !errorZoneInnerRef.current) return;
//
// 	const children = errorZoneInnerRef.current.children;
//
// 	// Children.forEach(children, (child, index) => {
// 	// 	console.log(child);
// 	// })
// 	console.log(errorBuffer);
//
// 	for (const child of children) {
// 		// child.getAttribute()
// 		// console.log('hey');
// 		const renderedError = child.textContent!.slice(2);
//
//
// 		const state = errors[renderedError as keyof typeof errors];
//
// 		if (state === errorState.push) {
// 			child.className = s.error + ' ' + s.errorShowed;
// 			dispatch(setErrorState({ error: renderedError, state: errorState.active }));
// 		}
// 	}
//
// 	const entries = Object.entries(errors);
//
// 	for (const [error, state] of entries) {
//
// 		// if (state === errorState.push){
// 		//
// 		// }
// 	}
//
//
// }, [errorBuffer]);
