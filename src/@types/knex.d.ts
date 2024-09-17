import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      first_name: string
      last_name: string
      picture_url?: string
      session_id: string
      creeated_at: string
    }

    meals: {
      id: string
      name: string
      description: string
      date: string
      time: string
      isOnDiet: boolean
      user_id: string
      creeated_at: string
    }
  }
}
