import React, { useState } from 'react';
import {
  createStyles,
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import Link from 'next/link';
import {
  IconLogout,
  IconStar,
  IconSettings,
  IconSwitchHorizontal,
  IconChevronDown,
  IconSun,
  IconMoonStars,
  IconLogin,
  IconUserPlus,
} from '@tabler/icons';
import { TabInfo, TabType } from '../types/PlayerTypes';
import { useAuth } from '../contexts/AuthContext';

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
    marginBottom: theme.spacing.lg,
  },

  mainSection: {
    paddingBottom: theme.spacing.sm,
  },

  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    
    [theme.fn.smallerThan('sm')]: {
      gap: theme.spacing.xs,
    },
  },

  brandText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 600,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    
    [theme.fn.smallerThan('sm')]: {
      fontSize: theme.fontSizes.md,
      display: 'none',
    },
    
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan('sm')]: {
      padding: `${theme.spacing.xs}px`,
    },
  },

  authButtons: {
    display: 'flex',
    gap: theme.spacing.xs,
    
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  tabs: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  tabsList: {
    borderBottom: '0 !important',
  },

  tab: {
    fontWeight: 500,
    height: 38,
    backgroundColor: 'transparent',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
    },

    '&[data-active]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
    },
  },

  mobileMenu: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

interface HeaderTabsProps {
  tabInfo: TabInfo[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const HeaderTabs: React.FC<HeaderTabsProps> = ({
  tabInfo,
  activeTab,
  onTabChange,
}) => {
  const { classes, theme, cx } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  
  // Use authentication context
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleTabChange = (value: string | null) => {
    if (value && tabInfo.some(tab => tab.tab === value)) {
      onTabChange(value as TabType);
      close(); // Close mobile menu when tab is selected
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpened(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const tabItems = tabInfo.map((tab) => (
    <Tabs.Tab value={tab.tab} key={tab.tab}>
      {tab.tab}
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
        <Group position="apart">
          <Link href="/">
            <div className={classes.brandGroup} style={{ cursor: 'pointer' }}>
              <Image
                src="/logo.png"
                height={32}
                width={32}
                alt="Rocket League Logo"
              />
              <Text className={classes.brandText}>
                Rocket League Leaderboards
              </Text>
            </div>
          </Link>

          <div className={classes.rightSection}>
            <ActionIcon
              variant="subtle"
              color={colorScheme === 'dark' ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
              size="lg"
            >
              {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>

            <Burger 
              opened={opened} 
              onClick={toggle} 
              className={classes.burger} 
              size="sm" 
            />

            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <Menu
                    width={260}
                    position="bottom-end"
                    transition="pop-top-right"
                    onClose={() => setUserMenuOpened(false)}
                    onOpen={() => setUserMenuOpened(true)}
                    withinPortal
                  >
                    <Menu.Target>
                      <UnstyledButton
                        className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                      >
                        <Group spacing={7}>
                          <Avatar 
                            src={user.avatar || null} 
                            alt={user.name} 
                            radius="xl" 
                            size={20}
                            color="blue"
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                            {user.username}
                          </Text>
                          <IconChevronDown size={12} stroke={1.5} />
                        </Group>
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Account</Menu.Label>
                      <Menu.Item 
                        icon={<IconStar size={14} color={theme.colors.yellow[6]} stroke={1.5} />}
                      >
                        {user.role === 'admin' ? 'Administrator' : 'Player'}
                      </Menu.Item>

                      <Menu.Label>Settings</Menu.Label>
                      <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>
                        Account settings
                      </Menu.Item>
                      <Menu.Item icon={<IconSwitchHorizontal size={14} stroke={1.5} />}>
                        Change account
                      </Menu.Item>
                      
                      <Menu.Divider />
                      <Menu.Item 
                        icon={<IconLogout size={14} stroke={1.5} />}
                        onClick={handleLogout}
                        color="red"
                      >
                        Logout
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <div className={classes.authButtons}>
                    <Link href="/login" passHref>
                      <ActionIcon 
                        variant="subtle" 
                        size="lg"
                        title="Login"
                        component="a"
                      >
                        <IconLogin size={18} />
                      </ActionIcon>
                    </Link>
                    <Link href="/register" passHref>
                      <ActionIcon 
                        variant="subtle" 
                        size="lg"
                        title="Register"
                        component="a"
                      >
                        <IconUserPlus size={18} />
                      </ActionIcon>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </Group>
      </Container>

      {/* Desktop Tabs */}
      <Container>
        <Tabs
          value={activeTab}
          onTabChange={handleTabChange}
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsList: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{tabItems}</Tabs.List>
        </Tabs>
      </Container>

      {/* Mobile Menu */}
      {opened && (
        <Container className={classes.mobileMenu}>
          <Tabs
            value={activeTab}
            onTabChange={handleTabChange}
            variant="pills"
            orientation="vertical"
            pb="md"
          >
            <Tabs.List>{tabItems}</Tabs.List>
          </Tabs>
          
          {/* Mobile Auth Buttons */}
          {!isAuthenticated && (
            <Group mt="md" spacing="xs">
              <Link href="/login" passHref>
                <UnstyledButton
                  component="a"
                  onClick={close}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '6px',
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                  }}
                >
                  <Group spacing="xs">
                    <IconLogin size={16} />
                    <Text size="sm">Login</Text>
                  </Group>
                </UnstyledButton>
              </Link>
              <Link href="/register" passHref>
                <UnstyledButton
                  component="a"
                  onClick={close}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '6px',
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                  }}
                >
                  <Group spacing="xs">
                    <IconUserPlus size={16} />
                    <Text size="sm">Register</Text>
                  </Group>
                </UnstyledButton>
              </Link>
            </Group>
          )}
        </Container>
      )}
    </div>
  );
};

export default HeaderTabs;