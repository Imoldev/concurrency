import { Goal } from '../domain/goal';

export interface RepositoryGoalInterface {
  create(goal: Goal): Promise<void>;
}
