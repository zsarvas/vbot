import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import { PlayerData } from '../types/PlayerTypes';
import TableComponent from '../components/TableComponent';
import { MantineProvider } from '@mantine/core';
import { createClient } from '@supabase/supabase-js'
import { createStyles, Table, Progress, Anchor, Text, Group, ScrollArea } from '@mantine/core';
import Image from 'next/image'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import HeaderTabs, { HeaderTabStrings } from '../components/index'

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Home : NextPage = ({ data }: HomeProps): JSX.Element => {
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

  return (
    <div>
      <HeaderTabs
          tabInfo={tabsWithPanels}
          user={{ name: "2CDs", image: "" }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
      />
      <TableComponent playerData={data as PlayerData[]}/>
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