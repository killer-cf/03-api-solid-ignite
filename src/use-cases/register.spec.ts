import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@gmail.com',
      password: 'password',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Jonh Doe')
    expect(user.email).toEqual('jonh.doe@gmail.com')
    expect(user.password_hash).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Jonh Doe',
      email: 'jonh.doe@gmail.com',
      password: 'password',
    })

    const isPasswordCorrectlyHashed = await compare(
      'password',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'jonh.doe@gmail.com'

    await sut.execute({
      name: 'Jonh Doe',
      email,
      password: 'password',
    })

    await expect(() =>
      sut.execute({
        name: 'Jonh Doe',
        email,
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
