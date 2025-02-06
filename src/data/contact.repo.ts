import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ContactModel } from './entity'

@Injectable()
export class ContactRepo {
  @InjectRepository(ContactModel)
  private readonly contactModel: Repository<ContactModel>

  async findOneByTokenAndContactId(token: string, contactId: string) {
    return this.contactModel.findOne({ where: { token, contactId } })
  }

  async save(contactModel: ContactModel) {
    const existing = await this.findOneByTokenAndContactId(
      contactModel.token,
      contactModel.contactId,
    )
    if (existing) {
      contactModel._id = existing._id
    }
    return this.contactModel.save(contactModel)
  }

  async deleteByToken(token: string) {
    return this.contactModel.delete({ token })
  }
}
