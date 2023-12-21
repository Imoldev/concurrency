import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw("CREATE TRIGGER increment_events_id BEFORE INSERT ON events FOR EACH ROW UPDATE events_increments SET id = LAST_INSERT_ID(id+1), NEW.id = LAST_INSERT_ID();")
    return knex.raw("INSERT INTO events_increments VALUES (0);")
}


export async function down(knex: Knex): Promise<void> {
}

