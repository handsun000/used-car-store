import api from '../axios';
import { PostDetailResponse, PostRequest, PostResponse } from '@/types';

export const getPosts = async (): Promise<PostResponse[]> => {
    const response = await api.get<PostResponse[]>('/posts');
    return response.data;
};

export const getPost = async (id: number): Promise<PostDetailResponse> => {
    const response = await api.get<PostDetailResponse>(`/posts/${id}`);
    return response.data;
};

export const createPost = async (data: PostRequest): Promise<void> => {
    await api.post('/posts', data);
};
