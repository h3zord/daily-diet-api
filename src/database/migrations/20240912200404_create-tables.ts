import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary()
      table.text('first_name').notNullable()
      table.text('last_name').notNullable()
      table.text('picture_url').nullable()
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
    .createTable('meals', (table) => {
      table.uuid('id').primary()
      table.text('name').notNullable()
      table.text('description').notNullable()
      table.date('date').notNullable()
      table.time('time').notNullable()
      table.boolean('isOnDiet').notNullable()
      table.uuid('user_id').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
    })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('meals')
}
