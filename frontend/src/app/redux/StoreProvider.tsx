'use client';

import { Provider } from 'react-redux';
import React, { useRef } from 'react';
import { AppStore, makeStore } from '@/app/redux/store';

const StoreProvider = ({ children, name }: { children: React.ReactNode, name?: string }) => {
	const storeRef = useRef<AppStore>();
	let cookie;

	try{
		cookie = document.cookie;
	}
	catch {
		cookie = name;
	}

	if (!storeRef.current) storeRef.current = makeStore(cookie);
	return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
