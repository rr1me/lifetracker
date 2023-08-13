import s from './Slider.module.scss';
import { Children, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

const Slider = ({ children, index }: { children: ReactNode; index: number }) => {
	const sliderRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const [styles, setStyles] = useState({ main: {}, list: {} });

	useLayoutEffect(() => {
		if (!sliderRef.current || !listRef.current) return;

		const parentWidth = sliderRef.current.parentElement!.getBoundingClientRect().width;

		setStyles({
			main: { width: parentWidth },
			list: { width: parentWidth * Children.count(children), transform: `translateX(-${index * parentWidth}px)` },
		});
	}, []);

	useEffect(() => {
		if (!sliderRef.current || !listRef.current) return;

		listRef.current.style.transform = `translateX(-${index * sliderRef.current.parentElement!.getBoundingClientRect().width}px)`;
	}, [index]);

	return (
		<div className={s.slider} ref={sliderRef} style={styles.main}>
			<div className={s.list} ref={listRef} style={styles.list}>
				{Children.map(children, x => {
					return (
						<div className={s.slide} style={styles.main}>
							{x}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Slider;
