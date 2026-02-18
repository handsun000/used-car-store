"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                setIsLoggedIn(true);
                try {
                    // Determine if user is admin by decoding JWT payload
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const payload = JSON.parse(jsonPayload);
                    const authorities = payload.auth || '';

                    if (authorities.includes('ROLE_ADMIN')) {
                        setIsAdmin(true);
                    }
                } catch (e) {
                    console.error('Failed to parse token', e);
                    // If token is invalid, we might want to logout, but for now just ignore role
                }
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        };

        // Check for token on mount
        checkAuth();

        // Listen for custom auth-change event
        window.addEventListener('auth-change', checkAuth);

        return () => window.removeEventListener('auth-change', checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        setIsAdmin(false);
        window.dispatchEvent(new Event('auth-change'));
        router.push('/');
        router.refresh(); // Refresh to update any server components if needed
    };

    // Style classes based on scroll state
    const headerClass = isScrolled
        ? "fixed top-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur shadow-md text-gray-900 border-b border-gray-200"
        : "fixed top-0 w-full z-50 transition-all duration-300 bg-transparent text-white border-b border-white/10";

    const logoClass = isScrolled
        ? "text-blue-900"
        : "text-white";

    const logoAccentClass = isScrolled
        ? "text-blue-500"
        : "text-white/80";

    const navLinkClass = isScrolled
        ? "text-gray-600 hover:text-blue-600"
        : "text-white/90 hover:text-white";

    return (
        <header className={headerClass}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link href="/" className={`text-2xl font-bold tracking-tight ${logoClass}`}>
                    MyCar<span className={logoAccentClass}>Market</span>
                </Link>
                <nav className="hidden md:flex space-x-8">
                    {/* Public Menu - ONLY Community and standard Logo link */}
                    <Link href="/community" className={`font-medium transition-colors ${navLinkClass}`}>
                        커뮤니티
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    {/* Admin Only Menu */}
                    {isLoggedIn && isAdmin && (
                        <Link
                            href="/admin/register"
                            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors border ${isScrolled ? 'text-blue-600 border-blue-600 hover:bg-blue-50' : 'text-white border-white hover:bg-white/10'}`}
                        >
                            매물 등록
                        </Link>
                    )}

                    {isLoggedIn ? (
                        <>
                            <Link href="/mypage" className={`font-medium transition-colors ${navLinkClass}`}>
                                마이페이지
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`font-medium ${isScrolled ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className={`font-medium ${isScrolled ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}>
                                로그인
                            </Link>
                            <Link
                                href="/signup"
                                className={`px-4 py-2 rounded-lg font-medium transition ${isScrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-900 hover:bg-gray-100'}`}
                            >
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
