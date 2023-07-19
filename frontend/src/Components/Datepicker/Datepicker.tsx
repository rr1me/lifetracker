import s from './Datepicker.module.scss';
import icons from '../Icons/Icons';
import React, { useState, useRef } from 'react';
import Modal from '../Modal/Modal';

const Datepicker = () => {
	const currentMonth = 6;
	const currentYear = 2023;

	const openButtonRef = useRef(null);
	const [open, setOpen] = useState(true);

	const onOpenButton = (e: React.MouseEvent) => {
		e.stopPropagation();
		setOpen(v => !v);
	};

	const monthList = [
		26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
		26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6,
	];

	const handledMonthList = () => {
		const monthMatrix = [];
		for (let i = 0; i < 6; i++) {
			const startIdx = i * 7;
			const endIdx = startIdx + 7;
			monthMatrix.push(monthList.slice(startIdx, endIdx));
		}
		return monthMatrix;
	};

	return (
		<div>
			<div className={s.openButton} onClick={onOpenButton} ref={openButtonRef}>
				{icons.calendar}
			</div>
			<Modal setState={setOpen} state={open} elemRef={openButtonRef} strictWidth={false}>
				<div onClick={e => e.stopPropagation()} className={s.outer}>
					<div className={s.dateRow}>
						<div className={s.currentDate}>August 2023</div>
						<div className={s.arrows}>
							{icons.arrowLeft} {icons.arrowRight}
						</div>
					</div>
					<div className={s.dayNamesRow}>
						{dayNames.map(x => (
							<span key={x}>{x}</span>
						))}
					</div>
					{/*<div className={s.daysRow}>*/}
					{/*	{Array(6)*/}
					{/*		.fill(0)*/}
					{/*		.map((v, i) => (*/}
					{/*			<div key={i} className={s.daysRowInner}>*/}
					{/*				<div className={s.dayNumbers}>*/}
					{/*					{Array(7)*/}
					{/*						.fill(0)*/}
					{/*						.map((v, i) => (*/}
					{/*							<span key={i}>{i + 6}</span>*/}
					{/*						))}*/}
					{/*				</div>*/}
					{/*			</div>*/}
					{/*		))}*/}
					{/*</div>*/}
					<div className={s.daysRow}>
						{handledMonthList().map((v, i) => (
							<div key={i} className={s.daysRowInner} onClick={() => console.log(i)}>
								<div className={s.dayNumbers}>
									{v.map((vi, ii) => (
										<span
											key={ii}
											className={
												(i === 0 && vi > 20) || (i === 5 && vi < 15) ? s.darkDay : undefined
											}
										>
											{vi}
										</span>
									))}
								</div>
							</div>
						))}
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

const getDaysInMonth = (month: number, year: number) => (month === 1 && isLeapYear(year) ? 29 : daysInMonth[month]);
