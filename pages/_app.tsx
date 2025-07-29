import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { AuthProvider } from '../contexts/AuthContext';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <Head>
        <title>Rocket League Leaderboards</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/logo.png" />
        <meta name="theme-color" content={colorScheme === 'dark' ? '#1a1b1e' : '#ffffff'} />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme,
            primaryColor: 'blue',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
            headings: {
              fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              fontWeight: 700,
            },
            spacing: {
              xs: 8,
              sm: 12,
              md: 16,
              lg: 20,
              xl: 24,
            },
            radius: {
              xs: 4,
              sm: 6,
              md: 8,
              lg: 12,
              xl: 16,
            },
            shadows: {
              xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
              sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
              md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            components: {
              Button: {
                defaultProps: {
                  radius: 'md',
                },
              },
              Card: {
                defaultProps: {
                  radius: 'md',
                  shadow: 'sm',
                },
              },
              Table: {
                defaultProps: {
                  highlightOnHover: true,
                  withBorder: true,
                  withColumnBorders: false,
                },
              },
            },
          }}
        >
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}


