import createKnex, { Knex } from 'knex'
import { env } from '../env'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
  useNullAsDefault: true,
}

export const knex = createKnex(config)
