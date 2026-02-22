'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        // Run securely only in browser context
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                // Not authenticated -> kick to login, saving intended destination
                console.warn(`[Auth Guard] Unauthorized access attempt to ${pathname}. Redirecting to /login.`);
                setIsAuthorized(false);
                router.replace('/login');
            } else {
                // Authenticated
                setIsAuthorized(true);
            }
        }
    }, [router, pathname]);

    // Prevent FOUC (Flash of Unauthenticated Content) while checking
    if (isAuthorized === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center space-y-4">
                    <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm font-semibold text-slate-500 tracking-wide">권한을 확인하는 중입니다...</p>
                </div>
            </div>
        );
    }

    // Still guard rendering if malicious override occurs mid-render loop
    if (!isAuthorized) {
        return null;
    }

    return (
        // Add a subtle admin indicator boundary if desired, else just pass children
        <div className="min-h-screen bg-slate-50">
            {children}
        </div>
    );
}
