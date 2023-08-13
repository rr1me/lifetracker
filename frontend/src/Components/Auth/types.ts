import { Dispatch, JSX, ReactNode, RefObject, SetStateAction } from 'react';

export type ZoneComponent = ({ isInitial }: { isInitial: RefObject<boolean> }) => JSX.Element;
export type InteractiveZoneComponent = ({
	uiState,
	setUiState,
	isInitial,
	setSliderIndex,
}: {
	uiState: uiStates;
	setUiState: Dispatch<SetStateAction<uiStates>>;
	isInitial: RefObject<boolean>;
	setSliderIndex?: Dispatch<SetStateAction<number>>;
}) => JSX.Element;
export type Slide = ({ setSliderIndex }: { setSliderIndex: Dispatch<SetStateAction<number>> }) => JSX.Element;

export type uiStates = 0 | 1 | 2;
