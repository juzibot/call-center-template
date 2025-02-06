import { types } from '@juzi/wechaty-puppet'
import { Column, Entity, Index, ObjectId, ObjectIdColumn } from 'typeorm'

@Entity()
@Index('token-index', ['token'])
@Index('token-contactId-index', ['token', 'contactId'], { unique: true })
export class ContactModel {
  @ObjectIdColumn()
  _id?: ObjectId

  @Column()
  contactId: string

  @Column()
  token: string

  @Column()
  name: string

  @Column()
  avatar: string

  @Column()
  gender: types.ContactGender
}
