import Head from 'next/head';
import React, { useState, useMemo } from 'react';
import HeaderTabs from '../components';
import { HomePanel, Leaderboard2v2Panel, Leaderboard1v1Panel } from '../components/TabPanels';
import ErrorBoundary from '../components/ErrorBoundary';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { TabInfo, TabType } from '../types/PlayerTypes';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Home");
  const { data: playerData2v2, loading: loading2v2, error: error2v2 } = useLeaderboard('2v2');
  const { data: playerData1v1, loading: loading1v1, error: error1v1 } = useLeaderboard('1v1');

  // For Home panel, combine both leaderboards or use 2v2 as default
  const combinedPlayerData = useMemo(() => {
    // Combine and deduplicate by player name, or just use 2v2 data
    return playerData2v2;
  }, [playerData2v2]);

  const tabsWithPanels: TabInfo[] = useMemo(() => [
    {
      tab: 'Home',
      component: (
        <HomePanel 
          playerData={combinedPlayerData} 
          loading={loading2v2} 
          error={error2v2} 
        />
      )
    },
    {
      tab: '2v2 Leader Board',
      component: (
        <Leaderboard2v2Panel 
          playerData={playerData2v2} 
          loading={loading2v2} 
          error={error2v2} 
        />
      )
    },
    {
      tab: '1v1 Leader Board',
      component: (
        <Leaderboard1v1Panel 
          playerData={playerData1v1} 
          loading={loading1v1} 
          error={error1v1} 
        />
      )
    }
  ], [playerData2v2, loading2v2, error2v2, playerData1v1, loading1v1, error1v1, combinedPlayerData]);

  const currentTabContent = useMemo(() => 
    tabsWithPanels.find(tab => tab.tab === activeTab)?.component,
    [tabsWithPanels, activeTab]
  );

  return (
    <ErrorBoundary>
      <Head>
        <title>Rocket League Leaderboards</title>
        <meta name="description" content="Rocket League competitive leaderboards and player statistics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div>
        <HeaderTabs
          tabInfo={tabsWithPanels}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <main>
          {currentTabContent}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Home;