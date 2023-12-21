import { Knex } from 'knex';

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.createTable('events', function (table) {
    table.collate('utf8_unicode_ci');
    table.bigInteger('id').primary().defaultTo(0);
    table.string('type').notNullable();
    table.datetime('created_on', { precision: 6 }).defaultTo(knex.fn.now(6))
    table.json('payload');
  });
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.dropTable('events');
}
