import styled from 'styled-components';

const FilterButton = styled.button<{ $isActive: boolean }>`
  padding: 10px 18px;
  border: 1px solid
    ${({ theme, $isActive }) =>
      $isActive ? theme.colors.primary : '#555'};
  border-radius: 20px;

  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.card};

  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export default FilterButton;