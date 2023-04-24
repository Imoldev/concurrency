import { Play } from '@/core/domain/play';

export type PlayRow = {
  data_version: number;
  goals_count: number;
  last_scored_team: string | null;
};

export function hydrate(playRow: PlayRow): Play {
  const result = Object.create(Play.prototype);
  Object.defineProperties(result, {
    dataVersion: {
      value: playRow.data_version,
      writable: true,
    },
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
    data_version: play['dataVersion'],
    goals_count: play['goalsCount'],
    last_scored_team: play['lastScoredTeam'],
  };
}
