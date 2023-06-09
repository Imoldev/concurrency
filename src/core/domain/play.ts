import { Teams } from './teams';

export class Play {

  private readonly dataVersion: number;

  private goalsCount: number = 0;

  private lastScoredTeam: Teams | null = null;

  public scoreGoal(team: Teams) {
    this.lastScoredTeam = team;
    this.goalsCount++;
  }
}
