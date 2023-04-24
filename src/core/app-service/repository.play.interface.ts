import { Play } from '../domain/play';

export interface RepositoryPlayInterface {
  get(): Promise<Play>;
  update(play: Play): Promise<void>;
}
