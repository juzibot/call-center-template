import { Column, Entity, Index, ObjectId, ObjectIdColumn } from 'typeorm'

@Entity()
@Index('token-index', ['token'], { unique: true })
export class TokenModel {
  @ObjectIdColumn()
  _id?: ObjectId

  @Column()
  token: string
}
