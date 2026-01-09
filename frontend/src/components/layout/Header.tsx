"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check for token on mount
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
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
        setIsAdmin(false);
        router.push('/');
        router.refresh(); // Refresh to update any server components if needed
    };

    return (
        <header className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-blue-900 tracking-tight">
                    MyCar<span className="text-blue-500">Market</span>
                </Link>
                <nav className="hidden md:flex space-x-8">
                    {/* Public Menu - ONLY Community and standard Logo link */}
                    <Link href="/community" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                        커뮤니티
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    {/* Admin Only Menu */}
                    {isLoggedIn && isAdmin && (
                        <Link
                            href="/admin/register"
                            className="text-blue-600 border border-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 font-medium text-sm transition-colors"
                        >
                            매물 등록
                        </Link>
                    )}

                    {isLoggedIn ? (
                        <>
                            <Link href="/mypage" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                마이페이지
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-gray-900 font-medium"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-500 hover:text-gray-900 font-medium">
                                로그인
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
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
