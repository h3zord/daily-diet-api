import Fastify from 'fastify'
import cookie from '@fastify/cookie'

import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
import { metricsRoutes } from './routes/metrics'

export const fastify = Fastify()

fastify.register(cookie)

fastify.register(usersRoutes, {
  prefix: 'users',
})

fastify.register(mealsRoutes, {
  prefix: 'meals',
})

fastify.register(metricsRoutes, {
  prefix: 'metrics',
})
