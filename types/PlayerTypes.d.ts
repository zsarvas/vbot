export interface PlayerData {
  id: number;
  DiscordId: number;
  Name: string;
  MMR: number;
  Wins: number;
  Losses: number;
  MatchUID: string;
}

export interface PlayerStats {
  winRate: number;
  lossRate: number;
  netWins: number;
  totalGames: number;
}

export type TabType = "Home" | "2v2 Leader Board" | "3v3 Leader Board";

export interface TabInfo {
  tab: TabType;
  component: React.ReactNode;
}

export interface User {
  name: string;
  image: string;
}