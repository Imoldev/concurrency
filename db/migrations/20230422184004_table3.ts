import { Knex } from 'knex';

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.createTable('table_3', function (table) {
    table.collate('utf8_unicode_ci');
    table.bigIncrements('id').primary();
  });
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.dropTable('table_3');
}