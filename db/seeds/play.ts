import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('play').del();

  // Inserts seed entries
  await knex('play').insert([{ goals_count: 0, last_scored_team: null }]);
}
