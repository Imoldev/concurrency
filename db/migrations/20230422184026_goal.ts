import { Knex } from 'knex';

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.createTable('goal', function (table) {
    table.collate('utf8_unicode_ci');
    table.string('id').primary();
    table.string('team').notNullable();
  });
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.dropTable('goal');
}
