# react-native-theme-provider-next

[![npm version](https://img.shields.io/npm/v/react-native-theme-provider-next.svg)](https://www.npmjs.com/package/react-native-theme-provider-next)
[![license](https://img.shields.io/npm/l/react-native-theme-provider-next.svg)](https://github.com/lucyandlucky/react-native-theme-provider-next/blob/main/LICENSE)

A flexible and type-safe theme provider for React Native applications. Create custom theme configurations with full TypeScript support, context-based theming, and easy theme overrides.

## ✨ Features

- 🎨 **Custom Theme Support** - Define your own theme structure with full TypeScript generics
- 🔄 **Theme Context** - Access theme anywhere in your component tree via React Context
- 🪝 **useTheme Hook** - Use themes with optional partial overrides
- 🎁 **withTheme HOC** - Wrap class components to inject theme props
- 🔀 **Deep Merge** - Seamlessly merge theme overrides with base theme using deepmerge
- 📦 **Lightweight** - Minimal dependencies, maximum flexibility

## 📦 Installation

```sh
# Using npm
npm install react-native-theme-provider-next

# Using yarn
yarn add react-native-theme-provider-next
```

## 🚀 Quick Start

### 1. Define Your Theme

```typescript
// theme.ts
const LightTheme = {
  dark: false,
  colors: {
    primary: '#6200ee',
    background: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

const DarkTheme = {
  dark: true,
  colors: {
    primary: '#bb86fc',
    background: '#121212',
    text: '#ffffff',
    border: '#333333',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

export type AppTheme = typeof LightTheme;
export { LightTheme, DarkTheme };
```

### 2. Create Theming

```typescript
// theming.ts
import { createTheming } from 'react-native-theme-provider-next';
import { LightTheme, type AppTheme } from './theme';

export const { ThemeContext, ThemeProvider, useTheme, withTheme } =
  createTheming<AppTheme>(LightTheme);
```

### 3. Wrap Your App

```tsx
// App.tsx
import React, { useState } from 'react';
import { ThemeProvider } from './theming';
import { LightTheme, DarkTheme } from './theme';
import MainScreen from './MainScreen';

export default function App() {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeProvider theme={isDark ? DarkTheme : LightTheme}>
      <MainScreen onToggleTheme={() => setIsDark(!isDark)} />
    </ThemeProvider>
  );
}
```

### 4. Use Theme in Components

#### Using the `useTheme` Hook

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from './theming';

function MyComponent() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={{ color: theme.colors.text }}>Hello, Themed World!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

#### Using `useTheme` with Overrides

You can pass partial theme overrides directly to `useTheme`:

```tsx
function CustomButton() {
  // Override only specific values
  const theme = useTheme({
    colors: {
      primary: '#ff5722', // Override primary color for this component
    },
  });

  return (
    <TouchableOpacity style={{ backgroundColor: theme.colors.primary }}>
      <Text>Custom Styled Button</Text>
    </TouchableOpacity>
  );
}
```

#### Using the `withTheme` HOC

For class components or when you prefer HOCs:

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { withTheme } from './theming';
import type { AppTheme } from './theme';

interface Props {
  theme: AppTheme;
  title: string;
}

class ThemedCard extends React.Component<Props> {
  render() {
    const { theme, title } = this.props;

    return (
      <View
        style={{
          backgroundColor: theme.colors.background,
          padding: theme.spacing.medium,
        }}
      >
        <Text style={{ color: theme.colors.text }}>{title}</Text>
      </View>
    );
  }
}

export default withTheme(ThemedCard);
```

## 📖 API Reference

### `createTheming<T>(defaultTheme: T)`

Creates a complete theming system based on your default theme.

**Parameters:**

- `defaultTheme: T` - Your default theme object

**Returns:** `ThemingType<T>`

- `ThemeContext` - React Context holding the current theme
- `ThemeProvider` - Provider component to wrap your app
- `useTheme(overrides?)` - Hook to access and optionally override theme
- `withTheme(Component)` - HOC to inject theme into class components

### `ThemeProvider`

```tsx
<ThemeProvider theme={myTheme}>{children}</ThemeProvider>
```

**Props:**

- `theme?: T` - Theme object (defaults to the theme passed to `createTheming`)
- `children: ReactNode` - Child components

### `useTheme(overrides?)`

```tsx
const theme = useTheme();
// or with overrides
const theme = useTheme({ colors: { primary: '#custom' } });
```

**Parameters:**

- `overrides?: DeepPartial<T>` - Optional partial theme to merge with current theme

**Returns:** `T` - The merged theme object

### `withTheme(Component)`

```tsx
const ThemedComponent = withTheme(MyComponent);
```

**Parameters:**

- `Component: React.ComponentType<P>` - Component that expects a `theme` prop

**Returns:** A new component with `theme` prop injected

### `deepmerge`

Re-exported from the `deepmerge` package for convenience:

```tsx
import { deepmerge } from 'react-native-theme-provider-next';

const mergedTheme = deepmerge(baseTheme, overrideTheme);
```

## 🔧 TypeScript Support

This library is built with TypeScript and provides full type safety. Your theme type will be inferred throughout your application:

```typescript
// Define your theme type
type MyTheme = {
  colors: {
    primary: string;
    secondary: string;
  };
  fonts: {
    regular: string;
    bold: string;
  };
};

// Create theming with your type
const { useTheme, ThemeProvider } = createTheming<MyTheme>(defaultTheme);

// useTheme() will return MyTheme
// Overrides will be type-checked as DeepPartial<MyTheme>
```

## 🤝 Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 📄 License

MIT © [lucy.li](https://github.com/lucyandlucky)

---

Made with ❤️ using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
