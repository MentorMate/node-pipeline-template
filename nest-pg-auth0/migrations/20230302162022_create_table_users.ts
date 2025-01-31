import { Knex } from 'knex';
import { createUpdatedAtTriggerSQL, dropUpdatedAtTriggerSQL } from './utils';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table
      .string('id')
      .unique({ indexName: 'unq_users_id' })
      .index()
      .notNullable();
    table.string('userId').unique({ indexName: 'unq_users_user_id' }).index();
    table
      .string('email')
      .notNullable()
      .unique({ indexName: 'unq_users_email' });
    table.string('password');
    table.timestamps(false, true, true);
  });

  await knex.raw(createUpdatedAtTriggerSQL('users'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(dropUpdatedAtTriggerSQL('users'));
  await knex.schema.dropTable('users');
}
