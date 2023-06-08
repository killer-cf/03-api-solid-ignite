import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch near by gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post(`/gyms`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Javascript foreground',
        phone: '81999999999',
        latitude: 8.0399607,
        longitude: -34.9466651,
      })

    await request(app.server)
      .post(`/gyms`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Rails Gym',
        description: 'Rails foreground',
        phone: '81999999999',
        latitude: -7.7443848,
        longitude: -34.8287316,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -7.7443848,
        longitude: -34.8287316,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Rails Gym',
      }),
    ])
  })
})
