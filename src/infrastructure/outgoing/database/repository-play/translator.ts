import { Play } from '@/core/domain/play';

export type PlayRow = {
  goals_count: number;
  last_scored_team: string | null;
};

export function hydrate(playRow: PlayRow): Play {
  const result = Object.create(Play.prototype);
  Object.defineProperties(result, {
    goalsCount: {
      value: playRow.goals_count,
      writable: true,
    },
    lastScoredTeam: {
      value: playRow.last_scored_team,
      writable: true,
    },
  });
  return result;
}

export function dehydrate(play: Play): PlayRow {
  return {
    goals_count: play['goalsCount'],
    last_scored_team: play['lastScoredTeam'],
  };
}
