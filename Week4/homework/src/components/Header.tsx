import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DangerButton } from '../styles/common';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MenuLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoutButton = styled(DangerButton)`
  padding: 8px 14px;
  border-radius: 6px;
`;

function Header() {
  const navigate = useNavigate();
  const part = localStorage.getItem('part');

  const handleLogout = () => {
    localStorage.removeItem('authorizationCode');
    localStorage.removeItem('part');

    navigate('/');
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <Logo to="/posts">4주차 게시판</Logo>
        {part && <span>파트: {part}</span>}
      </LeftSection>

      <Navigation>
        <MenuLink to="/posts">게시글 목록</MenuLink>
        <MenuLink to="/posts/new">글쓰기</MenuLink>

        <LogoutButton onClick={handleLogout}>
          로그아웃
        </LogoutButton>
      </Navigation>
    </HeaderContainer>
  );
}

export default Header;