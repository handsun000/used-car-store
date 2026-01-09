'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPosts } from '@/lib/api/posts';
import { PostResponse } from '@/types';

export default function CommunityPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWriteClick = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            router.push('/login');
            return;
        }
        router.push('/community/write');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
                    <p className="text-gray-600">자동차에 대한 이야기를 자유롭게 나누어보세요.</p>
                </div>
                <button
                    onClick={handleWriteClick}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    글쓰기
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-gray-500 font-medium text-sm w-20 text-center">번호</th>
                                <th className="px-6 py-4 text-gray-500 font-medium text-sm">제목</th>
                                <th className="px-6 py-4 text-gray-500 font-medium text-sm w-32 text-center">작성자</th>
                                <th className="px-6 py-4 text-gray-500 font-medium text-sm w-32 text-center">작성일</th>
                                <th className="px-6 py-4 text-gray-500 font-medium text-sm w-24 text-center">조회수</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        게시글이 없습니다. 첫 번째 글을 작성해보세요!
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-center text-gray-500 text-sm">{post.id}</td>
                                        <td className="px-6 py-4">
                                            <Link href={`/community/${post.id}`} className="text-gray-900 font-medium hover:text-blue-600 block">
                                                {post.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-500 text-sm">{post.authorName}</td>
                                        <td className="px-6 py-4 text-center text-gray-400 text-sm">{formatDate(post.createdAt)}</td>
                                        <td className="px-6 py-4 text-center text-gray-400 text-sm">{post.views}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
