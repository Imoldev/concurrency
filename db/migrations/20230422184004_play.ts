import { Knex } from 'knex';

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.createTable('play', function (table) {
    table.collate('utf8_unicode_ci');
    table.integer('goals_count').notNullable();
    table.string('last_scored_team').nullable();
  });
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.dropTable('play');
}
