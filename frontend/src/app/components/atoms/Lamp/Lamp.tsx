'use client';

import s from './Lamp.module.scss';
import { CSSProperties, useEffect, useRef } from 'react';
import { createClassName } from '@/app/components/shared/utils';

type Lamp = { sx?: CSSProperties, color?: string,
	delay?: number, duration?: number, start?: boolean };

const Lamp = ({ sx, color = '#ffffff', delay = 0, duration, animated,
	falloff, ascent = 10, start }:
	Lamp & {animated?: boolean, falloff?: number, ascent?: number}) => {
	const style: CSSProperties = {
		background: falloff ?
			`linear-gradient(transparent 0% ${ascent}%, ${color} ${falloff}% ${100 - falloff}%, transparent ${100 - ascent}%)`
			:
			`radial-gradient(50% 50%, ${color}, transparent)`,
		...sx,
	};

	return animated ?
		<Animated style={style} delay={delay} duration={duration} start={start}/>
		:
		<div style={style} className={s.lamp}/>;
};

export default Lamp;

const Animated = ({ style, delay = 0, duration, start }:
	Pick<Lamp, 'delay' | 'duration' | 'start'> & {style: CSSProperties}) => {
	const elemRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ref = elemRef.current;
		if (!ref) return;
		ref.style.animationDelay = delay + 'ms';
		ref.style.animationDuration = duration + 'ms';
	}, []);

	useEffect(() => {
		const ref = elemRef.current;
		if (!start || !ref) return;
		ref.style.animationPlayState = 'running';
		ref.style.animationFillMode = 'forwards';
	}, [start]);

	return (
		<div ref={elemRef} style={{
			...style
		}} className={createClassName(s.lamp, s.animated)}/>
	);
};
