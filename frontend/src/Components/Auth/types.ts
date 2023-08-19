import { JSX, RefObject } from 'react';

export type ZoneComponent = ({ isInitial, authAnimState }: { isInitial?: RefObject<boolean>; authAnimState: UiStates }) => JSX.Element;

export type UiStates = 0 | 1 | 2;

export type HelpMenuPage = 'options' | 'actions';
