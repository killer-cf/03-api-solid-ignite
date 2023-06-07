import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search by gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post(`/gyms`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Javascript Gym',
        description: 'Javascript foreground',
        phone: '81999999999',
        latitude: -7.7443848,
        longitude: -34.8287316,
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
      .get('/gyms/search')
      .query({
        q: 'Rails',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Rails Gym',
      }),
    ])
  })
})
