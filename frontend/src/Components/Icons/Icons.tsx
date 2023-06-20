import s from './Icons.module.scss';

import { BsCalendar3 } from 'react-icons/bs';
import { MdViewWeek } from 'react-icons/md';

const month = <BsCalendar3 />;
const week = <MdViewWeek className={s.week}/>;

export default { month, week };