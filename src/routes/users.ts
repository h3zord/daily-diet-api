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

    const userId = randomUUID()

    await knex('users').insert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      picture_url: pictureUrl,
    })

    reply.setCookie('userId', userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send()
  })

  app.get('/:id', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const userData = await knex('users')
      .where({
        id,
      })
      .first()

    return reply.status(200).send(userData)
  })
}
