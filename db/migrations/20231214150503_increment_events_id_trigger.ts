import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw("CREATE TRIGGER increment_events_id BEFORE INSERT ON events FOR EACH ROW BEGIN INSERT INTO events_increments SET id = DEFAULT; SET NEW.id = LAST_INSERT_ID(); END;")
}


export async function down(knex: Knex): Promise<void> {
}

