import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const PageContainer = styled.main`
  width: min(100% - 40px, 800px);
  margin: 48px auto;
`;

export const PageTitle = styled.h1`
  margin-bottom: 28px;
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const Card = styled.div`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border}; 
  border-radius: 12px;
`;
const fieldStyles = css`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 15px;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.border};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const Textarea = styled.textarea`
  ${fieldStyles} 
  resize: vertical;
`;

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonStyles}
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const SecondaryButton = styled(PrimaryButton)`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.secondaryText}; 

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.secondaryHover};
  }
`;

export const DangerButton = styled(PrimaryButton)`
  background-color: ${({ theme }) => theme.colors.danger};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.dangerHover}; 
  }
`;

export const PrimaryLink = styled(Link)`
  ${buttonStyles}
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const TextLink = styled(Link)`
  color: ${({ theme }) => theme.colors.mutedText};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Select = styled.select`
  ${fieldStyles}
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
  justify-content: center;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const CenterLink = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;