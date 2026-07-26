"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SeasonRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/profile");
    }, [router]);

    return (
        <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#E60000]"></div>
        </div>
    );
}
