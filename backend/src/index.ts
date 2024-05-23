import fastify from 'fastify'
import menuConfig from "./resources/menu.json"
import cors from '@fastify/cors'
const server = fastify()

server.register(cors)
server.get('/menu', async (request, reply) => {
  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send(menuConfig)
})

server.listen({ port: 6969}, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
