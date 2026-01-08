import React from 'react';
import deepmerge from 'deepmerge';

import type { ThemeProviderType } from './createThemeProvider';
import createThemeProvider from './createThemeProvider';
import type { DeepPartial } from '../types';

export type ThemingType<T> = {
  ThemeContext: React.Context<T>;
  ThemeProvider: ThemeProviderType<T>;
  useTheme: (override?: any) => T;
};

export default function createTheming<T extends Object>(
  defaultTheme: T
): ThemingType<T> {
  const ThemeContext = React.createContext(defaultTheme);
  const ThemeProvider = createThemeProvider(defaultTheme, ThemeContext);

  const useTheme = (overrides?: DeepPartial<T>): T => {
    const theme = React.useContext(ThemeContext);

    const result = React.useMemo(
      () =>
        theme && overrides
          ? deepmerge(theme, overrides as Partial<T>)
          : theme || overrides,
      [theme, overrides]
    );

    return result;
  };

  return {
    ThemeContext,
    ThemeProvider,
    useTheme,
  };
}
