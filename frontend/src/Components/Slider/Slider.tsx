import s from './Slider.module.scss';
import {
	Children,
	ReactNode,
	useEffect,
	useLayoutEffect,
	useRef, useState,
} from 'react';

let width = 0;

const Slider = ({ children, index }: { children: ReactNode; index: number }) => {
	const sliderRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const [parentWidth, setParentWidth] = useState(10);

	// let slideWidth = 0;
	useLayoutEffect(() => {
		if (!sliderRef.current || !listRef.current) return;

		const parentWidth = sliderRef.current.parentElement!.getBoundingClientRect().width

		width = parentWidth
		setParentWidth(parentWidth);

		// slideWidth = parentWidth;
		// sliderRef.current.style.width = parentWidth + 'px';
		// listRef.current.style.width = Children.count(children) * parentWidth + 'px';
		//
		// const slides = listRef.current.children
		// for (const slide of slides){
		// 	slide.setAttribute('style', `width: ${parentWidth}px`)
		// }
	}, []);

	useEffect(() => {
		if (!sliderRef.current || !listRef.current) return;



		listRef.current.style.transform = `translateX(-${index * sliderRef.current.parentElement!.getBoundingClientRect().width}px)`
	}, [index])

	return (
		<div className={s.slider} ref={sliderRef}
			 style={{width: width}}
		>
			<div className={s.list} ref={listRef}
				 // style={{width: parentWidth * Children.count(children), transform: `translateX(-${index * parentWidth}px)`}}
			>
				{Children.map(children, x => {
					return <div className={s.slide}
								style={{width: width}}
					>{x}</div>;
				})}
			</div>
		</div>
	);
};

export default Slider;
