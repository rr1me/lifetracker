import { JSX, RefObject } from 'react';

export type ZoneComponent = ({ isInitial }: { isInitial: RefObject<boolean> }) => JSX.Element;

export type uiStates = 0 | 1 | 2;
