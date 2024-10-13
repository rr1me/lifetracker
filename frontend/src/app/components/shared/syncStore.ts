import { useCallback, useSyncExternalStore } from 'react';

// type SetState<T> = (fn: (x: T) => T) => void;
type SetState<T> = (fn: (x: T) => T | void) => void;

type Store<T> = {
	getState: () => T;
	setState: SetState<T>;
	setStateSilently: SetState<T>;
	subscribe: (l: Listener) => () => void;
}

type Listener = () => void

const createStore = <T = object>(initialState: T): Store<T> => {
	let state = initialState;
	const getState = () => state;
	const listeners = new Set<Listener>();


	const setState: SetState<T> = fn => {
		const changedState = fn(state);
		if (changedState !== undefined) state = changedState;
		listeners.forEach((l: Listener) => l());
	};
	const setStateSilently: SetState<T> = fn => {
		const changedState = fn(state);
		if (changedState !== undefined) state = changedState;
	};


	const subscribe = (listener: Listener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};
	return { getState, setState, setStateSilently, subscribe };
};

export default createStore;

type AnimationStore = {
	redCodeQueue: number[],
	preloaderVisibility: boolean,
	navMenuOpen: boolean,
	pageAnimation: boolean,
	showedPages: string[]
}

export const animationStore = createStore<AnimationStore>({
	redCodeQueue: [],
	preloaderVisibility: true,
	navMenuOpen: false,
	pageAnimation: false,
	showedPages: []
});

animationStore.setState(s => {
	s.redCodeQueue
});

export const useAnimationStore = <Callback extends (s: AnimationStore) => ReturnType<Callback>>(selector: Callback): ReturnType<Callback> =>
	useSyncExternalStore<ReturnType<Callback>>(
		animationStore.subscribe,
		useCallback(() => selector(animationStore.getState()), [animationStore, selector]),
		() => selector(animationStore.getState())
	);
