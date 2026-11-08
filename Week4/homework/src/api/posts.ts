import { api } from './client';
import type { ApiResponse, PostListData } from '../types/post';
import type { Post } from '../types/post';

export async function getPosts(keyword?: string) {
  const response = await api.get<ApiResponse<PostListData>>(
    '/api/v1/posts',
    {
      params: {
        ...(keyword ? { keyword } : {}),
        size: 10,
      },
    },
  );

  return response.data.data;
}

export async function getPost(postId: number) {
  const response = await api.get<ApiResponse<Post>>(
    `/api/v1/posts/${postId}`,
  );

  return response.data.data;
}

// 게시글 작성 시 서버에 전달할 데이터
export interface CreatePostRequest {
  title: string;
  content: string;
  author: string;
}

// 새 게시글 작성
export async function createPost(data: CreatePostRequest) {
  const authorizationCode = localStorage.getItem('authorizationCode');

  const response = await api.post<ApiResponse<Post>>(
    '/api/v1/posts',
    data,
    {
      headers: {
        Authorization: authorizationCode,
      },
    },
  );

  return response.data.data;
}

// 게시글 수정 시 서버에 전달할 데이터
export interface UpdatePostRequest {
  title: string;
  content: string;
}

// 게시글 수정
export async function updatePost(postId: number, data: UpdatePostRequest) {
  const authorizationCode = localStorage.getItem('authorizationCode');

  const response = await api.put<ApiResponse<Post>>(
    `/api/v1/posts/${postId}`,
    data,
    {
      headers: {
        Authorization: authorizationCode,
      },
    },
  );

  return response.data.data;
}

// 게시글 삭제
export async function deletePost(postId: number) {
  const authorizationCode = localStorage.getItem('authorizationCode');

  await api.delete(`/api/v1/posts/${postId}`, {
    headers: {
      Authorization: authorizationCode,
    },
  });
}