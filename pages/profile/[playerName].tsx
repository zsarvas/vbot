import Head from 'next/head';
import React from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Avatar, 
  Group, 
  Badge, 
  Stack, 
  Button,
  SimpleGrid,
  Loader,
  Center,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { IconArrowLeft, IconTrophy, IconChartLine, IconUser } from '@tabler/icons';
import HeaderTabs from '../../components';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { TabInfo, TabType, User, PlayerData } from '../../types/PlayerTypes';
import Link from 'next/link';

const PlayerProfile: React.FC = () => {
  const router = useRouter();
  const { playerName } = router.query;
  const { data: playerData, loading, error } = useLeaderboard();
  
  // Find the specific player from the data
  const player = React.useMemo(() => {
    if (!playerName || !playerData.length) return null;
    return playerData.find(p => 
      p.Name.toLowerCase() === (playerName as string).toLowerCase()
    );
  }, [playerName, playerData]);

  // Calculate player stats
  const playerStats = React.useMemo(() => {
    if (!player) return null;
    
    const totalGames = player.Wins + player.Losses;
    const winRate = totalGames > 0 ? (player.Wins / totalGames) * 100 : 0;
    const playerRank = playerData.findIndex(p => p.id === player.id) + 1;
    
    return {
      totalGames,
      winRate,
      playerRank,
      netWins: player.Wins - player.Losses
    };
  }, [player, playerData]);

  // Mock user for header
  const user: User = React.useMemo(() => ({ 
    name: "2CDs", 
    image: "" 
  }), []);
  
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

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Player Profile - Rocket League Leaderboards</title>
        </Head>
        <HeaderTabs
          tabInfo={tabsWithPanels}
          user={user}
          activeTab="Home"
          onTabChange={() => {}}
        />
        <Center style={{ minHeight: 400 }}>
          <Loader size="lg" />
        </Center>
      </>
    );
  }

  if (!player) {
    return (
      <>
        <Head>
          <title>Player Not Found - Rocket League Leaderboards</title>
        </Head>
        <HeaderTabs
          tabInfo={tabsWithPanels}
          user={user}
          activeTab="Home"
          onTabChange={() => {}}
        />
        <Container size="sm" px="md" mt="xl">
          <Card shadow="sm" p="xl" radius="md" withBorder>
            <Stack spacing="lg" align="center">
              <IconUser size={64} color="gray" />
              <Title order={2}>Player Not Found</Title>
              <Text color="dimmed" align="center">
                The player &quot;{playerName}&quot; was not found in our leaderboards.
              </Text>
              <Link href="/" passHref>
                <Button leftIcon={<IconArrowLeft size={16} />} variant="outline">
                  Back to Leaderboards
                </Button>
              </Link>
            </Stack>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{player.Name} - Player Profile - Rocket League Leaderboards</title>
        <meta name="description" content={`${player.Name}'s Rocket League statistics and ranking`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div>
        <HeaderTabs
          tabInfo={tabsWithPanels}
          user={user}
          activeTab="Home"
          onTabChange={() => {}}
        />
        
        <Container size="lg" px="md" mt="xl">
          {/* Back Button */}
          <Group mb="lg">
            <Link href="/" passHref>
              <Tooltip label="Back to Leaderboards">
                <ActionIcon size="lg" variant="subtle">
                  <IconArrowLeft size={18} />
                </ActionIcon>
              </Tooltip>
            </Link>
          </Group>

          {/* Player Header Card */}
          <Card shadow="sm" p="xl" radius="md" withBorder mb="xl">
            <Group position="apart" align="flex-start">
              <Group>
                <Avatar size={80} radius="xl" color="blue">
                  {player.Name.charAt(0).toUpperCase()}
                </Avatar>
                
                <div>
                  <Title order={1}>{player.Name}</Title>
                  <Text color="dimmed" size="lg">
                    Rocket League Player
                  </Text>
                  <Group spacing="xs" mt="sm">
                    <Badge 
                      color={playerStats && playerStats.playerRank <= 3 ? 'gold' : 'blue'} 
                      variant="light"
                      leftSection={<IconTrophy size={12} />}
                    >
                      Rank #{playerStats?.playerRank}
                    </Badge>
                    <Badge color="green" variant="light">
                      {Math.round(player.MMR).toLocaleString()} MMR
                    </Badge>
                  </Group>
                </div>
              </Group>
            </Group>
          </Card>

          {/* Statistics Grid */}
          <SimpleGrid cols={2} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group position="apart" mb="md">
                <Text size="sm" color="dimmed" weight={500}>
                  Match Statistics
                </Text>
                <IconChartLine size={20} color="blue" />
              </Group>
              
              <Stack spacing="sm">
                <Group position="apart">
                  <Text size="sm">Total Games</Text>
                  <Text weight={600}>{playerStats?.totalGames.toLocaleString()}</Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">Wins</Text>
                  <Text weight={600} color="teal">{player.Wins.toLocaleString()}</Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">Losses</Text>
                  <Text weight={600} color="red">{player.Losses.toLocaleString()}</Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">Net Wins</Text>
                  <Text 
                    weight={600} 
                    color={playerStats && playerStats.netWins >= 0 ? 'teal' : 'red'}
                  >
                    {playerStats && playerStats.netWins >= 0 ? '+' : ''}{playerStats?.netWins.toLocaleString()}
                  </Text>
                </Group>
              </Stack>
            </Card>

            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Group position="apart" mb="md">
                <Text size="sm" color="dimmed" weight={500}>
                  Performance
                </Text>
                <IconTrophy size={20} color="gold" />
              </Group>
              
              <Stack spacing="sm">
                <Group position="apart">
                  <Text size="sm">Win Rate</Text>
                  <Text weight={600} color="teal">
                    {playerStats?.winRate.toFixed(1)}%
                  </Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">MMR Rating</Text>
                  <Text weight={600} color="blue">
                    {Math.round(player.MMR).toLocaleString()}
                  </Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">Global Rank</Text>
                  <Text weight={600} color="grape">
                    #{playerStats?.playerRank}
                  </Text>
                </Group>
                <Group position="apart">
                  <Text size="sm">Player ID</Text>
                  <Text weight={600} color="dimmed" size="xs">
                    {player.id}
                  </Text>
                </Group>
              </Stack>
            </Card>
          </SimpleGrid>

          {/* Additional Info */}
          <Card shadow="sm" p="lg" radius="md" withBorder mt="xl">
            <Title order={3} mb="md">About {player.Name}</Title>
            <Text color="dimmed">
              {player.Name} is a competitive Rocket League player currently ranked #{playerStats?.playerRank} 
              on our leaderboards with an MMR of {Math.round(player.MMR).toLocaleString()}. 
              {playerStats && playerStats.totalGames > 0 && (
                <> They have played {playerStats.totalGames.toLocaleString()} total games with a win rate of {playerStats.winRate.toFixed(1)}%.</>
              )}
            </Text>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default PlayerProfile; 