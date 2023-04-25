import { RepositoryPlayInterface } from '@/core/app-service/repository.play.interface';
import { Play } from '@/core/domain/play';
import { ErrorConcurrency } from '../../../error/error.concurrency';
import { Repository } from '../repository';
import { dehydrate, hydrate, PlayRow } from './translator';

export class RepositoryPlay extends Repository implements RepositoryPlayInterface {
  async update(play: Play): Promise<void> {
    const playQuery = 'UPDATE play SET data_version = data_version + 1, :values WHERE data_version = :data_version';

    const playRow = dehydrate(play);
    const { data_version, ...playValues } = playRow;

    const connection = await this.getConnection();

    const result = await connection.query(playQuery, { values: playValues, data_version });

    if (result[0]['changedRows'] !== 1) {
      //throw new ErrorConcurrency('Play not updated: data versions conflict');
    }
  }

  async get(): Promise<Play> {
    const playQuery = 'SELECT * FROM play LIMIT 1';

    const connection = await this.getConnection();

    const res = await connection.query(playQuery);

    const playRow = (res as unknown as [PlayRow[]])[0][0];

    return hydrate(playRow);
  }
}
