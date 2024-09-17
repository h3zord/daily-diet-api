import { FastifyInstance } from 'fastify'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'
import { z } from 'zod'
import { knex } from '../database/connection'
import { randomUUID } from 'crypto'

const mealBodySchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  isOnDiet: z.boolean(),
  date: z.string().refine(
    (value) => {
      return /^\d{2}\/\d{2}\/\d{4}$/.test(value)
    },
    {
      message: 'Invalid date format. Expected format: dd/mm/yyyy',
    },
  ),
  time: z.string().refine(
    (value) => {
      return /^\d{2}:\d{2}$/.test(value)
    },
    {
      message: 'Invalid time format. Expected format: hh:mm',
    },
  ),
})

const mealParamsSchema = z.object({
  id: z.string().uuid(),
})

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { name, description, isOnDiet, time, date } = mealBodySchema.parse(
        request.body,
      )

      const userId = request.cookies.userId

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        isOnDiet,
        time,
        date,
        user_id: userId,
      })

      return reply.status(201).send()
    },
  )
  app.put(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const { id } = mealParamsSchema.parse(request.params)

      const { name, description, isOnDiet, time, date } = mealBodySchema.parse(
        request.body,
      )

      const userId = request.cookies.userId

      await knex('meals').where({ id, user_id: userId }).update({
        name,
        description,
        isOnDiet,
        time,
        date,
      })

      return reply.status(204).send()
    },
  )
  app.delete(
    '/',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const { id } = mealParamsSchema.parse(request.params)

      const userId = request.cookies.userId

      await knex('meals').where({ id, user_id: userId }).del()

      return reply.status(204).send()
    },
  )
  app.get('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const userId = request.cookies.userId

    const mealList = knex('meals').where({ user_id: userId }).select()

    return reply.status(200).send({ mealList })
  })
  app.get(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const { id } = mealParamsSchema.parse(request.params)

      const userId = request.cookies.userId

      const mealData = knex('meals').where({ id, user_id: userId }).first()

      return reply.status(200).send(mealData)
    },
  )
}
