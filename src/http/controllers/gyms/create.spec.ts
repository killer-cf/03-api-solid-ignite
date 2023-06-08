import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const createGymResponse = await request(app.server)
      .post(`/gyms`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Javascript foreground',
        phone: '81999999999',
        latitude: -7.7443848,
        longitude: -34.8287316,
      })

    expect(createGymResponse.statusCode).toEqual(201)
  })
})
