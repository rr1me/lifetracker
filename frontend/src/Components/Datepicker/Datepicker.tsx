import s from './Datepicker.module.scss';
import icons from '../Icons/Icons';
import React, { useState, useRef } from 'react';
import Modal from '../Modal/Modal';

const Datepicker = () => {
	const openButtonRef = useRef(null);
	const [open, setOpen] = useState(true);

	const onOpenButton = (e: React.MouseEvent) => {
		e.stopPropagation();
		setOpen(v => !v);
	};

	console.log(open);
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
						{dayNames.map(x=><span key={x}>{x}</span>)}
					</div>
					<div className={s.daysRow}>{Array(6).fill(0).map((v,i) =>
						<div key={i} className={s.daysRowInner}>
							<div className={s.dayNumbers}>{Array(7).fill(0).map((v,i) => <span key={i}>{v}</span>)}</div>
						</div>)}
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default Datepicker;

const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
