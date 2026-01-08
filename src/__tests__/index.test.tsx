import { render } from '@testing-library/react-native';

import createTheming from '../provider/createTheming';
import type { ReactNode } from 'react';
import React from 'react';

describe('createTheming', () => {
  const darkTheme = {
    primaryColor: '#FFA72A',
    accentColor: '#458622',
    backgroundColor: '#504f4d',
    textColor: '#FFC777',
    secondaryColor: '#252525',
  };

  const lightTheme = {
    primaryColor: '#ffcaaa',
    accentColor: '#45ffaa',
    backgroundColor: '#aaffcf',
    textColor: '#FFa7af',
    secondaryColor: '#ffffff',
  };

  const { ThemeProvider, useTheme, withTheme } = createTheming(darkTheme);

  it('provides theme prop with HOC', () => {
    const PropsChecker = withTheme(({ theme }) => {
      expect(typeof theme).toBe('object');
      expect(theme).toEqual(darkTheme);
      return null;
    });

    render(
      <ThemeProvider>
        <PropsChecker />
      </ThemeProvider>
    );
  });

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

  it('hoists non-react statics from the wrapper component', () => {
    class Component extends React.Component<any, any> {
      static foo() {
        return 'bar';
      }

      render(): ReactNode {
        return null;
      }
    }
    Component.hello = 'world';

    const decorated = withTheme(Component);

    expect(decorated.hello).toBe('world');
    expect(typeof decorated.foo).toBe('function');
    expect(decorated.foo()).toEqual('bar');
  });

  it('render ThemeProvider multiple times', () => {
    const { ThemeProvider: DarkThemeProvider, withTheme: withDarkTheme } =
      createTheming(darkTheme);
    const { ThemeProvider: LightThemeProvider, withTheme: withLightTheme } =
      createTheming({});

    const DarkPropsChecker = withDarkTheme(({ theme }) => {
      expect(typeof theme).toBe('object');
      expect(theme).toBe(darkTheme);
      return null;
    });

    const LightDarkPropsChecker = withLightTheme(({ theme }) => {
      expect(typeof theme).toBe('object');
      expect(theme).toBe(lightTheme);
      return null;
    });

    render(
      <DarkThemeProvider>
        <LightThemeProvider theme={lightTheme}>
          <LightDarkPropsChecker />
        </LightThemeProvider>

        <DarkPropsChecker />
      </DarkThemeProvider>
    );
  });

  it('set correct ref on wrapper component', () => {
    class Component extends React.Component {
      foo() {
        return 'bar';
      }
      render() {
        return null;
      }
    }

    const WithThemeComponent = withTheme(Component);

    class Wrapper extends React.Component {
      private comp: any;

      componentDidMount(): void {
        expect(this.comp.foo()).toEqual('bar');
      }

      render() {
        return (
          <WithThemeComponent ref={(component) => (this.comp = component)} />
        );
      }
    }

    render(<Wrapper />);
  });

  it('merge theme from provider and prop', () => {
    const PropsChecker = withTheme(({ theme }) => {
      expect(theme).not.toBe(lightTheme);
      expect(theme).toEqual({
        ...lightTheme,
        secondaryColor: '#252525',
      });

      return null;
    });

    render(
      <ThemeProvider theme={lightTheme}>
        <PropsChecker theme={{ secondaryColor: '#252525' }} />
      </ThemeProvider>
    );
  });

  it('merge theme from provider and overrides', () => {
    const PropsChecker = (props: any) => {
      const theme = useTheme(props.theme);

      expect(theme).not.toBe(lightTheme);
      expect(theme).toEqual({
        ...lightTheme,
        secondaryColor: '#252525',
      });
      return null;
    };

    render(
      <ThemeProvider theme={lightTheme}>
        <PropsChecker theme={{ secondaryColor: '#252525' }} />
      </ThemeProvider>
    );
  });

  it('rerender component if theme props changed', () => {
    const renderFn = jest.fn(() => null);

    class Checker extends React.Component {
      render() {
        return renderFn();
      }
    }

    const CheckerWithTheme = withTheme(Checker);

    render(
      <ThemeProvider theme={lightTheme}>
        <CheckerWithTheme />
      </ThemeProvider>
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <CheckerWithTheme />
      </ThemeProvider>
    );

    expect(renderFn.mock.calls).toHaveLength(2);
  });

  it('do not mutate existing theme', () => {
    const overrides = { primaryColor: 'red' };
    const Checker1 = withTheme(({ theme }) => {
      expect(theme).not.toBe(lightTheme);
      expect(theme).not.toBe(overrides);

      return null;
    });

    const Checker1WithTheme = withTheme(Checker1);

    const Checker2 = withTheme(({ theme }) => {
      expect(theme).toBe(lightTheme);
      return null;
    });

    const Checker2WithTheme = withTheme(Checker2);

    render(
      <ThemeProvider theme={lightTheme}>
        <Checker1WithTheme theme={overrides} />
        <Checker2WithTheme />
      </ThemeProvider>
    );
  });
});
