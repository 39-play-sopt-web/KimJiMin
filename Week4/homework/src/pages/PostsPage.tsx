import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getPosts } from '../api/posts';
import {
  PageContainer,
  PageTitle,
  Card,
  Input,
  PrimaryButton,
  SecondaryButton,
} from '../styles/common';

const SearchBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 28px;

  ${Input} {
    flex: 1;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PostLink = styled(Link)`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text}; 
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary}; 
  }
`;

const PostContent = styled.p`
  margin: 12px 0;
  color: ${({ theme }) => theme.colors.bodyText}; 
`;

const PostAuthor = styled.p`
  color: ${({ theme }) => theme.colors.mutedText}; 
  font-size: 13px;
`;

function PostsPage() {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');

  const { data, isPending, isError } = useQuery({
    queryKey: ['posts', keyword],
    queryFn: () => getPosts(keyword),
  });

  const handleSearch = () => {
    setKeyword(input.trim());
  };

  const handleReset = () => {
    setInput('');
    setKeyword('');
  };

  return (
    <PageContainer>
      <PageTitle>게시글 목록</PageTitle>

      <SearchBar>
        <Input
          type="text"
          placeholder="제목을 검색해 주세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              handleSearch();
            }
          }}
        />

        <PrimaryButton onClick={handleSearch} disabled={!input.trim()}>
          검색
        </PrimaryButton>

        <SecondaryButton onClick={handleReset}>
          전체 보기
        </SecondaryButton>
      </SearchBar>

      {isPending ? (
        <p>게시글을 불러오는 중...</p>
      ) : isError ? (
        <p>게시글을 불러오지 못했습니다.</p>
      ) : data.posts.length === 0 ? (
        <Card>검색 결과가 없습니다.</Card>
      ) : (
        <PostList>
          {data.posts.map((post) => (
            <Card key={post.id}>
              <PostLink to={`/posts/${post.id}`}>
                {post.title}
              </PostLink>

              <PostContent>{post.content}</PostContent>
              <PostAuthor>작성자: {post.author}</PostAuthor>
            </Card>
          ))}
        </PostList>
      )}
    </PageContainer>
  );
}

export default PostsPage;