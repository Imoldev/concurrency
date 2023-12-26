import { AsyncDbTransactional } from "@/infrastructure/incoming/async-storage.decorator";
import { Repository } from "@/infrastructure/outgoing/database/repository";

export class PromiseTransactionHandler extends Repository {

    @AsyncDbTransactional()
    public async handle() {

        const table1 = 'INSERT INTO `table_1` SET :values';
        const table2 = 'INSERT INTO `table_2` SET :values';
        const table3 = 'INSERT INTO `table_2` SET :values';

        const connection = await this.getConnection();
        await Promise.all([connection.query( table1, { values: undefined }), Promise.reject(), Promise.reject]);

    }
}