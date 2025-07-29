import Head from 'next/head';
import React, { useState, useMemo } from 'react';
import HeaderTabs from '../components';
import { HomePanel, Leaderboard2v2Panel, Leaderboard3v3Panel } from '../components/TabPanels';
import ErrorBoundary from '../components/ErrorBoundary';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { TabInfo, TabType } from '../types/PlayerTypes';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Home");
  const { data: playerData, loading, error, refetch } = useLeaderboard();

  const tabsWithPanels: TabInfo[] = useMemo(() => [
    {
      tab: 'Home',
      component: (
        <HomePanel 
          playerData={playerData} 
          loading={loading} 
          error={error} 
        />
      )
    },
    {
      tab: '2v2 Leader Board',
      component: (
        <Leaderboard2v2Panel 
          playerData={playerData} 
          loading={loading} 
          error={error} 
        />
      )
    },
    {
      tab: '3v3 Leader Board',
      component: (
        <Leaderboard3v3Panel 
          playerData={playerData} 
          loading={loading} 
          error={error} 
        />
      )
    }
  ], [playerData, loading, error]);

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