import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TokenModel } from './entity'

@Injectable()
export class TokenRepo {
  @InjectRepository(TokenModel)
  private readonly tokenModel: Repository<TokenModel>

  async findOneByToken(token: string): Promise<TokenModel | null> {
    return this.tokenModel.findOne({ where: { token } })
  }

  async save(tokenModel: TokenModel) {
    const existing = await this.findOneByToken(tokenModel.token)
    if (existing) {
      tokenModel._id = existing._id
    }
    return this.tokenModel.save(tokenModel)
  }
  
  async deleteByToken(token: string) {
    return this.tokenModel.delete({ token })
  }
}
