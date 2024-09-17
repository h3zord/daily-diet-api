import Fastify from 'fastify'
import cookie from '@fastify/cookie'

import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'

export const fastify = Fastify()

fastify.register(cookie)

fastify.register(usersRoutes, {
  prefix: 'users',
})

fastify.register(mealsRoutes, {
  prefix: 'meals',
})
