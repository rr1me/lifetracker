import s from './Schedule.module.scss';

const Schedule = () => {

	const separator = (
		<div className={s.separator}/>
	)

	const darkDots = (
		<div className={s.darkDots}>
			<div className={s.darkDot}/>
			<div className={s.darkDot}/>
		</div>
	)

	const redTab = <div className={s.redTab}/>

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
	)

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
	)

	return (
		<div className={s.schedule}>
			<div className={s.dayNames}>
				{dayNames.map(x=><span key={x}>{x}</span>)}
			</div>
			<div className={s.dayObjects}>
				{Array(42).fill(day).map((v,i) => <div key={i} className={s.day}>{v}</div> )}
			</div>
		</div>
	)
};

export default Schedule;

const dayNames = [
	'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]