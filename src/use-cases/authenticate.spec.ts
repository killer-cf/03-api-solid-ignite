import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonh.doe@gmail.com',
      password_hash: await hash('password', 6),
    })

    const { user } = await sut.execute({
      email: 'jonh.doe@gmail.com',
      password: 'password',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'jonh.doe@gmail.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Jonh Doe',
      email: 'jonh.doe@gmail.com',
      password_hash: await hash('password', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'jonh.doe@gmail.com',
        password: 'password1223',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
