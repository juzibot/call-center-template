import { types } from '@juzi/wechaty-puppet'
import { Column, Entity, Index, ObjectId, ObjectIdColumn } from 'typeorm'

@Entity()
@Index('token-index', ['token'])
@Index('token-messageId-index', ['token', 'messageId'], { unique: true })
export class MessageModel {
  @ObjectIdColumn()
  _id?: ObjectId

  @Column()
  messageId: string

  @Column()
  token: string

  @Column()
  sender: string

  @Column()
  receiver: string

  @Column()
  timestamp: number

  @Column()
  type: types.Message
}
