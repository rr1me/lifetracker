import s from './Schedule.module.scss';
import Month from './Month/Month';
import Icons from '../Icons/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { actions, IScheduleSlice } from '../../redux/slices/scheduleSlice';
import Week from './Week/Week';

const {setMonthOrWeek} = actions

const Schedule = () => {
	const {monthOrWeek} = useSelector((state: {scheduleSlice: IScheduleSlice}) => state.scheduleSlice);
	const dispatch = useDispatch()

	const onSwitcherClick = (mow: boolean) => () => {
		if (mow === monthOrWeek)
		{
			console.log('хуй');
			return;
		}
		dispatch(setMonthOrWeek(mow))
	}

	return (
		<div className={s.schedule}>
			<div className={s.switcher}>
				<button onClick={onSwitcherClick(false)}>{Icons.month}</button>
				<div className={s.separator}/>
				<button onClick={onSwitcherClick(true)}>{Icons.week}</button>
			</div>
			<div className={s.dayNames + (monthOrWeek ? ' ' + s.weekDayNames : '')}>
				{dayNames.map((x,i) => <span key={x}>{x}</span>)}
			</div>

			{monthOrWeek ? <Week/> : <Month/>}
		</div>
	);
};

export default Schedule;

const dayNames = [
	'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];