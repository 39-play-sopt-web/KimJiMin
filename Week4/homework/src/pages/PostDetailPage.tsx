import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { deletePost, getPost } from '../api/posts';
import {
  PageContainer,
  PageTitle,
  Card,
  DangerButton,
  ButtonGroup,
  PrimaryLink,
  TextLink,
  CenterLink,
} from '../styles/common';

const Content = styled.p`
  margin-top: 28px;
  line-height: 1.8;
  white-space: pre-wrap;
`;

function PostDetailPage() {
  const { postId } = useParams();
  const id = Number(postId);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isPending, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id),
    enabled: Number.isInteger(id) && id > 0,
  });

  const { mutate: removePost, isPending: isDeleting } = useMutation({
    mutationFn: () => deletePost(id),

    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['post', id] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });

      alert('게시글이 삭제되었습니다.');
      navigate('/posts');
    },

    onError: () => {
      alert('게시글 삭제에 실패했습니다.');
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm('정말 게시글을 삭제하시겠습니까?');

    if (confirmed) {
      removePost();
    }
  };

  if (!Number.isInteger(id) || id <= 0) {
    return <PageContainer>잘못된 게시글 주소입니다.</PageContainer>;
  }

  if (isPending) {
    return <PageContainer>게시글을 불러오는 중...</PageContainer>;
  }

  if (isError) {
    return <PageContainer>게시글을 불러오지 못했습니다.</PageContainer>;
  }

  return (
    <PageContainer>
      <Card>
        <PageTitle>{post.title}</PageTitle>

        <p>작성자: {post.author}</p>
        <p>작성일: {new Date(post.createdAt).toLocaleString('ko-KR')}</p>

        <Content>{post.content}</Content>

        <ButtonGroup>
          <PrimaryLink to={`/posts/${id}/edit`}>수정하기</PrimaryLink>

          <DangerButton onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? '삭제 중...' : '삭제하기'}
          </DangerButton>
        </ButtonGroup>
      </Card>

      <CenterLink>
        <TextLink to="/posts">목록으로 돌아가기</TextLink>
      </CenterLink>
    </PageContainer>
  );
}

export default PostDetailPage;