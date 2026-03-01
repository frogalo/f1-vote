"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";

export default function SeasonGuard({ isComplete }: { isComplete: boolean }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading || !user || user.isAdmin) return;
        
        // Allowed public routes (login/register/landing typically handled in middleware, but just in case)
        if (pathname === "/login" || pathname === "/register" || pathname === "/") return;
        
        if (!isComplete && pathname !== "/season") {
            router.replace("/season");
        }
    }, [isComplete, pathname, router, user, loading]);

    return null;
}
