import { RepositoryGoalInterface } from '@/core/app-service/repository.goal.interface';
import { Goal } from '@/core/domain/goal';
import { Repository } from '../repository';
import { dehydrate } from './translator';

export class RepositoryGoal extends Repository implements RepositoryGoalInterface {
  async create(goal: Goal): Promise<void> {
    const goalInsertQuery = 'INSERT INTO `goal` SET :values';

    const goalRow = dehydrate(goal);

    const connection = await this.getConnection();
    await connection.query(goalInsertQuery, { values: goalRow });
  }
}
