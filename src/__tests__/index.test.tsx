// import React from 'react';
import { render } from '@testing-library/react-native';

import createTheming from '../provider/createTheming';

describe('createTheming', () => {
  const darkTheme = {
    primaryColor: '#FFA72A',
    accentColor: '#458622',
    backgroundColor: '#504f4d',
    textColor: '#FFC777',
    secondaryColor: '#252525',
  };

  // const lightTheme = {
  //   primaryColor: '#ffcaaa',
  //   accentColor: '#45ffaa',
  //   backgroundColor: '#aaffcf',
  //   textColor: '#FFa7af',
  //   secondaryColor: '#ffffff',
  // };

  const { ThemeProvider, useTheme } = createTheming(darkTheme);

  it('provides theme with hook', () => {
    const PropsChecker = (props: any) => {
      const theme = useTheme(props.theme);
      expect(typeof theme).toBe('object');
      expect(theme).toEqual(darkTheme);
      return null;
    };

    render(
      <ThemeProvider>
        <PropsChecker />
      </ThemeProvider>
    );
  });
});
