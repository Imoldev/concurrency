import { AsyncDbTransactional } from "@/infrastructure/incoming/async-storage.decorator";
import { Repository } from "@/infrastructure/outgoing/database/repository";

export class PromiseTransactionHandler extends Repository {

    @AsyncDbTransactional()
    public async handle() {

        const table1 = 'INSERT INTO `table_1` VALUES()';

        const connection = await this.getConnection();

        await Promise.all([delay(() => connection.query(table1), Math.floor(Math.random() * 1000)), Promise.reject()])
    }
}

function delay<T>(call: () => Promise<T>, delay: number): Promise<T> {

    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(call())}, delay)
    })
}