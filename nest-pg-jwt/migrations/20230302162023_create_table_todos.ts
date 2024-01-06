import { Knex } from 'knex';
import { createUpdatedAtTriggerSQL, dropUpdatedAtTriggerSQL } from './utils';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('todos', (table) => {
    table.bigIncrements('id');
    table.string('name').notNullable();
    table.text('note');
    table.boolean('completed').notNullable().defaultTo(false);
    table.timestamps(false, true, true);
    table.string('userId');
    table
      .foreign('userId', 'fk_todos_user_id')
      .references('userId')
      .inTable('users')
      .onDelete('CASCADE');
    table.index('name', 'idx_todos_name');
    table.index('userId', 'idx_todos_userId');
    table.index('createdAt', 'idx_todos_created_at');
  });

  await knex.raw(createUpdatedAtTriggerSQL('todos'));
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(dropUpdatedAtTriggerSQL('todos'));
  await knex.schema.dropTable('todos');
}
