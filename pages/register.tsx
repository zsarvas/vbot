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
  Progress,
} from '@mantine/core';
import { 
  IconAlertCircle, 
  IconMail, 
  IconLock, 
  IconUser, 
  IconCheck,
  IconX 
} from '@tabler/icons';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  
  // Get redirect URL from query params
  const redirectTo = router.query.redirect as string || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Calculate password strength
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email.trim() || !formData.username.trim() || !formData.name.trim() || 
        !formData.password.trim() || !formData.confirmPassword.trim()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      const success = await register({
        email: formData.email.trim(),
        username: formData.username.trim(),
        name: formData.name.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      if (success) {
        router.replace(redirectTo);
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'red';
    if (passwordStrength < 75) return 'yellow';
    return 'green';
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 25) return 'Very weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const isFormValid = () => {
    return (
      formData.email.trim() &&
      formData.username.trim() &&
      formData.name.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password === formData.confirmPassword &&
      formData.password.length >= 6
    );
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
        <title>Register - Rocket League Leaderboards</title>
        <meta name="description" content="Create your account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <Container size="xs" px="md" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Center>
          <Box style={{ width: '100%', maxWidth: 400 }}>
            <Paper shadow="md" p="xl" radius="md" withBorder>
              <Stack spacing="lg">
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                  <Title order={2} mb="xs">
                    Create Account
                  </Title>
                  <Text color="dimmed" size="sm">
                    Join the Rocket League community
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

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                  <Stack spacing="md">
                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      icon={<IconMail size={16} />}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email')(e.target.value)}
                      required
                      type="email"
                      disabled={isSubmitting}
                    />

                    <TextInput
                      label="Username"
                      placeholder="username"
                      icon={<IconUser size={16} />}
                      value={formData.username}
                      onChange={(e) => handleInputChange('username')(e.target.value)}
                      required
                      disabled={isSubmitting}
                      description="3-20 characters, letters, numbers, hyphens and underscores only"
                    />

                    <TextInput
                      label="Full Name"
                      placeholder="Your full name"
                      icon={<IconUser size={16} />}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name')(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />

                    <div>
                      <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        icon={<IconLock size={16} />}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password')(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                      
                      {formData.password && (
                        <Box mt="xs">
                          <Group position="apart" mb={5}>
                            <Text size="xs" color="dimmed">
                              Password strength:
                            </Text>
                            <Text size="xs" color={getPasswordStrengthColor()}>
                              {getPasswordStrengthLabel()}
                            </Text>
                          </Group>
                          <Progress 
                            value={passwordStrength} 
                            color={getPasswordStrengthColor()}
                            size="xs"
                          />
                        </Box>
                      )}
                    </div>

                    <PasswordInput
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      icon={<IconLock size={16} />}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword')(e.target.value)}
                      required
                      disabled={isSubmitting}
                      error={
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'Passwords do not match'
                          : null
                      }
                      rightSection={
                        formData.confirmPassword && formData.password === formData.confirmPassword ? (
                          <IconCheck size={16} color="green" />
                        ) : formData.confirmPassword && formData.password !== formData.confirmPassword ? (
                          <IconX size={16} color="red" />
                        ) : null
                      }
                    />

                    <Button
                      type="submit"
                      fullWidth
                      loading={isSubmitting}
                      disabled={!isFormValid()}
                    >
                      Create Account
                    </Button>
                  </Stack>
                </form>

                {/* Login Link */}
                <Group position="center" spacing="xs">
                  <Text size="sm" color="dimmed">
                    Already have an account?
                  </Text>
                  <Link href="/login" passHref>
                    <Anchor size="sm">
                      Sign in
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

export default Register; 