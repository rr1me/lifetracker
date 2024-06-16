import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const url = new URL('/auth', request.url);
	if (!request.cookies.has('auth') && request.url !== url.toString()) {
		return NextResponse.redirect(url);
	}

	const args = Math.random() + '';

	request.cookies.set('auth', args);

	const nextResponse = NextResponse.next();

	nextResponse.cookies.set('auth', args);

	return nextResponse;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)'
	]
};
