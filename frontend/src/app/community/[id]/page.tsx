'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPost } from '@/lib/api/posts';
import { PostDetailResponse } from '@/types';

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState<PostDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const id = params.id;
        if (id) {
            fetchPostDetail(Number(id));
        }
    }, [params.id]);

    const fetchPostDetail = async (id: number) => {
        try {
            const data = await getPost(id);
            setPost(data);
        } catch (error) {
            console.error('Failed to fetch post:', error);
            alert('게시글을 불러오는데 실패했습니다.');
            router.push('/community');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/community')}
                    className="mb-6 text-gray-500 hover:text-blue-600 flex items-center font-medium transition-colors"
                >
                    ← 목록으로 돌아가기
                </button>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header Section */}
                    <div className="p-8 border-b border-gray-100 bg-white">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                커뮤니티
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                                <span className="font-medium text-gray-900 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    {post.authorName}
                                </span>
                                <span className="text-gray-300">|</span>
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-1">조회</span>
                                <span className="font-medium text-gray-900">{post.views}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 min-h-[400px]">
                        <div className="prose prose-blue max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {post.content}
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-center">
                        <button
                            onClick={() => router.push('/community')}
                            className="bg-white border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition shadow-sm"
                        >
                            목록으로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
