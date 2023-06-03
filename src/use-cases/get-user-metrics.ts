import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUseCaseReq {
  userId: string
}

interface GetUserMetricsUseCaseRes {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseReq): Promise<GetUserMetricsUseCaseRes> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return { checkInsCount }
  }
}
