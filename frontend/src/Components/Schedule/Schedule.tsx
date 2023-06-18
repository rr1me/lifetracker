import s from './Schedule.module.scss';

const Schedule = () => {

	const separator = (
		<div className={s.separator} />
	);

	const darkDots = (
		<div className={s.darkDots}>
			<div className={s.darkDot} />
			<div className={s.darkDot} />
		</div>
	);

	const redTab = <div className={s.redTab} />;

	const event = (
		<div className={s.event}>
			<div className={s.time}>
				<div className={s.timeRange}>00:00{redTab}08:30</div>
				<div className={s.timeTaken}>8h 30m</div>
			</div>
			{darkDots}
			<div className={s.description}>
				vava vivaasdasd
			</div>
		</div>
	);

	const day = (
		<div className={s.dayInner}>
			<div className={s.date}>
				13
			</div>
			<div className={s.events}>
				{event}
				{separator}
				{event}
				{separator}
				{event}
				{separator}
				{event}
				{separator}
				{event}
			</div>
		</div>
	);


	const clockLine = (
		<div className={s.clockLine} />
	);

	const horizontalLine = (
		<div className={s.horizontalLine} />
	);

	const verticalLine = (
		<div className={s.verticalLine} />
	);

	const outliner = (inverse: boolean) => (
		<div className={s.outliner + (inverse ? ' ' + s.inversedOutliner : '')}>
			<div className={s.topLine}/>
			<div className={s.baseLine}/>
			<div className={s.bottomLine}/>
		</div>
	)

	const minHeight = 34.9
	const distance = 5.819
	// const distance = 5.8

	const dayEvent = (x: number) => (
		<div className={s.event} style={{transform: `translateY(calc(+${x * 100}% + ${distance}px))`, height: minHeight + distance * 6 * 0}}>
			aklsdfjasdf
			{outliner(Boolean(x % 2))}
		</div>
	)

	return (
		<div className={s.schedule}>
			<div className={s.dayNames}>
				{dayNames.map(x => <span key={x}>{x}</span>)}
			</div>
			{/* <div className={s.dayObjects}>*/}
			{/*	{Array(42).fill(day).map((v,i) => <div key={i} className={s.day}>{v}</div> )}*/}
			{/* </div>*/}

			<div className={s.week}>
				<div className={s.timeRange}>
					<div className={s.clocks}>
						{Array(25).fill(':00').map((v, i) => <div key={i}>{(i < 10 ? '0' + i : i) + v}</div>)}
					</div>
					<div className={s.lines}>
						{Array(145).fill(clockLine)}
					</div>
				</div>
				<div className={s.grid}>
					<div className={s.gridVertical}>
						{Array(25).fill(horizontalLine)}
					</div>
					<div className={s.gridHorizontal}>
						{Array(8).fill(verticalLine)}
					 </div>

					{/*<div className={s.event}>*/}
					{/*	aklsdfjasdf*/}
					{/*	{outliner(true)}*/}
					{/*</div>*/}
					<div className={s.dayEvents}>
						{Array(1).fill(0).map((v,i) => dayEvent(0) )}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Schedule;

const dayNames = [
	'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];