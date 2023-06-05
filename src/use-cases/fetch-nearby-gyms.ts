import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repositoy'

interface FetchNearByGymsUseCasesReq {
  userLatitude: number
  userLongitude: number
}

interface FetchNearByGymsUseCaseRes {
  gyms: Gym[]
}

export class FetchNearByGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearByGymsUseCasesReq): Promise<FetchNearByGymsUseCaseRes> {
    const gyms = await this.gymsRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
