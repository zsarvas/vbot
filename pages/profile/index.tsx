import Head from 'next/head';
import React from 'react';
import { Container, Title, Text, Card, Group, Badge, Stack, Button } from '@mantine/core';
import { IconUsers, IconArrowRight } from '@tabler/icons';
import HeaderTabs from '../../components';
import { TabInfo, TabType, User } from '../../types/PlayerTypes';
import Link from 'next/link';

const ProfileIndex: React.FC = () => {
  // Mock user data - in a real app, this would come from authentication/API
  const user: User = React.useMemo(() => ({ name: "2CDs", image: "" }), []);
  
  // Empty tabs for profile page
  const tabsWithPanels: TabInfo[] = React.useMemo(() => [
    {
      tab: 'Home',
      component: <div />
    },
    {
      tab: '2v2 Leader Board',
      component: <div />
    },
    {
      tab: '3v3 Leader Board',
      component: <div />
    }
  ], []);

  return (
    <>
      <Head>
        <title>Player Profiles - Rocket League Leaderboards</title>
        <meta name="description" content="View individual player profiles and detailed statistics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div>
        <HeaderTabs
          tabInfo={tabsWithPanels}
          activeTab="Home"
          onTabChange={() => {}}
        />
        
        <Container size="sm" px="md" mt="xl">
          <Card shadow="sm" p="xl" radius="md" withBorder>
            <Stack spacing="lg" align="center">
              <IconUsers size={64} color="blue" />
              
              <div style={{ textAlign: 'center' }}>
                <Title order={2}>Player Profiles</Title>
                <Text color="dimmed" size="lg" mt="sm">
                  View detailed statistics and information for individual players
                </Text>
              </div>

              <Group spacing="xs">
                <Badge color="blue" variant="light">
                  Individual Stats
                </Badge>
                <Badge color="green" variant="light">
                  Detailed Rankings
                </Badge>
                <Badge color="purple" variant="light">
                  Performance Metrics
                </Badge>
              </Group>

              <Text size="sm" color="dimmed" align="center">
                To view a specific player&apos;s profile, click on their name in the leaderboards, 
                or visit <code>/profile/[player-name]</code> directly.
              </Text>

              <Link href="/" passHref>
                <Button 
                  rightIcon={<IconArrowRight size={16} />} 
                  variant="light"
                  size="md"
                >
                  View Leaderboards
                </Button>
              </Link>
            </Stack>
          </Card>

          {/* Instructions Card */}
          <Card shadow="sm" p="lg" radius="md" withBorder mt="xl">
            <Title order={3} mb="md">How to View Player Profiles</Title>
            <Stack spacing="sm">
              <Text size="sm">
                <strong>1.</strong> Navigate to any leaderboard (2v2 or 3v3)
              </Text>
              <Text size="sm">
                <strong>2.</strong> Click on any player&apos;s name in the table
              </Text>
              <Text size="sm">
                <strong>3.</strong> View their detailed statistics, ranking, and performance metrics
              </Text>
            </Stack>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default ProfileIndex; 