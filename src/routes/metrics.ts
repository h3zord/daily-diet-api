import { FastifyInstance } from 'fastify'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'
import { knex } from '../database/connection'

export async function metricsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const userId = request.cookies.userId

    const metrics = await knex('meals')
      .where('user_id', userId)
      .select(
        knex.raw('COUNT(*) as totalMeals'),
        knex.raw('COUNT(CASE WHEN isOnDiet = 1 THEN 1 END) as mealsOnDiet'),
        knex.raw('COUNT(CASE WHEN isOnDiet = 0 THEN 1 END) as mealsOffDiet'),
      )
      .first()

    const meals = await knex('meals')
      .where('user_id', userId)
      .orderBy('date', 'asc')
      .orderBy('time', 'asc')

    let bestSequence = 0
    let currentSequence = 0

    meals.forEach((meal) => {
      if (meal.isOnDiet) {
        currentSequence += 1
        if (currentSequence > bestSequence) {
          bestSequence = currentSequence
        }
      } else {
        currentSequence = 0
      }
    })

    return reply.status(200).send({ metrics: { ...metrics, bestSequence } })
  })
}
