import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const userCreated = await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonh.doe@gmail.com',
      password_hash: await hash('password', 6),
    })

    const { user } = await sut.execute({
      user_id: userCreated.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Jonh Doe')
  })

  it('should not be able to get user profile with wrong user_id', async () => {
    await expect(() =>
      sut.execute({
        user_id: 'no_user_id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
