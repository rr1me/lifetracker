import s from './Icons.module.scss';

import { BsCalendar3 } from 'react-icons/bs';
import { MdViewWeek } from 'react-icons/md';
import { HiOutlineCalendar } from 'react-icons/hi';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const month = <BsCalendar3 />;
const week = <MdViewWeek className={s.week} />;
const calendar = <HiOutlineCalendar />;
const arrowLeft = <IoIosArrowBack />;
const arrowRight = <IoIosArrowForward />;

export default { month, week, calendar, arrowLeft, arrowRight };
