import s from './Week.module.scss';

const Week = () => {
	return (
		<div className={s.week}>
			<div className={s.timeRange}>
				<div className={s.clocks}>
					{Array(25).fill(':00').map((v, i) => <div key={i}>{(i < 10 ? '0' + i : i) + v}</div>)}
				</div>
				<div className={s.lines}>
					{Array(145).fill(<div className={s.clockLine} />)}
				</div>
			</div>
			<div className={s.grid}>
				<div className={s.gridVertical}>
					{Array(25).fill(<div className={s.horizontalLine} />)}
				</div>
				<div className={s.gridHorizontal}>
					{Array(8).fill(<div className={s.verticalLine} />)}
				</div>
				<div className={s.dayEvents}>
					{Array(1).fill(0).map((v, i) => dayEvent(0))}
				</div>
			</div>
		</div>
	);
};

export default Week;

const minHeight = 34.9;
const distance = 5.819;

const dayEvent = (x: number) => (
	<div className={s.event} style={{
		transform: `translateY(calc(+${x * 100}% + ${distance}px))`,
		height: minHeight + distance * 6 * 0,
	}}>
		aklsdfjasdf
		{outliner(Boolean(x % 2))}
	</div>
);

const outliner = (inverse: boolean) => (
	<div className={s.outliner + (inverse ? ' ' + s.inversedOutliner : '')}>
		<div className={s.topLine} />
		<div className={s.baseLine} />
		<div className={s.bottomLine} />
	</div>
);