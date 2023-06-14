import s from './Schedule.module.scss';

const Schedule = () => {
	console.log(new Date());

	return (
		<div>
			<div className={s.dayNames}>
				{dayNames.map(x=><span key={x}>{x}</span>)}
			</div>
		</div>
	)
};

export default Schedule;

const dayNames = [
	'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]