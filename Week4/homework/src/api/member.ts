import { api } from './client';
import type { ApiResponse } from '../types/post';

export type Part = 'WEB' | 'iOS' | 'ANDROID';

interface AuthorizationCodeData {
  authorizationCode: string;
}

export async function issueAuthorizationCode(part: Part) {
  const response = await api.post<ApiResponse<AuthorizationCodeData>>(
    '/api/v1/members/authorization-code',
    { part },
  );

  return response.data.data.authorizationCode;
}