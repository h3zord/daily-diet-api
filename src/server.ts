import { fastify } from './app'
import { env } from './env'

fastify.listen({ port: env.PORT }, () => console.log(`Running at ${env.PORT}`))
