export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostListData {
  posts: Post[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
}