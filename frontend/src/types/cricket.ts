export interface CricketMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo: TeamInfo[];
  score: Score[];
  isMatchStarted: boolean;
  isMatchEnded: boolean;
}

export interface TeamInfo {
  name: string;
  shortname: string;
  img?: string;
}

export interface Score {
  r: number;
  w: number;
  o: number;
  inning: string;
}

export interface Scorecard {
  info: MatchInfo;
  scorecard: ScorecardData;
}

export interface MatchInfo {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  teams: string[];
  teamInfo: TeamInfo[];
  score: Score[];
  tossWinner?: string;
  tossChoice?: string;
}

export interface ScorecardData {
  innings: Innings[];
}

export interface Innings {
  inning: string;
  batting: BattingEntry[];
  bowling: BowlingEntry[];
  extras: Extras;
  totals: Totals;
}

export interface BattingEntry {
  batsman: string;
  dismissal: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
}

export interface BowlingEntry {
  bowler: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface Extras {
  total: number;
  byes: number;
  legByes: number;
  wides: number;
  noBalls: number;
  penalty: number;
}

export interface Totals {
  runs: number;
  wickets: number;
  overs: number;
}

export interface Ranking {
  position: number;
  team: string;
  rating: number;
  points: number;
  matches: number;
}

export interface Trivia {
  question: string;
  answer: string;
  explanation: string;
}

export interface Prediction {
  team1: {
    name: string;
    probability: number;
    confidence: string;
  };
  team2: {
    name: string;
    probability: number;
    confidence: string;
  };
  factors: string[];
  venue: string;
  matchType: string;
}
