import s from './Month.module.scss';
import DotsSeparator from '../../DotsSeparator/DotsSeparator';

const Month = () => {
	return (
		<div className={s.dayObjects}>
			{Array(42).fill(day).map((v,i) => <div key={i} className={s.day}>{v}</div> )}
		</div>
	);
};

export default Month;

const separator = (
	<div className={s.separator} />
);

const redTab = <div className={s.redTab} />;

const event = (
	<div className={s.event}>
		<div className={s.time}>
			<div className={s.timeRange}>00:00{redTab}08:30</div>
			<div className={s.timeTaken}>8h 30m</div>
		</div>
		<DotsSeparator/>
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
