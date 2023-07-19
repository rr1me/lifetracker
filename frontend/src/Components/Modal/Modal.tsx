import s from './Modal.module.scss';
import React, { FC, ReactNode, RefObject, useLayoutEffect, useRef, useState } from 'react';

const Modal: FC<{
	elemRef: RefObject<HTMLElement>;
	state: boolean;
	setState: (e: any) => void;
	children: ReactNode;
	strictWidth: boolean;
}> = ({ elemRef, state, setState, children, strictWidth = true }) => {
	const id = makeId(5);
	const modalRef = useRef<HTMLDivElement>(null);

	const [width, setWidth] = useState(15);

	useLayoutEffect(() => {
		if (!elemRef.current) return;
		const width = elemRef.current.getBoundingClientRect().width;
		setWidth(width);
		if (!state) return;

		const closeDP = (e: any) => {
			if (e.composedPath()[0].id !== id) {
				setState(false);
			}
		};
		document.body.addEventListener('click', closeDP);

		if (!modalRef.current) return;
		const modalRect = modalRef.current.getBoundingClientRect();
		// modalRef.current.style.left = width / 2 + modalRect.x - modalRect.width / 2 + 'px'; //todo use that in prod instead of below one
		// modalRef.current.style.left = '1563.99px';

		return () => {
			return document.body.removeEventListener('click', closeDP);
		};
	}, [state]);

	if (!state) return null;
	return (
		<div className={s.modal} id={id} style={strictWidth ? { width: width } : undefined} ref={modalRef}>
			{children}
		</div>
	);
};

export default Modal;

const makeId = (length: number) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};
