import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseReq {
  userId: string
}

interface FetchUserCheckInsHistoryUseCaseRes {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: FetchUserCheckInsHistoryUseCaseReq): Promise<FetchUserCheckInsHistoryUseCaseRes> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId)

    return { checkIns }
  }
}
