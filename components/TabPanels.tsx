import React, { memo, useMemo } from 'react';
import { Container, Title, Text, Card, SimpleGrid, Badge, Group } from '@mantine/core';
import { IconTrophy, IconUsers, IconClock } from '@tabler/icons';
import TableComponent from './TableComponent/TableComponent';
import { PlayerData } from '../types/PlayerTypes';

interface TabPanelProps {
  playerData: PlayerData[];
  loading: boolean;
  error: string | null;
}

export const HomePanel = memo<TabPanelProps>(({ playerData, loading, error }) => {
  const stats = useMemo(() => {
    const totalPlayers = playerData.length;
    const activePlayers = playerData.filter(p => p.Wins > 0 || p.Losses > 0).length;
    const topPlayer = playerData.length > 0 ? playerData[0] : null;
    
    return { totalPlayers, activePlayers, topPlayer };
  }, [playerData]);

  return (
    <Container size="xl" px="md">
      <Title order={2} mb="xl" align="center">
        Welcome to Rocket League Leaderboards
      </Title>
      
      <SimpleGrid cols={3} spacing="lg" mb="xl" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart">
            <div>
              <Text size="sm" color="dimmed" weight={500}>
                Total Players
              </Text>
              <Text size="xl" weight={700}>
                {stats.totalPlayers.toLocaleString()}
              </Text>
            </div>
            <IconUsers size={32} color="blue" />
          </Group>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart">
            <div>
              <Text size="sm" color="dimmed" weight={500}>
                Active Players
              </Text>
              <Text size="xl" weight={700}>
                {stats.activePlayers.toLocaleString()}
              </Text>
            </div>
            <IconClock size={32} color="green" />
          </Group>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart">
            <div>
              <Text size="sm" color="dimmed" weight={500}>
                Top Player
              </Text>
              <Text size="lg" weight={700}>
                {stats.topPlayer?.Name || 'N/A'}
              </Text>
              {stats.topPlayer && (
                <Badge color="gold" variant="light">
                  {Math.round(stats.topPlayer.MMR).toLocaleString()} MMR
                </Badge>
              )}
            </div>
            <IconTrophy size={32} color="gold" />
          </Group>
        </Card>
      </SimpleGrid>

      <Text size="lg" mb="md" align="center" color="dimmed">
        Track your progress and compete with other players in our Rocket League community.
        View the leaderboards to see how you stack up against the competition!
      </Text>
    </Container>
  );
});

HomePanel.displayName = 'HomePanel';

export const Leaderboard2v2Panel = memo<TabPanelProps>(({ playerData, loading, error }) => {
  return (
    <Container size="xl" px="md">
      <TableComponent 
        playerData={playerData}
        loading={loading}
        error={error}
        title="2v2 Leaderboard"
      />
    </Container>
  );
});

Leaderboard2v2Panel.displayName = 'Leaderboard2v2Panel';

export const Leaderboard1v1Panel = memo<TabPanelProps>(({ playerData, loading, error }) => {
  return (
    <Container size="xl" px="md">
      <TableComponent 
        playerData={playerData}
        loading={loading}
        error={error}
        title="1v1 Leaderboard"
      />
    </Container>
  );
});

Leaderboard1v1Panel.displayName = 'Leaderboard1v1Panel'; 