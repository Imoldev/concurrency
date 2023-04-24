import { Knex } from 'knex';

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.alterTable('play', function (table) {
    table.integer('data_version').notNullable().defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.alterTable('play', function (table) {
    table.dropColumn('data_version');
  });
}
