import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';

import { theme } from './theme';
import GlobalStyle from './GlobalStyle';

import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />

        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);