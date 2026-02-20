"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                setIsLoggedIn(true);
                try {
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
                }
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        };

        checkAuth();
        window.addEventListener('auth-change', checkAuth);

        return () => window.removeEventListener('auth-change', checkAuth);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        setIsAdmin(false);
        window.dispatchEvent(new Event('auth-change'));
        router.push('/');
        router.refresh();
    };

    const isMainPage = pathname === '/';
    const showWhiteBackground = !isMainPage || isScrolled || isMobileMenuOpen;

    const headerClass = showWhiteBackground
        ? "fixed top-0 w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm text-gray-900 border-b border-gray-200"
        : "fixed top-0 w-full z-50 transition-all duration-300 bg-transparent text-white border-b border-white/10";

    const logoClass = showWhiteBackground ? "text-blue-900" : "text-white";
    const logoAccentClass = showWhiteBackground ? "text-blue-500" : "text-white/80";
    const navLinkClass = showWhiteBackground ? "text-gray-600 hover:text-blue-600" : "text-white/90 hover:text-white";
    const mobileLinkClass = "block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600";
    const menuIconClass = showWhiteBackground ? "text-gray-900" : "text-white";

    return (
        <header className={headerClass}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className={`text-2xl font-bold tracking-tight ${logoClass} z-50 relative`}>
                        Gen<span className={logoAccentClass}>Car</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/buy" className={`font-medium transition-colors ${navLinkClass}`}>
                            내차사기
                        </Link>
                        <Link href="/community" className={`font-medium transition-colors ${navLinkClass}`}>
                            커뮤니티
                        </Link>
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoggedIn && isAdmin && (
                            <Link
                                href="/admin/register"
                                className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors border ${showWhiteBackground ? 'text-blue-600 border-blue-600 hover:bg-blue-50' : 'text-white border-white hover:bg-white/10'}`}
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
                                    className={`font-medium ${showWhiteBackground ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={`font-medium ${showWhiteBackground ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}>
                                    로그인
                                </Link>
                                <Link
                                    href="/signup"
                                    className={`px-4 py-2 rounded-lg font-medium transition ${showWhiteBackground ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-900 hover:bg-gray-100'}`}
                                >
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center z-50 relative">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-md focus:outline-none ${menuIconClass}`}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-white shadow-xl pt-24 px-4 flex flex-col space-y-4 animate-fadeIn">
                    <Link href="/buy" className={mobileLinkClass}>
                        내차사기
                    </Link>
                    <Link href="/community" className={mobileLinkClass}>
                        커뮤니티
                    </Link>
                    <div className="border-t border-gray-100 my-2 pt-2">
                        {isLoggedIn && isAdmin && (
                            <Link href="/admin/register" className={mobileLinkClass}>
                                매물 등록
                            </Link>
                        )}
                        {isLoggedIn ? (
                            <>
                                <Link href="/mypage" className={mobileLinkClass}>
                                    마이페이지
                                </Link>
                                <button onClick={handleLogout} className={`${mobileLinkClass} w-full text-left text-red-600`}>
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={mobileLinkClass}>
                                    로그인
                                </Link>
                                <Link href="/signup" className="block w-full mt-4 text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-bold">
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
