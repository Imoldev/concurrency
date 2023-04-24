import { RepositoryPlayInterface } from '@/core/app-service/repository.play.interface';
import { Play } from '@/core/domain/play';
import { ErrorConcurrency } from '../../../error/error.concurrency';
import { Repository } from '../repository';
import { dehydrate, hydrate, PlayRow } from './translator';

export class RepositoryPlay extends Repository implements RepositoryPlayInterface {
  async update(play: Play): Promise<void> {
    const playQuery = 'UPDATE play SET :values';

    const playRow = dehydrate(play);

    const connection = await this.getConnection();

    await connection.query(playQuery, { values: playRow });
  }

  async get(): Promise<Play> {
    const playQuery = 'SELECT * FROM play LIMIT 1';

    const connection = await this.getConnection();

    const res = await connection.query(playQuery);

    const playRow = (res as unknown as [PlayRow[]])[0][0];

    return hydrate(playRow);
  }
}
