import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Container, Title, Text, Stack } from '@mantine/core';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container size="sm" py="xl">
          <Stack spacing="lg" align="center">
            <Alert
              icon={<IconAlertTriangle size={24} />}
              title="Something went wrong"
              color="red"
              variant="filled"
              style={{ width: '100%' }}
            >
              <Text size="sm" mb="md">
                An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
              </Text>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                    Error Details (Development)
                  </summary>
                  <pre style={{ 
                    fontSize: '12px', 
                    overflow: 'auto', 
                    padding: '8px',
                    background: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px'
                  }}>
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </Alert>

            <Button
              leftIcon={<IconRefresh size={16} />}
              onClick={this.handleReset}
              variant="outline"
            >
              Try Again
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 