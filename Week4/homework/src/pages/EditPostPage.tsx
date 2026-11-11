import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import type { FormEvent } from 'react';
import { getPost, updatePost } from '../api/posts';
import type { Post } from '../types/post'; 
import {
  PageContainer,
  PageTitle,
  Card,
  Input,
  Textarea,
  PrimaryButton,
  SecondaryButton,
  ButtonGroup,
  FormGroup,
  StyledForm,
} from '../styles/common';

function EditPostPage() {
  const { postId } = useParams();
  const id = Number(postId);

  const { data: post, isPending: isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  if (!Number.isInteger(id) || id <= 0) {
    return <PageContainer>잘못된 게시글 주소입니다.</PageContainer>;
  }

  if (isLoading) {
    return <PageContainer>게시글을 불러오는 중...</PageContainer>;
  }

  if (isError || !post) {
    return <PageContainer>게시글을 불러오지 못했습니다.</PageContainer>;
  }

  return <EditForm key={id} post={post} />;
}

function EditForm({ post }: { post: Post }) {
  const id = post.id;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: () =>
      updatePost(id, {
        title: title.trim(),
        content: content.trim(),
      }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await queryClient.invalidateQueries({ queryKey: ['post', id] });

      alert('게시글이 수정되었습니다.');
      navigate(`/posts/${id}`);
    },

    onError: () => {
      alert('게시글 수정에 실패했습니다.');
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해 주세요.');
      return;
    }

    mutate();
  };

  return (
    <PageContainer>
      <PageTitle>게시글 수정</PageTitle>

      <Card>
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="title">제목</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="content">내용</label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </FormGroup>

          <ButtonGroup>
            <PrimaryButton type="submit" disabled={isUpdating}>
              {isUpdating ? '수정 중...' : '수정하기'}
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={() => navigate(`/posts/${id}`)}
            >
              취소
            </SecondaryButton>
          </ButtonGroup>
        </StyledForm>
      </Card>
    </PageContainer>
  );
}

export default EditPostPage;