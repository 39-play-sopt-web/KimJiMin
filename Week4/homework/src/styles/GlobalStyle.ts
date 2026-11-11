import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
  }

  #root {
    min-height: 100vh;
  }

  button,
  input,
  textarea,
  select {
    font-family: inherit;
  }

  a {
    color: inherit;
  }
`;
