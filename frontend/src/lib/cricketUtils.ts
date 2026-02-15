export const getMatchStatus = (status: string): { text: string; color: string } => {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('live') || statusLower.includes('in progress')) {
    return { text: 'LIVE', color: 'bg-red-500' };
  }
  if (statusLower.includes('stumps')) {
    return { text: 'STUMPS', color: 'bg-orange-500' };
  }
  if (statusLower.includes('innings break')) {
    return { text: 'BREAK', color: 'bg-yellow-500' };
  }
  if (statusLower.includes('match ended')) {
    return { text: 'ENDED', color: 'bg-gray-500' };
  }
  if (statusLower.includes('upcoming')) {
    return { text: 'UPCOMING', color: 'bg-blue-500' };
  }
  
  return { text: status, color: 'bg-gray-500' };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;

  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const getCountdownTime = (dateString: string): string => {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) return 'Started';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const getTeamFlag = (teamName: string): string => {
  const flagMap: { [key: string]: string } = {
    'india': '🇮🇳',
    'australia': '🇦🇺',
    'england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'pakistan': '🇵🇰',
    'south africa': '🇿🇦',
    'new zealand': '🇳🇿',
    'sri lanka': '🇱🇰',
    'bangladesh': '🇧🇩',
    'west indies': '🇬🇩',
    'afghanistan': '🇦🇫',
    'zimbabwe': '🇿🇼',
    'ireland': '🇮🇪',
    'netherlands': '🇳🇱',
    'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'uae': '🇦🇪',
    'nepal': '🇳🇵'
  };

  const key = teamName.toLowerCase();
  return flagMap[key] || '🏏';
};

export const getMatchTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'test':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'odi':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 't20':
    case 't20i':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

export const calculateStrikeRate = (runs: number, balls: number): number => {
  if (balls === 0) return 0;
  return parseFloat(((runs / balls) * 100).toFixed(2));
};

export const calculateEconomy = (runs: number, overs: number): number => {
  if (overs === 0) return 0;
  return parseFloat((runs / overs).toFixed(2));
};

export const getRunRate = (runs: number, overs: number): string => {
  if (overs === 0) return '0.00';
  return (runs / overs).toFixed(2);
};
