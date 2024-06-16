import type { Metadata } from 'next';
import StoreProvider from '@/app/redux/StoreProvider';
import React from 'react';

import { roboto } from '@/app/theme';
import './layout.scss';
import './reset.css';
import { cookies } from 'next/headers';

// export const dynamic = 'force-dynamic'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'

export const metadata: Metadata = {
	title: 'LifeTracker',
	description: 'Wanna be efficient?',
};

const cookieStore = cookies()

export default function RootLayout({
	children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={roboto}>
				<StoreProvider name={cookieStore.get('auth')?.value}>
					{children}
				</StoreProvider>
			</body>
		</html>
	);
}
