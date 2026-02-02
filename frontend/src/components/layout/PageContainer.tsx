'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export default function PageContainer({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    // Home page needs no padding (controls its own layout with hero)
    // Other pages need padding to account for fixed header (h-20 = 80px)
    // We add pt-24 (96px) for a bit of breathing room
    return (
        <main className={`flex-grow ${!isHome ? 'pt-24' : ''}`}>
            {children}
        </main>
    );
}
