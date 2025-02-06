import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContactRepo } from './contact.repo'
import {
  ContactModel,
  MessageModel,
  TokenModel,
} from './entity'
import { MessageRepo } from './message.repo'
import { TokenRepo } from './token.repo'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TokenModel,
      MessageModel,
      ContactModel,
    ]),
  ],
  providers: [TokenRepo, MessageRepo, ContactRepo],
  exports: [TokenRepo, MessageRepo, ContactRepo],
})
export class DataModule {}
