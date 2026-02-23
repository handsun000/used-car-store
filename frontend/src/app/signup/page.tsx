'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup, sendVerificationEmail, verifyEmailCode } from '@/lib/api/auth';

export default function SignupPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const handleSendVerificationCode = async () => {
        if (!email) {
            setError('이메일을 입력해주세요.');
            return;
        }
        setError('');
        setSuccessMessage('');
        setIsSendingCode(true);

        try {
            await sendVerificationEmail({ email });
            setIsCodeSent(true);
            setSuccessMessage('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
        } catch (err: any) {
            console.error('Send verification email error:', err);
            setError(err.response?.data?.message || '인증번호 발송에 실패했습니다. 이미 가입된 이메일일 수 있습니다.');
        } finally {
            setIsSendingCode(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code) {
            setError('인증번호를 입력해주세요.');
            return;
        }
        setError('');

        try {
            const isValid = await verifyEmailCode({ email, code });
            if (isValid) {
                setIsEmailVerified(true);
                setSuccessMessage('이메일 인증이 완료되었습니다.');
            } else {
                setError('인증번호가 일치하지 않습니다.');
            }
        } catch (err: any) {
            console.error('Verify email code error:', err);
            setError('인증번호 확인 중 오류가 발생했습니다.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!isEmailVerified) {
            setError('이메일 인증을 먼저 완료해주세요.');
            setIsLoading(false);
            return;
        }

        try {
            await signup({ username, password, email, name, code });
            setSuccessMessage('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg mt-16">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        회원가입
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        GenCar 서비스 이용을 위해 회원가입해주세요.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                아이디
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="relative block w-full rounded-md border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="아이디 입력"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                비밀번호
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full rounded-md border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                이름
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="relative block w-full rounded-md border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="홍길동"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                이메일
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    disabled={isEmailVerified}
                                    className="relative block w-full rounded-md border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500"
                                    placeholder="이메일 주소"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handleSendVerificationCode}
                                    disabled={isSendingCode || isEmailVerified || !email}
                                    className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors
                                        ${isEmailVerified
                                            ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                            : isSendingCode
                                                ? 'bg-gray-100 text-gray-500 cursor-wait'
                                                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                        }`}
                                >
                                    {isEmailVerified ? '인증완료' : isSendingCode ? '전송 중...' : '인증번호 발송'}
                                </button>
                            </div>
                        </div>

                        {isCodeSent && !isEmailVerified && (
                            <div className="animate-fadeIn">
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                                    인증번호 입력
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        className="relative block w-full rounded-md border-0 py-2.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        placeholder="6자리 숫자"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyCode}
                                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-500 whitespace-nowrap"
                                    >
                                        확인
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="text-center text-sm font-medium text-red-600 p-2 bg-red-50 rounded">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="text-center text-sm font-medium text-green-600 p-2 bg-green-50 rounded">
                            {successMessage}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading || !isEmailVerified}
                            className={`group relative flex w-full justify-center rounded-md px-3 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                ${!isEmailVerified
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : isLoading
                                        ? 'bg-blue-400 cursor-wait'
                                        : 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600'
                                }`}
                        >
                            {isLoading ? '가입 중...' : '회원가입 완료'}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <a href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                            이미 계정이 있으신가요? 로그인
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
