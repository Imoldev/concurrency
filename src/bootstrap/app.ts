import { asyncStorageDb } from './async-storage-db';
import { GoalsHandler } from '@/core/app-service/goals.handler';
import { RepositoryGoal } from '@/infrastructure/outgoing/database/repository-goal/repository.goal';
import { RepositoryPlay } from '@/infrastructure/outgoing/database/repository-play/repository.play';

const repositoryGoal = new RepositoryGoal(asyncStorageDb);
const repositoryPlay = new RepositoryPlay(asyncStorageDb);

export const goalsHandler = new GoalsHandler(repositoryGoal, repositoryPlay);
