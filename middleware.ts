import { NextRequest, NextResponse } from "next/server";

// Routes that require NO authentication
const PUBLIC_ROUTES = ["/login", "/register", "/privacy-policy"];

// Routes that are ONLY for admins
const ADMIN_ROUTES = ["/admin"];

// Routes that are ONLY for regular users (not admins)
const USER_ONLY_ROUTES = ["/calendar", "/season", "/race", "/profile", "/leaderboard"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Skip Next.js internals and static files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".") // static files (images, fonts, etc.)
    ) {
        return NextResponse.next();
    }

    const userId = req.cookies.get("userId")?.value;
    const isAdmin = req.cookies.get("isAdmin")?.value === "true";

    const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
    const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
    const isUserOnlyRoute = USER_ONLY_ROUTES.some((r) => pathname.startsWith(r));

    // ── Not logged in ─────────────────────────────────────────────
    if (!userId) {
        // Allow public routes through
        if (isPublicRoute || pathname === "/") return NextResponse.next();
        // Redirect everything else to login
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ── Logged in: admin tries to visit a user-only or landing page ─
    if (isAdmin) {
        if (isUserOnlyRoute || pathname === "/") {
            return NextResponse.redirect(new URL("/admin", req.url));
        }
    }

    // ── Logged in: regular user tries to visit /admin ─────────────
    if (!isAdmin && isAdminRoute) {
        return NextResponse.redirect(new URL("/calendar", req.url));
    }

    // ── Logged in: regular user visits landing page / ─────────────
    if (!isAdmin && pathname === "/") {
        return NextResponse.redirect(new URL("/calendar", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - _next/static (static files)
         * - _next/image (image optimisation)
         * - favicon.ico
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
