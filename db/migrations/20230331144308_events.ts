import { Knex } from 'knex';

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.createTable('events', function (table) {
    table.collate('utf8_unicode_ci');
    table.bigIncrements('id').primary();
    table.string('type').notNullable();
    table.string('tenant_id').notNullable();
    table.string('entity_type').notNullable();
    table.string('entity_id').notNullable();
    table.dateTime('occurred_on', { precision: 3 }).notNullable();
    table.integer('payload_version').notNullable();
    table.json('payload');
  });
}

export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
  return knex.schema.dropTable('events');
}
