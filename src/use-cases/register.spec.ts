import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
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
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
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
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'jonh.doe@gmail.com'

    await registerUseCase.execute({
      name: 'Jonh Doe',
      email,
      password: 'password',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'Jonh Doe',
        email,
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
