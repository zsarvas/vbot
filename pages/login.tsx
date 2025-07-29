import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Alert,
  Center,
  Stack,
  Group,
  LoadingOverlay,
  Box,
} from '@mantine/core';
import { IconAlertCircle, IconMail, IconLock } from '@tabler/icons';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  
  // Get redirect URL from query params
  const redirectTo = router.query.redirect as string || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const success = await login({ email: email.trim(), password });
      
      if (success) {
        router.replace(redirectTo);
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <LoadingOverlay visible />
      </Center>
    );
  }

  // Don't render if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Login - Rocket League Leaderboards</title>
        <meta name="description" content="Sign in to your account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Container size="xs" px="md" style={{ minHeight: '100vh' }}>
        <Center style={{ minHeight: '100vh' }}>
          <Box style={{ width: '100%', maxWidth: 400 }}>
            <Paper shadow="md" p="xl" radius="md" withBorder>
              <Stack spacing="lg">
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                  <Title order={2} mb="xs">
                    Welcome back
                  </Title>
                  <Text color="dimmed" size="sm">
                    Sign in to your account to continue
                  </Text>
                </div>

                {/* Error Alert */}
                {error && (
                  <Alert 
                    icon={<IconAlertCircle size={16} />} 
                    color="red" 
                    variant="light"
                    onClose={clearError}
                    withCloseButton
                  >
                    {error}
                  </Alert>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <Stack spacing="md">
                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      icon={<IconMail size={16} />}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                      disabled={isSubmitting}
                    />

                    <PasswordInput
                      label="Password"
                      placeholder="Your password"
                      icon={<IconLock size={16} />}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      loading={isSubmitting}
                      disabled={!email.trim() || !password.trim()}
                    >
                      Sign in
                    </Button>
                  </Stack>
                </form>

                {/* Demo Accounts */}
                <Alert color="blue" variant="light">
                  <Text size="sm" weight={500} mb="xs">
                    Demo Accounts:
                  </Text>
                  <Text size="xs">
                    <strong>Admin:</strong> admin@example.com / admin123<br />
                    <strong>User:</strong> user@example.com / user123
                  </Text>
                </Alert>

                {/* Register Link */}
                <Group position="center" spacing="xs">
                  <Text size="sm" color="dimmed">
                    Don't have an account?
                  </Text>
                  <Link href="/register" passHref>
                    <Anchor size="sm">
                      Sign up
                    </Anchor>
                  </Link>
                </Group>

                {/* Back to Home */}
                <Group position="center">
                  <Link href="/" passHref>
                    <Anchor size="sm" color="dimmed">
                      ← Back to Leaderboards
                    </Anchor>
                  </Link>
                </Group>
              </Stack>
            </Paper>
          </Box>
        </Center>
      </Container>
    </>
  );
};

export default Login; 