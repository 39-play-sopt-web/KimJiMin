import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { createPost } from '../api/posts';
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

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const titleTooLong = title.length > 50;
  const contentTooLong = content.length > 1000;
  const authorTooLong = author.length > 20;

  const isStepValid =
    step === 1
      ? title.trim().length > 0 && !titleTooLong
      : step === 2
        ? content.trim().length > 0 && !contentTooLong
        : author.trim().length > 0 && !authorTooLong;

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] });

      alert(`${author.trim()}님의 게시글이 등록되었습니다.`);
      navigate('/posts');
    },

    onError: () => {
      alert('게시글 등록에 실패했습니다.');
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isStepValid || isPending) return;

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (
      !title.trim() ||
      !content.trim() ||
      !author.trim() ||
      titleTooLong ||
      contentTooLong ||
      authorTooLong
    ) {
      alert('입력한 내용을 다시 확인해 주세요.');
      return;
    }

    mutate({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
    });
  };

  return (
    <PageContainer>
      <PageTitle>게시글 작성</PageTitle>
      <Card>
        <StyledForm onSubmit={handleSubmit}>
          <p style={{ textAlign: 'center' }}>{step} / 3단계</p>

          {step === 1 && (
            <FormGroup>
              <label htmlFor="title">제목</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요"
              />
              <p style={{ textAlign: 'right' }}>{title.length} / 50</p>
              {titleTooLong && (
                <p style={{ color: 'red' }}>
                  제목은 50자 이하로 입력해 주세요.
                </p>
              )}
            </FormGroup>
          )}

          {step === 2 && (
            <FormGroup>
              <label htmlFor="content">내용</label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력해 주세요"
                rows={8}
              />
              <p style={{ textAlign: 'right' }}>{content.length} / 1000</p>
              {contentTooLong && (
                <p style={{ color: 'red' }}>
                  본문은 1000자 이하로 입력해 주세요.
                </p>
              )}
            </FormGroup>
          )}

          {step === 3 && (
            <FormGroup>
              <label htmlFor="author">작성자</label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="작성자를 입력해 주세요"
              />
              <p style={{ textAlign: 'right' }}>{author.length} / 20</p>
              {authorTooLong && (
                <p style={{ color: 'red' }}>
                  작성자는 20자 이하로 입력해 주세요.
                </p>
              )}
            </FormGroup>
          )}

          <ButtonGroup>
            {step > 1 && (
              <SecondaryButton
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={isPending}
              >
                이전
              </SecondaryButton>
            )}

            <PrimaryButton
              type="submit"
              disabled={!isStepValid || isPending}
            >
              {isPending ? '등록 중...' : step === 3 ? '작성하기' : '다음'}
            </PrimaryButton>

            <SecondaryButton
              type="button"
              onClick={() => navigate('/posts')}
              disabled={isPending}
            >
              목록으로
            </SecondaryButton>
          </ButtonGroup>
        </StyledForm>
      </Card>
    </PageContainer>
  );
}

export default CreatePostPage;