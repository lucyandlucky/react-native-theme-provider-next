import React from 'react';

export type ThemeProviderType<T> = React.ComponentType<{
  children: React.ReactNode;
  theme?: T;
}>;

function createThemeProvider<T>(
  defaultTheme: T,
  ThemeContext: React.Context<T>
): ThemeProviderType<T> {
  return class ThemeProvider extends React.Component<any> {
    static defaultProps = {
      theme: defaultTheme,
    };

    render() {
      return (
        <ThemeContext.Provider value={this.props.theme}>
          {this.props.children}
        </ThemeContext.Provider>
      );
    }
  };
}

export default createThemeProvider;
