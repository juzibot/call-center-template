import { randomUUID } from 'crypto'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ContactRepo } from 'src/data/contact.repo'
import { MessageRepo } from 'src/data/message.repo'
import { TokenRepo } from 'src/data/token.repo'
import { TokenEvent } from 'src/event/token'
import { CreateTokenDto } from './token.model'
@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name)

  @Inject()
  private readonly tokenRepo: TokenRepo

  @Inject()
  private readonly contactRepo: ContactRepo

  @Inject()
  private readonly messageRepo: MessageRepo

  @Inject()
  private readonly eventEmitter: EventEmitter2

  async createToken(dto: CreateTokenDto) {
    const token =
      dto.token || `puppet_templatebunny_${randomUUID()}`.replace(/-/g, '')
    const tokenModel = await this.tokenRepo.save({
      token,
    })

    this.eventEmitter.emit(TokenEvent.start, {
      tokenModel,
    })
    return tokenModel
  }

  async deleteToken(token: string) {
    const tokenModel = await this.tokenRepo.findOneByToken(token)
    if (!tokenModel) {
      throw new Error('Token not found')
    }
    await this.tokenRepo.deleteByToken(token)
    await this.contactRepo.deleteByToken(token)
    await this.messageRepo.deleteByToken(token)
  }
}
