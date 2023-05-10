import React from 'react';
import { createClient } from '@supabase/supabase-js'
import { PlayerData } from '../../types/PlayerTypes';
import styles from '../../styles/Home.module.css'
import { createStyles, Table, Progress, Anchor, Text, Group, ScrollArea } from '@mantine/core';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image';

interface TableProps {
    playerData: PlayerData[];
}

const useStyles = createStyles((theme) => ({
  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
    },
  },
}));

const TableComponent = ({ playerData }: TableProps): JSX.Element => {
    console.log(playerData);
    const { classes, theme } = useStyles();

    return (
        <div>
            <>
                <h1 className={styles.title}>
                    <a>
                        4 Man&apos;s Leaderboard
                    </a>
                </h1>
            <ScrollArea.Autosize maxHeight={500} sx={{ maxWidth: 1800 }} mx="auto">
                    <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
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
                            {
                                playerData.map(( player, idx ) => {

                                    const position = idx + 1;
                                    const gameWins = ( player.Wins / ( player.Wins + player.Losses ) ) * 100;
                                    const gameLosses = ( player.Losses / ( player.Wins + player.Losses ) ) * 100;

                                    return (
                                        <tr>
                                            <td>{position}</td>
                                            <td>
                                                <a href="">
                                                    {player.Name}
                                                </a>
                                            </td>
                                            <td>{player.MMR}</td>
                                            <td>{player.Wins}</td>
                                            <td>{player.Losses}</td>
                                            <td>{player.Wins - player.Losses}</td>
                                            <td>
                                                <Group position="apart">
                                                <Text size="xs" color="teal" weight={700}>
                                                    {gameWins.toFixed(0)}%
                                                </Text>
                                                <Text size="xs" color="red" weight={700}>
                                                    {gameLosses.toFixed(0)}%
                                                </Text>
                                                </Group>
                                                <Progress
                                                    classNames={{ bar: classes.progressBar }}
                                                    sections={[
                                                        {
                                                            value: ( player.Wins / ( player.Wins + player.Losses ) ) * 100,
                                                            color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
                                                        },
                                                        {
                                                            value: ( player.Losses / ( player.Wins + player.Losses ) ) * 100,
                                                            color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
                                                    }]
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </ScrollArea.Autosize>
                <footer className={styles.footer}>
                    <a
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Powered by {'2CDs'}
                        <span className={styles.logo}>
                            <Image src="/logo.png" width={34} height={32} />
                        </span>
                    </a>
                </footer>
            </>
        </div>
    )
}

export default TableComponent;
