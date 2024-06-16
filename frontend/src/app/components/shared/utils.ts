import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const assembleClassNames = (classNames: string[]) => {
	const obj = classNames.reduce((obj, key) => {
		(obj[key as never] as boolean) = true;
		return obj;
	}, {});

	return clsx(obj);
};

export const createClassName = (...classNames: string[]) => assembleClassNames(classNames);

export const addToClassName = (definedClassName: string, ...classNames: string[]) =>
	definedClassName + ' ' + assembleClassNames(classNames);

export type PickByType<T, Value> = {
	[P in keyof T as T[P] extends Value | undefined ? P : never]: T[P]
}

// export const useIsFirstRender = () => {
// 	const ref = useRef(true);
// 	const isFirstRender = ref.current;
// 	ref.current = false;
// 	return isFirstRender;
// };
//
// export const useHydrated = () => {
// 	const [hydrated, setHydrated] = useState(false);
// 	useEffect(() => {
// 		setHydrated(true);
// 	}, []);
// 	return hydrated;
// };
//
// export const useLayoutHydrated = () => {
// 	const hydrated = useRef(true);
// 	useLayoutEffect(() => {
// 		hydrated.current = false
// 	}, []);
// 	return hydrated.current;
// };
