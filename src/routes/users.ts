import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database/connection'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      firstName: z.string().min(3),
      lastName: z.string().min(3),
      pictureUrl: z.string().optional(),
    })

    const { firstName, lastName, pictureUrl } = createUserBodySchema.parse(
      request.body,
    )

    const sessionId = randomUUID()

    await knex('users').insert({
      id: randomUUID(),
      first_name: firstName,
      last_name: lastName,
      picture_url: pictureUrl,
      session_id: sessionId,
    })

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    reply.status(201).send()
  })
}
