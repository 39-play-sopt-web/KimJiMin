import 'styled-components';
import { theme } from './theme';

type MovieTheme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends MovieTheme {}
}