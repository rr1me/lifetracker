import s from './Datepicker.module.scss';
import icons from '../Icons/Icons';
import React, { useRef, useState } from 'react';
import Modal from '../Modal/Modal';
import { actions, IScheduleSlice } from '../../redux/slices/scheduleSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store';

const { setDate } = actions;

const Datepicker = () => {
	const { date } = useSelector((state: { scheduleSlice: IScheduleSlice }) => state.scheduleSlice);
	const dispatch = useAppDispatch();
	const [currentDate, setCurrentDate] = useState({ year: date.year, month: date.month });

	const chosenWeekRef = useRef<HTMLDivElement>(null);

	const openButtonRef = useRef(null);
	const [open, setOpen] = useState(true);

	const onOpenButton = (e: React.MouseEvent) => {
		e.stopPropagation();
		setOpen(v => !v);
	};

	const monthList: number[] = [];
	const dayCount = getDaysInMonth(currentDate.month, currentDate.year);
	const prevDayCount = getDaysInMonth(currentDate.month - 1, currentDate.year);
	const startingDayNumberUnfixed = new Date(currentDate.year, currentDate.month).getDay() - 1;
	const startingDayNumber = startingDayNumberUnfixed !== -1 ? startingDayNumberUnfixed : 6;

	for (let i = 0; i < 42; i++) {
		if (i < startingDayNumber) {
			monthList.push(prevDayCount - startingDayNumber + 1 + i);
			continue;
		}
		if (i - startingDayNumber + 1 > dayCount) {
			monthList.push(i - startingDayNumber + 1 - dayCount);
			continue;
		}

		monthList.push(i - startingDayNumber + 1);
	}

	const handledMonthList = () => {
		const monthMatrix = [];
		for (let i = 0; i < 6; i++) {
			const startIdx = i * 7;
			const endIdx = startIdx + 7;
			monthMatrix.push(monthList.slice(startIdx, endIdx));
		}
		return monthMatrix;
	};

	const onClickDaysRow = (index: number) => () => {
		if (startingDayNumber + dayCount < 36 && index === 5) return;

		dispatch(setDate({ year: currentDate.year, month: currentDate.month, week: index }));

		if (chosenWeekRef.current!.style.opacity === '0') {
			chosenWeekRef.current!.style.transform = `translateY(${index * 100}%)`;
			chosenWeekRef.current!.style.transition = '150ms';
			chosenWeekRef.current!.style.opacity = '1';
		}
	};
	const onOverDaysRow = (index: number) => () => {
		if (chosenWeekRef.current!.style.opacity === '0' || (startingDayNumber + dayCount < 36 && index === 5)) return;
		chosenWeekRef.current!.style.transform = `translateY(${index * 100}%)`;
	};
	const onOutDaysRow = () => {
		if (chosenWeekRef.current!.style.opacity === '0') return;
		const currentWeek = Number(chosenWeekRef.current!.style.transform.match(/\d+/g)) / 100;

		if (currentWeek !== date.week) chosenWeekRef.current!.style.transform = `translateY(${date.week * 100}%)`;
	};

	const onArrowClick = (direction: boolean) => () => {
		setCurrentDate(v => {
			let d;
			if ((v.month === 0 && !direction) || (v.month === 11 && direction)) {
				d = direction ? { year: v.year + 1, month: 0 } : { year: v.year - 1, month: 11 };
			} else {
				d = direction ? { ...v, month: v.month + 1 } : { ...v, month: v.month - 1 };
			}

			if (d.year !== date.year || d.month !== date.month) {
				chosenWeekRef.current!.style.transition = 'none';
				chosenWeekRef.current!.style.opacity = '0';
			} else if (chosenWeekRef.current!.style.opacity === '0') {
				chosenWeekRef.current!.style.transition = '150ms';
				chosenWeekRef.current!.style.opacity = '1';
			}

			return d;
		});
	};

	return (
		<div>
			<div className={s.openButton} onClick={onOpenButton} ref={openButtonRef}>
				{icons.calendar}
			</div>
			<Modal setState={setOpen} state={open} elemRef={openButtonRef} strictWidth={false}>
				<div onClick={e => e.stopPropagation()} className={s.outer}>
					<div className={s.dateRow}>
						<div className={s.currentDate}>
							{monthNames[currentDate.month]} {currentDate.year}
						</div>
						<div className={s.arrows}>
							<span onClick={onArrowClick(false)} className={s.actualArrow}>
								{icons.arrowLeft}
							</span>
							<span onClick={onArrowClick(true)} className={s.actualArrow}>
								{icons.arrowRight}
							</span>
						</div>
					</div>
					<div className={s.dayNamesRow}>
						{dayNames.map(x => (
							<span key={x}>{x}</span>
						))}
					</div>
					<div className={s.daysRow}>
						{handledMonthList().map((v, i) => (
							<div
								key={i}
								className={
									s.daysRowInner +
									(i === 5 && startingDayNumber + dayCount < 36 ? '' : ' ' + s.daysRowInnerClickable)
								}
								onClick={onClickDaysRow(i)}
								onMouseOverCapture={onOverDaysRow(i)}
								onMouseOutCapture={onOutDaysRow}
							>
								<div className={s.dayNumbers}>
									{v.map((vi, ii) => (
										<span
											key={ii}
											className={
												(i === 0 && vi > 20) || (i > 3 && vi < 15) ? s.darkDay : undefined
											}
										>
											{vi}
										</span>
									))}
								</div>
							</div>
						))}
						<div
							className={s.chosenWeek}
							ref={chosenWeekRef}
							style={{ transform: `translateY(${date.week * 100}%)` }}
						/>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default Datepicker;

const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const isLeapYear = (year: number) => !(year % 4) && (!!(year % 100) || !!(year % 400));

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const getDaysInMonth = (month: number, year: number) => {
	if (month < 0) {
		const actualMonth = 12 + month;
		return actualMonth === 1 && isLeapYear(year - 1) ? 29 : daysInMonth[actualMonth];
	}
	return month === 1 && isLeapYear(year) ? 29 : daysInMonth[month];
};

const monthNames = [
	'January', //1
	'February', //2
	'March', //3
	'April', //4
	'May', //5
	'June', //6
	'July', //7
	'August', //8
	'September', //9
	'October', //10
	'November', //11
	'December', //12
];
