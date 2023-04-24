import { AsyncDbTransactional } from '@/infrastructure/incoming/async-storage.decorator';
import { Goal } from '../domain/goal';
import { Teams } from '../domain/teams';
import { RepositoryGoalInterface } from './repository.goal.interface';
import { RepositoryPlayInterface } from './repository.play.interface';

export class GoalsHandler {
  constructor(
    private readonly repositoryGoal: RepositoryGoalInterface,
    private readonly repositoryPlay: RepositoryPlayInterface,
  ) {}

  @AsyncDbTransactional()
  public async score(id: string, team: Teams) {
    const goal = new Goal(id, team);

    const play = await this.repositoryPlay.get();
    play.scoreGoal(team);

    await Promise.all([this.repositoryGoal.create(goal), this.repositoryPlay.update(play)]);
  }
}
