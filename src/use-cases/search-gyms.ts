import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repositoy'

interface SearchGymsUseCasesReq {
  query: string
  page: number
}

interface SearchGymsUseCaseRes {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCasesReq): Promise<SearchGymsUseCaseRes> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
