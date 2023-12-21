import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('events_increments', function (table) {
        table.collate('utf8_unicode_ci');
        table.bigInteger('id').primary();
      });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('events_increments');
}


