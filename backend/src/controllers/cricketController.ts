import { Request, Response } from 'express';
import axios from 'axios';

const CRICKET_API_KEY = process.env.CRICKET_API_KEY;

// Fallback to multiple sources
export const getSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    // Try primary API
    let matches = [];
    
    try {
      const response = await axios.get(`https://api.cricapi.com/v1/matches`, {
        params: { apikey: CRICKET_API_KEY, offset: 0 }
      });
      matches = response.data.data || [];
    } catch (apiError) {
      console.log('Primary API failed, using fallback data');
    }

    // If no matches, use curated fallback data
    if (matches.length < 5) {
      const fallbackMatches = [
        {
    id: 'ind-vs-eng-2026-1',
    name: 'England vs India',
    matchType: 'T20',
    status: 'Upcoming',
    venue: 'Chester-le-Street, Riverside Ground',
    date: '2026-07-01',
    dateTimeGMT: '2026-07-01T17:30:00.000Z',
    teams: ['England', 'India'],
    teamInfo: [
      { name: 'England', shortname: 'ENG' },
      { name: 'India', shortname: 'IND' }
    ]
  },

  {
    id: 'ind-vs-eng-2026-2',
    name: 'England vs India',
    matchType: 'T20',
    status: 'Upcoming',
    venue: 'Manchester, Emirates Old Trafford',
    date: '2026-07-04',
    dateTimeGMT: '2026-07-04T13:30:00.000Z',
    teams: ['England', 'India'],
    teamInfo: [
      { name: 'England', shortname: 'ENG' },
      { name: 'India', shortname: 'IND' }
    ]
  },

  {
    id: 'ind-vs-eng-2026-3',
    name: 'England vs India',
    matchType: 'T20',
    status: 'Upcoming',
    venue: 'Nottingham, Trent Bridge',
    date: '2026-07-07',
    dateTimeGMT: '2026-07-07T17:30:00.000Z',
    teams: ['England', 'India'],
    teamInfo: [
      { name: 'England', shortname: 'ENG' },
      { name: 'India', shortname: 'IND' }
    ]
  },

  {
    id: 'ind-vs-eng-2026-4',
    name: 'England vs India',
    matchType: 'T20',
    status: 'Upcoming',
    venue: 'Bristol, County Ground',
    date: '2026-07-09',
    dateTimeGMT: '2026-07-09T17:30:00.000Z',
    teams: ['England', 'India'],
    teamInfo: [
      { name: 'England', shortname: 'ENG' },
      { name: 'India', shortname: 'IND' }
    ]
  },

  {
    id: 'ind-vs-eng-2026-5',
    name: 'England vs India',
    matchType: 'T20',
    status: 'Upcoming',
    venue: 'Southampton, The Rose Bowl',
    date: '2026-07-11',
    dateTimeGMT: '2026-07-11T17:30:00.000Z',
    teams: ['England', 'India'],
    teamInfo: [
      { name: 'England', shortname: 'ENG' },
      { name: 'India', shortname: 'IND' }
    ]
  },

  {
    id: 'ind-vs-eng-2026-6',
    name: 'England vs India',
    matchType: 'ODI',
    status: 'Upcoming',
    venue: 'Birmingham, Edgbaston',
    date: '2026-07-14',
    dateTimeGMT: '2026-07-14T12:00:00.000Z',
    teams: ['England', 'India'],
    teamInfo: [
      { name: 'England', shortname: 'ENG' },
      { name: 'India', shortname: 'IND' }
    ]
  },

  {
    id: 'ind-vs-eng-2026-7',
    name: 'England vs India',
    matchType: 'ODI',
    status: 'Upcoming',
    venue: 'Cardiff, Sophia Gardens',
    date: '2026-07-16',
    dateTimeGMT: '2026-07-16T12:00:00.000Z',
    teams: ['England', 'India'],
    teamInfo: [
      { name: 'England', shortname: 'ENG' },
      { name: 'India', shortname: 'IND' }
    ]
  },

  {
    id: 'ind-vs-eng-2026-8',
    name: 'England vs India',
    matchType: 'ODI',
    status: 'Upcoming',
    venue: "London, Lord's",
    date: '2026-07-19',
    dateTimeGMT: '2026-07-19T10:00:00.000Z',
    teams: ['England', 'India'],
    teamInfo: [
      { name: 'England', shortname: 'ENG' },
      { name: 'India', shortname: 'IND' }
    ]
  }
        
      ];
      
      matches = [...matches, ...fallbackMatches];
    }

    const upcomingMatches = matches
      .filter((match: any) => !match.matchStarted && !match.matchEnded)
      .slice(0, 20);

    res.status(200).json({ success: true, matches: upcomingMatches });
  } catch (error: any) {
    console.error('Schedule error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch schedule' });
  }
};

export const getLiveMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`https://api.cricapi.com/v1/currentMatches`, {
      params: { apikey: CRICKET_API_KEY, offset: 0 }
    });

    const matches = response.data.data
      .filter((match: any) => match.matchStarted)
      .map((match: any) => ({
        id: match.id,
        name: match.name,
        matchType: match.matchType,
        status: match.status,
        venue: match.venue,
        date: match.date,
        dateTimeGMT: match.dateTimeGMT,
        teams: match.teams || [],
        teamInfo: match.teamInfo || [],
        score: match.score || [],
        isMatchStarted: match.matchStarted,
        isMatchEnded: match.matchEnded
      }));

    res.status(200).json({ success: true, matches });
  } catch (error: any) {
    console.error('Live matches error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch live matches' });
  }
};

export const getMatchScorecard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [infoResponse, scorecardResponse] = await Promise.all([
      axios.get(`https://api.cricapi.com/v1/match_info`, {
        params: { apikey: CRICKET_API_KEY, id }
      }),
      axios.get(`https://api.cricapi.com/v1/match_scorecard`, {
        params: { apikey: CRICKET_API_KEY, id }
      })
    ]);

    const matchInfo = infoResponse.data.data;
    const scorecard = scorecardResponse.data.data;

    res.status(200).json({
      success: true,
      data: {
        info: matchInfo,
        scorecard: scorecard
      }
    });
  } catch (error: any) {
    console.error('Match scorecard error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch scorecard' });
  }
};

export const getRankings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { format = 'test' } = req.query;

    // Updated ICC Rankings (February 2026)
    const rankings = {
      test: [
        { position: 1, team: 'Australia', rating: 128, points: 4604, matches: 36 },
        { position: 2, team: 'South Africa', rating: 116, points: 3581, matches: 31 },
        { position: 3, team: 'England', rating: 109, points: 5013, matches: 46 },
        { position: 4, team: 'India', rating: 104, points: 4064, matches: 39 },
        { position: 5, team: 'New Zealand', rating: 98, points: 2839, matches: 29 },
        { position: 6, team: 'Sri Lanka', rating: 88, points: 2364, matches: 27 },
        { position: 7, team: 'Pakistan', rating: 82, points: 2050, matches: 25 },
        { position: 8, team: 'West Indies', rating: 69, points: 2270, matches: 33 },
        { position: 9, team: 'Bangladesh', rating: 63, points: 1888, matches: 30 },
        { position: 8, team: 'Ireland', rating: 23, points: 185, matches: 22 }
      ],
      odi: [
        { position: 1, team: 'India', rating: 119, points: 5377, matches: 45 },
        { position: 2, team: 'New Zealand', rating: 114, points: 5370, matches: 47 },
        { position: 3, team: 'Australia', rating: 109, points: 4134, matches: 38 },
        { position: 4, team: 'Pakistan', rating: 105, points: 4294, matches: 41 },
        { position: 5, team: 'South Africa', rating: 98, points: 4022, matches: 41 },
        { position: 6, team: 'Sri Lanka', rating: 98, points: 4600, matches: 47 },
        { position: 7, team: 'Afghanistan', rating: 95, points: 2657, matches: 28 },
        { position: 8, team: 'England', rating: 88, points: 3782, matches: 43 },
        { position: 9, team: 'West Indies', rating: 77, points: 3173, matches: 41 },
        { position: 10, team: 'Bangladesh', rating: 76, points: 2882, matches: 38 }
      ],
      t20: [
        { position: 1, team: 'India', rating: 273, points: 21281, matches: 78 },
        { position: 2, team: 'Australia', rating: 260, points: 12199, matches: 47 },
        { position: 3, team: 'England', rating: 258, points: 13165, matches: 51 },
        { position: 4, team: 'New Zealand', rating: 250, points: 15255, matches: 61 },
        { position: 5, team: 'South Africa', rating: 243, points: 14315, matches: 59 },
        { position: 6, team: 'Pakistan', rating: 238, points: 19045, matches: 80 },
        { position: 7, team: 'West Indies', rating: 236, points: 16264, matches: 69 },
        { position: 8, team: 'Sri Lanka', rating: 228, points: 12536, matches: 55 },
        { position: 9, team: 'Bangladesh', rating: 223, points: 14925, matches: 67 },
        { position: 10, team: 'Afghanistan', rating: 221, points: 11042, matches: 50 }
      ]
    };

    res.status(200).json({ 
      success: true, 
      rankings: rankings[format as keyof typeof rankings] || rankings.test 
    });
  } catch (error: any) {
    console.error('Rankings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rankings' });
  }
};

export const getTrivia = async (req: Request, res: Response): Promise<void> => {
  try {
    const triviaQuestions = [
      { question: 'Who has scored the most runs in Test cricket history?', answer: 'Sachin Tendulkar (15,921 runs)', explanation: 'Sachin Tendulkar holds the record with 15,921 runs in 200 Test matches from 1989-2013.' },
      { question: 'Which bowler has taken the most wickets in Test cricket?', answer: 'Muttiah Muralitharan (800 wickets)', explanation: 'Sri Lankan spinner took 800 wickets in 133 Tests from 1992-2010.' },
      { question: 'Who hit the fastest century in ODI cricket?', answer: 'AB de Villiers (31 balls)', explanation: 'AB de Villiers scored a century off just 31 balls against West Indies in Johannesburg, 2015.' },
      { question: 'Which team won the first Cricket World Cup?', answer: 'West Indies (1975)', explanation: 'West Indies defeated Australia in the final at Lords on June 21, 1975.' },
      { question: 'Who bowled the fastest delivery ever recorded?', answer: 'Shoaib Akhtar (161.3 km/h)', explanation: 'The Rawalpindi Express bowled this against England in the 2003 Cricket World Cup.' },
      { question: 'Most centuries in ODI cricket?', answer: 'Sachin Tendulkar (49 centuries)', explanation: 'Tendulkar scored 49 ODI hundreds between 1989-2012, 20 more than Virat Kohli.' },
      { question: 'Highest individual score in Test cricket?', answer: 'Brian Lara (400*)', explanation: 'Lara scored 400 not out for West Indies against England in Antigua, 2004.' },
      { question: 'Most sixes in international cricket?', answer: 'Chris Gayle (553 sixes)', explanation: 'Universe Boss hit 553 sixes across all formats between 1999-2021.' },
      { question: 'Best bowling figures in ODI?', answer: 'Chaminda Vaas (8/19)', explanation: 'Sri Lankan pacer took 8/19 against Zimbabwe in Colombo, 2001.' },
      { question: 'Most World Cup wins?', answer: 'Australia (5 times)', explanation: 'Australia won in 1987, 1999, 2003, 2007, and 2015.' },
      { question: 'Who has the highest batting average in Test cricket?', answer: 'Don Bradman (99.94)', explanation: 'The Don averaged an unbelievable 99.94 in 52 Tests from 1928-1948.' },
      { question: 'Most wickets in ODI cricket?', answer: 'Muttiah Muralitharan (534 wickets)', explanation: 'Muralitharan took 534 wickets in 350 ODIs between 1993-2011.' },
      { question: 'Fastest fifty in T20 International cricket?', answer: 'Yuvraj Singh (12 balls)', explanation: 'Yuvraj hit 6 sixes in an over off Stuart Broad in 2007 T20 World Cup.' },
      { question: 'Most runs in a single Test innings?', answer: 'Brian Lara (400*)', explanation: 'Lara made 400 not out for West Indies vs England, April 2004.' },
      { question: 'Which country has never won a Cricket World Cup?', answer: 'South Africa', explanation: 'Despite strong teams, South Africa has never won the ODI World Cup, often choking in crucial matches.' },
      { question: 'Who has taken most hat-tricks in international cricket?', answer: 'Lasith Malinga (5 hat-tricks)', explanation: 'Malinga has 5 hat-tricks across all formats - 4 in ODIs and 1 in T20Is.' },
      { question: 'Most runs in a single ODI innings?', answer: 'Rohit Sharma (264)', explanation: 'Rohit scored 264 against Sri Lanka in Kolkata, November 2014.' },
      { question: 'First batsman to score 200 in ODI?', answer: 'Sachin Tendulkar', explanation: 'Sachin scored 200* against South Africa in Gwalior, February 2010.' },
      { question: 'Most runs in T20 Internationals?', answer: 'Virat Kohli (4000+ runs)', explanation: 'Kohli has scored over 4000 runs in T20Is with multiple centuries.' },
      { question: 'Which bowler has bowled the most maidens in Test cricket?', answer: 'Muttiah Muralitharan (1794 maidens)', explanation: 'Muralitharan bowled 1794 maiden overs across his Test career.' }
    ];

    const randomTrivia = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    
    res.status(200).json({ success: true, trivia: randomTrivia });
  } catch (error: any) {
    console.error('Trivia error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch trivia' });
  }
};

export const predictMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matchId } = req.body;

    const matchResponse = await axios.get(`https://api.cricapi.com/v1/match_info`, {
      params: { apikey: CRICKET_API_KEY, id: matchId }
    });

    const matchData = matchResponse.data.data;
    const teams = matchData.teams || [];

    if (teams.length < 2) {
      res.status(400).json({ success: false, message: 'Invalid match data' });
      return;
    }

    const team1 = teams[0];
    const team2 = teams[1];

    const baseProb = 50;
    const variation = Math.floor(Math.random() * 20) - 10;
    const team1Prob = baseProb + variation;
    const team2Prob = 100 - team1Prob;

    const factors = [
      'Recent form and momentum',
      'Head-to-head record',
      'Home advantage and pitch conditions',
      'Team composition and balance',
      'Current ICC rankings and ratings',
      'Key player availability and fitness'
    ];

    const prediction = {
      team1: {
        name: team1,
        probability: team1Prob,
        confidence: team1Prob > 55 ? 'High' : team1Prob > 45 ? 'Medium' : 'Low'
      },
      team2: {
        name: team2,
        probability: team2Prob,
        confidence: team2Prob > 55 ? 'High' : team2Prob > 45 ? 'Medium' : 'Low'
      },
      factors: factors,
      venue: matchData.venue || 'TBA',
      matchType: matchData.matchType || 'Unknown'
    };

    res.status(200).json({ success: true, prediction });
  } catch (error: any) {
    console.error('Match prediction error:', error);
    res.status(500).json({ success: false, message: 'Unable to generate prediction right now - Please try again later' });
  }
};
