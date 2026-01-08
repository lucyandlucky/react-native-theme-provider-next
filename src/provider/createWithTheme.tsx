//@ts-nocheck
import * as React from 'react';
import deepmerge from 'deepmerge';
import hoistNonReactStatics from 'hoist-non-react-statics';

import type { ThemeProviderType } from './createThemeProvider';
import type { DeepPartial } from './types';

export type WithThemeType<T> = <P extends { theme?: T }>(
  Comp: React.ComponentType<P>
) => React.ComponentType<Omit<P, 'theme'> & { theme?: DeepPartial<T> }>;

const createWithTheme = <T extends object>(
  ThemeProvider: ThemeProviderType<T>,
  ThemeContext: React.Context<T>
) => {
  function withTheme<P extends { theme?: T }>(Comp: React.ComponentType<P>) {
    type Props = Omit<P, 'theme'> & {
      theme?: DeepPartial<T>;
      _reactThemeProviderForwardedRef?: React.Ref<any>;
    };

    class ThemedComponent extends React.Component<Props> {
      private _previous?: {
        a: T;
        b?: DeepPartial<T>;
        result: T;
      };

      private _merge = (a: T, b?: DeepPartial<T>): T => {
        const previous = this._previous;

        if (previous && previous.a === a && previous.b === b) {
          return previous.result;
        }

        const result =
          a && b && a !== b ? deepmerge(a, b as any) : ((a || b) as T);

        this._previous = { a, b, result };

        return result;
      };

      render() {
        const { _reactThemeProviderForwardedRef, ...rest } = this.props;

        return (
          <ThemeContext.Consumer>
            {(theme) => (
              <Comp
                {...(rest as P)}
                theme={this._merge(theme, rest.theme)}
                ref={_reactThemeProviderForwardedRef}
              />
            )}
          </ThemeContext.Consumer>
        );
      }
    }

    const ResultComponent = React.forwardRef<
      any,
      Omit<Props, '_reactThemeProviderForwardedRef'>
    >((props, ref) => (
      <ThemedComponent {...props} _reactThemeProviderForwardedRef={ref} />
    ));

    ResultComponent.displayName = `withTheme(${
      Comp.displayName || Comp.name || 'Component'
    })`;

    hoistNonReactStatics(ResultComponent, Comp);

    return ResultComponent;
  }

  return withTheme;
};

export default createWithTheme;
