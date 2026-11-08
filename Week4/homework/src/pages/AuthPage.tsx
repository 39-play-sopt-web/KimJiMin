import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import type { Part } from '../api/member';
import { issueAuthorizationCode } from '../api/member';
import styled from 'styled-components';
import {
  PageContainer,
  PageTitle,
  Card,
  PrimaryButton,
  Select,
} from '../styles/common';

const AuthCard = styled(Card)`
  max-width: 440px;
  margin: 0 auto;
`;

const AuthSelect = styled(Select)`
  margin: 20px 0; 
`;

const FullButton = styled(PrimaryButton)`
  width: 100%;
`;

function AuthPage() {
  const [part, setPart] = useState<Part | ''>('');
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: issueAuthorizationCode,

    onSuccess: (authorizationCode) => {
      localStorage.setItem('authorizationCode', authorizationCode);
      localStorage.setItem('part', part);
      navigate('/posts');
    },

    onError: () => {
      alert('회원 코드 발급에 실패했습니다.');
    },
  });

  const handleIssue = () => {
    if (!part) return;
    mutate(part);
  };

  return (
    <PageContainer>
      <AuthCard>
        <PageTitle>회원 코드 발급</PageTitle>
        <p>파트를 선택하고 회원 코드를 발급받아 주세요.</p>

        <AuthSelect
          value={part}
          onChange={(e) => setPart(e.target.value as Part | '')}
        >
          <option value="">파트 선택</option>
          <option value="WEB">WEB</option>
          <option value="iOS">iOS</option>
          <option value="ANDROID">ANDROID</option>
        </AuthSelect>

        <FullButton
          type="button"
          onClick={handleIssue}
          disabled={!part || isPending}
        >
          {isPending ? '발급 중...' : '코드 발급받기'}
        </FullButton>

        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/posts">게시글 목록으로 이동</Link>
        </p>
      </AuthCard>
    </PageContainer>
  );
}

export default AuthPage;