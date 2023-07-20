import s from './Week.module.scss';
import { useGetMonthQuery } from '../../../redux/api/eventApi';
import { IScheduleSlice } from '../../../redux/slices/scheduleSlice';
import { useSelector } from 'react-redux';

const Week = () => {
	const { date } = useSelector((state: { scheduleSlice: IScheduleSlice }) => state.scheduleSlice);
	const { data, error, isLoading, isFetching } = useGetMonthQuery(`${date.year}.${date.month}`);
	console.log(data, error, isLoading, isFetching);

	return (
		<div className={s.week}>
			<div className={s.timeRange}>
				<div className={s.clocks}>
					{Array(25).fill(':00').map((v, i) => <div key={i}>{(i < 10 ? '0' + i : i) + v}</div>)}
				</div>
				<div className={s.lines}>
					{Array(145).fill(0).map((v, i) => <div className={s.clockLine} key={i} />)}
				</div>
			</div>
			<div className={s.grid}>
				<div className={s.gridVertical}>
					{Array(25).fill(0).map((v, i) => <div className={s.horizontalLine} key={i} />)}
				</div>
				<div className={s.gridHorizontal}>
					{Array(8).fill(0).map((v, i) => <div className={s.verticalLine} key={i} />)}
				</div>
				<div className={s.dayEvents}>
					{Array(1).fill(0).map((v, i) =>
						<div key={i}>
							{Array(24).fill(0).map((v, i) => dayEvent(i))}
						</div>)}
				</div>
			</div>
		</div>
	);
};

export default Week;

const minHeight = 34.9;
// const distance = 5.819;
const distance = 0

const dayEvent = (x: number) => (
	<div className={s.event} key={x}
		// style={{
		// transform: `translateY(calc(+${x * 100}% + ${distance}px)) translateX(${x * 101.7}%)`,
		// transform: `translateX(calc(+${x * 100}% + ${distance}px))`,
		// height: minHeight + distance * 6 * 0,
		// }}
	>
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