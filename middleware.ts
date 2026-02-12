import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

/** Routes that should always be accessible regardless of auth state (e.g. OAuth callback). */
const publicRoutes = ["/auth/callback"];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const isAuthenticated = request.cookies.has("logged_in");

	// Always allow public routes (OAuth callback, etc.)
	if (publicRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.next();
	}

	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (isProtectedRoute && !isAuthenticated) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	const isAuthRoute =
		pathname === "/" ||
		authRoutes.some((route) => pathname.startsWith(route));

	if (isAuthRoute && isAuthenticated) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/",
		"/dashboard/:path*",
		"/login",
		"/register",
		"/forgot-password",
		"/reset-password",
		"/auth/callback",
	],
};
