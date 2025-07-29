import React, { useMemo, memo } from 'react';
import { PlayerData, PlayerStats } from '../../types/PlayerTypes';
import { createStyles, Table, Progress, Anchor, Text, Group, ScrollArea, Alert, Loader, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import Image from 'next/image';
import Link from 'next/link';

interface TableProps {
  playerData: PlayerData[];
  loading?: boolean;
  error?: string | null;
  title?: string;
}

const useStyles = createStyles((theme) => ({
  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
    },
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[6],
    
    [theme.fn.smallerThan('sm')]: {
      fontSize: '2rem',
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem 0',
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    marginTop: theme.spacing.xl,
  },
  tableContainer: {
    maxWidth: 1800,
    margin: '0 auto',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    },
  },
  positionCell: {
    fontWeight: 600,
    color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[6],
  },
}));

const calculatePlayerStats = (player: PlayerData): PlayerStats => {
  const totalGames = player.Wins + player.Losses;
  
  if (totalGames === 0) {
    return {
      winRate: 0,
      lossRate: 0,
      netWins: 0,
      totalGames: 0,
    };
  }

  const winRate = (player.Wins / totalGames) * 100;
  const lossRate = (player.Losses / totalGames) * 100;
  const netWins = player.Wins - player.Losses;

  return {
    winRate,
    lossRate,
    netWins,
    totalGames,
  };
};

// Memoized player row component for performance
const PlayerRow = memo(({ player, position }: { player: PlayerData; position: number }) => {
  const { classes, theme } = useStyles();
  
  const stats = useMemo(() => calculatePlayerStats(player), [player]);

  return (
    <tr key={`${player.id}-${player.Name}`} className={classes.tableRow}>
      <td>
        <Text weight={500} size="sm" className={classes.positionCell}>
          #{position}
        </Text>
      </td>
      <td>
        <Link href={`/profile/${encodeURIComponent(player.Name)}`} passHref>
          <Anchor 
            size="sm" 
            weight={500}
            sx={(theme) => ({
              transition: 'all 150ms ease',
              '&:hover': {
                color: theme.colors.blue[6],
                textDecoration: 'underline',
                transform: 'translateX(2px)',
              }
            })}
          >
            {player.Name}
          </Anchor>
        </Link>
      </td>
      <td>
        <Text weight={600} color={theme.colors.blue[6]}>
          {Math.round(player.MMR).toLocaleString()}
        </Text>
      </td>
      <td>
        <Text color="teal" weight={500}>
          {player.Wins.toLocaleString()}
        </Text>
      </td>
      <td>
        <Text color="red" weight={500}>
          {player.Losses.toLocaleString()}
        </Text>
      </td>
      <td>
        <Text 
          color={stats.netWins >= 0 ? 'teal' : 'red'} 
          weight={600}
        >
          {stats.netWins >= 0 ? '+' : ''}{stats.netWins.toLocaleString()}
        </Text>
      </td>
      <td>
        <Group position="apart" mb="xs">
          <Text size="xs" color="teal" weight={700}>
            {stats.winRate.toFixed(1)}%
          </Text>
          <Text size="xs" color="red" weight={700}>
            {stats.lossRate.toFixed(1)}%
          </Text>
        </Group>
        <Progress
          classNames={{ bar: classes.progressBar }}
          sections={[
            {
              value: stats.winRate,
              color: theme.colorScheme === 'dark' ? theme.colors.teal[7] : theme.colors.teal[6],
            },
            {
              value: stats.lossRate,
              color: theme.colorScheme === 'dark' ? theme.colors.red[7] : theme.colors.red[6],
            }
          ]}
        />
      </td>
    </tr>
  );
});

PlayerRow.displayName = 'PlayerRow';

const TableComponent: React.FC<TableProps> = memo(({ 
  playerData, 
  loading = false, 
  error = null, 
  title = "Rocket League Leaderboard" 
}) => {
  const { classes } = useStyles();

  const filteredAndProcessedData = useMemo(() => {
    return playerData
      .filter(player => player.Wins > 0 || player.Losses > 0)
      .map((player, index) => ({
        ...player,
        position: index + 1,
      }));
  }, [playerData]);

  if (loading) {
    return (
      <Center style={{ minHeight: 200 }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
        {error}
      </Alert>
    );
  }

  if (filteredAndProcessedData.length === 0) {
    return (
      <Alert title="No Data" color="blue">
        No player data available at the moment.
      </Alert>
    );
  }

  return (
    <div className={classes.tableContainer}>
      <h1 className={classes.title}>{title}</h1>
      
      <ScrollArea.Autosize maxHeight={1500}>
        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th>Position</th>
              <th>Name</th>
              <th>MMR</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>+/-</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndProcessedData.map((player) => (
              <PlayerRow 
                key={`${player.id}-${player.Name}`}
                player={player} 
                position={player.position} 
              />
            ))}
          </tbody>
        </Table>
      </ScrollArea.Autosize>

      <footer className={classes.footer}>
        <Group spacing="xs">
          <Text size="sm" color="dimmed">
            Powered by 2CDs
          </Text>
          <Image src="/logo.png" width={24} height={24} alt="Logo" />
        </Group>
      </footer>
    </div>
  );
});

TableComponent.displayName = 'TableComponent';

export default TableComponent;
