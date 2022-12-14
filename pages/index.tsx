import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { createClient } from '@supabase/supabase-js'
import { createStyles, Table, Progress, Anchor, Text, Group, ScrollArea } from '@mantine/core';
import Image from 'next/image'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import HeaderTabs, { HeaderTabStrings } from '../components/index'
import Script from 'next/script';



const Home : NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element => {

  const rocketData: PlayerData = {
    data : [] 
  }

  var position = 1

  data!.forEach(function(data: any, index: any) {
    
    //destructure the object to give nicer aliases for the iterations.
    const {id: id, Name: name, MMR: mmr, Wins: wins, Losses: losses, MatchUID: matchuid, DiscordID: discordid} = data;

    var sanitizedName = name.split("#",1)
    
    rocketData.data[index] = {
    id : position,
      Name: sanitizedName[0],
      MMR: mmr,
      Wins: wins,
      Losses: losses,
      winRate: { Wins: wins, Losses: losses} 
    }

    if (wins == 0 && losses == 0) {
      rocketData.data.splice(index, 1)
      position--
    }

    if (index != 0 && rocketData.data[index] && rocketData.data[index - 1]) {
      if (rocketData.data[index].MMR == rocketData.data[index - 1].MMR) {
        rocketData.data[index].id = rocketData.data[index - 1].id
      }
    }

    position++
    
  }, )

  let allTheData = TableReviews(rocketData)

  const [activeTab, setActiveTab] = React.useState<HeaderTabStrings>("2v2 Leader Board")

    const tabsWithPanels = [
        {
            tab: 'Home',
            component: (
              
                <div></div>
            )
        },
        {
            tab: '2v2 Leader Board',
            component: (
                <div></div>
            )
        },
        {
            tab: '3v3 Leader Board',
            component: (
                <div>3v3 Panel</div>
            )
        }
    ]

    const renderPanel = (): JSX.Element => {
        return tabsWithPanels
            .find(tab => tab.tab === activeTab)?.component ??
            (<div>Component Not found</div>)
    }


  return (
    <div>
    {/* Perhaps make a hook to handle view switching here */}
    {/* Consider importing my library @ritterg/mini-machina */}
    
    <HeaderTabs
        tabInfo={tabsWithPanels}
        user={{ name: "2CDs", image: "" }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
    />
    
    {renderPanel()}
      <p>
    {allTheData}
      </p>
    </div>
  )
}

const useStyles = createStyles((theme) => ({
  progressBar: {
    '&:not(:first-of-type)': {
      borderLeft: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
    },
  },
}));

interface PlayerData {
  data: {
    id: number;
    Name: string;
    MMR: number;
    Wins: number;
    Losses: number;
    winRate: { Wins: number; Losses: number };
  }[];
}

export function TableReviews({ data }: PlayerData) {
  const { classes, theme } = useStyles();

  const rows = data.map((row) => {
    const totalGames = row.winRate.Wins + row.winRate.Losses;
    const plusMinus = row.winRate.Wins - row.winRate.Losses
    const gameWin = (row.winRate.Wins / totalGames) * 100;
    const gameLoss = (row.winRate.Losses / totalGames) * 100;

    return (
      <><Head>
        <title>Versus Bot</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/logo.png" />
      </Head><tr key={row.id}>
      <Script id="google-tag-manager" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MRLS2WS');
      `}
    </Script>
        

      <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme: 'dark',
          }}
        >
        </MantineProvider>

          <td>{row.id}</td>
          <td>
            <Anchor<'a'> size="sm" onClick={(event) => event.preventDefault()}>
              {row.Name}
            </Anchor>
          </td>
          <td>{row.MMR.toFixed(0)}</td>
          <td>{row.Wins}</td>
          <td>{row.Losses}</td>
          <td>{plusMinus}</td>
          <td>
            <Group position="apart">
              <Text size="xs" color="teal" weight={700}>
                {gameWin.toFixed(0)}%
              </Text>
              <Text size="xs" color="red" weight={700}>
                {gameLoss.toFixed(0)}%
              </Text>
            </Group>
            <Progress
              classNames={{ bar: classes.progressBar }}
              sections={[
                {
                  value: gameWin,
                  color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],
                },
                {
                  value: gameLoss,
                  color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],
                },
              ]} />
          </td>
        </tr></>
        
    );
  });

  return (
      <><h1 className={styles.title}><a>4 Man&apos;s Leaderboard</a>
    </h1><ScrollArea.Autosize maxHeight={1800} sx={{ maxWidth: 1800 }} mx="auto">
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
          <tbody>{rows}</tbody>
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
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const supabase = createClient("https://zywthnmeikffxbzusxkb.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d3Robm1laWtmZnhienVzeGtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI2NzIxODYsImV4cCI6MTk3ODI0ODE4Nn0.g8Nam0FhgnGb2-NFH3eGLc-GvUBuXBfE2RwtutKh6Zo")
    
  // Make a request
  let { data: rocketleague, error } = await supabase.from('rocketleague').select('*').order('MMR', {ascending: false})

    return {
      props: {
        data: rocketleague
      }
  }

}
export default Home