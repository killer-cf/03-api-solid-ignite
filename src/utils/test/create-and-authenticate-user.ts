import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'Jonh Doe',
      email: 'jonh.doe@gmail.com',
      password_hash: await hash('password', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'jonh.doe@gmail.com',
    password: 'password',
  })

  const { token } = authResponse.body

  return { token }
}
