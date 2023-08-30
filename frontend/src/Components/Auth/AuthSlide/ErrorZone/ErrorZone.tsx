import s from './ErrorZone.module.scss';
import { useLayoutEffect, useRef } from 'react';
import { actions, AuthData } from '../../../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFirstRender } from '../../../Utils/utils';

const {setErrorZoneHeight} = actions;

const ErrorZone = () => {
	const dispatch = useDispatch();
	const { errorZoneHeight, errors } = useSelector((state: { authSlice: AuthData }) => state.authSlice.ui);
	const errorZoneInnerRef = useRef<HTMLDivElement>(null);

	const isFirstRender = useIsFirstRender()

	useLayoutEffect(() => {
		if (isFirstRender || !errorZoneInnerRef.current) return;

		const height = errorZoneInnerRef.current.getBoundingClientRect().height;
		dispatch(setErrorZoneHeight(height));
		const children = errorZoneInnerRef.current.children;
		children[children.length-1].className = s.error + ' ' + s.errorShowed
	}, [errors]);

	return (
		<div className={s.errorZone} style={{ height: errorZoneHeight === 0 ? 'auto' : errorZoneHeight }}>
			<div ref={errorZoneInnerRef}>
				{errors.map((v, i) => (
					<div key={v+i} className={s.error}>• {v}</div>
				))}
			</div>
		</div>
	);
};

export default ErrorZone;
