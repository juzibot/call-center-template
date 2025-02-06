import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MessageModel } from './entity/message.model'

@Injectable()
export class MessageRepo {
  @InjectRepository(MessageModel)
  private readonly messageModel: Repository<MessageModel>

  async save(message: MessageModel) {
    const existing = await this.getMessageByMessageId(
      message.token,
      message.messageId,
    )
    if (existing) {
      message._id = existing._id
    }
    return await this.messageModel.save(message)
  }

  async getMessageByMessageId(token: string, messageId: string) {
    return this.messageModel.findOne({ where: { token, messageId } })
  }

  async deleteByToken(token: string) {
    await this.messageModel.delete({ token })
  }
}
