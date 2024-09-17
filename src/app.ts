import Fastify from 'fastify'

const fastify = Fastify()

fastify.listen({ port: 3000 }, () => console.log('Running...'))
