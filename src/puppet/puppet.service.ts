import { payloads, types } from '@juzi/wechaty-puppet'
import * as DTO from '@juzi/wechaty-puppet-rabbit/dto'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { FileBox, FileBoxType } from 'file-box'
import { ContactRepo } from 'src/data/contact.repo'
import { MessageModel, TokenModel } from 'src/data/entity'
import { MessageRepo } from 'src/data/message.repo'
import { CallCenterApiError } from 'src/error/error'
import {
  ClientCommandEventPayload,
  ClientCommandPrefix,
} from 'src/event/command'
import { OssService } from 'src/oss/oss.service'
import { RabbitProcessor } from 'src/rabbit/rabbit.processor'
import { DAY, SECOND } from 'src/util/time'

export const MEDIA_EXPIRE_THRESHOLD = 3 * DAY

@Injectable()
export class PuppetService {
  private readonly logger = new Logger(PuppetService.name)

  @Inject()
  private readonly messageRepo: MessageRepo

  @Inject()
  private readonly rabbitProcessor: RabbitProcessor

  @Inject()
  private readonly contactRepo: ContactRepo

  @Inject()
  private readonly ossService: OssService

  @OnEvent(`${ClientCommandPrefix}.start`)
  async start(data: ClientCommandEventPayload) {
    this.rabbitProcessor.sendSuccessResponseToExchange(
      data.tokenModel.token,
      data.traceId,
      {},
    )
  }

  @OnEvent(`${ClientCommandPrefix}.messagePayload`)
  async messagePayload(data: ClientCommandEventPayload) {
    try {
      const request = JSON.parse(data.dataString) as DTO.MessagePayloadRequest
      const token = data.tokenModel.token
      const messageId = request.messageId
      const messageModel = await this.messageRepo.getMessageByMessageId(
        token,
        messageId,
      )
      if (!messageModel) {
        throw new Error(`messagePayload(${messageId}) not found`)
      }
      const messagePayload = {} as payloads.Message // TODO: implement
      const response: DTO.MessagePayloadResponse = {
        payload: messagePayload,
      }
      this.rabbitProcessor.sendSuccessResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        response,
      )
    } catch (error) {
      const err = error as CallCenterApiError
      this.logger.error(`messagePayload(${data.dataString}) error: ${error}`)
      this.rabbitProcessor.sendErrorResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        err.$code || -1,
        err,
      )
    }
  }

  @OnEvent(`${ClientCommandPrefix}.contactPayload`)
  async contactPayload(data: ClientCommandEventPayload) {
    try {
      const request = JSON.parse(data.dataString) as DTO.ContactPayloadRequest
      const token = data.tokenModel.token
      const contactId = request.contactId
      const contactModel = await this.contactRepo.findOneByTokenAndContactId(
        token,
        contactId,
      )
      if (!contactModel) {
        throw new Error(`contactPayload(${contactId}) not found`)
      }
      const contactPayload = {} as payloads.Contact // TODO: implement
      const response: DTO.ContactPayloadResponse = {
        payload: contactPayload,
      }
      this.rabbitProcessor.sendSuccessResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        response,
      )
    } catch (error) {
      const err = error as CallCenterApiError
      this.logger.error(`contactPayload(${data.dataString}) error: ${error}`)
      this.rabbitProcessor.sendErrorResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        err.$code || -1,
        err,
      )
    }
  }

  @OnEvent(`${ClientCommandPrefix}.messageFile`)
  async messageFile(data: ClientCommandEventPayload) {
    try {
      const request = JSON.parse(data.dataString) as DTO.MessageFileRequest
      const token = data.tokenModel.token
      const messageId = request.messageId
      const messageModel = await this.messageRepo.getMessageByMessageId(
        token,
        messageId,
      )
      if (!messageModel) {
        throw new Error(`messageFile(${messageId}) not found`)
      }
      if (
        ![
          types.Message.Video,
          types.Message.Attachment,
          types.Message.Audio,
        ].includes(messageModel.type)
      ) {
        throw new Error(`messageFile(${messageId}) is not a file`)
      }
      
      const response: DTO.MessageFileResponse = {
        fileFilebox: '', // TODO: implement
      }

      this.rabbitProcessor.sendSuccessResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        response,
      )
    } catch (error) {
      const err = error as CallCenterApiError
      this.logger.error(`messageFile(${data.dataString}) error: ${error}`)
      this.rabbitProcessor.sendErrorResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        err.$code || -1,
        err,
      )
    }
  }

  @OnEvent(`${ClientCommandPrefix}.messageImage`)
  async messageImage(data: ClientCommandEventPayload) {
    try {
      const request = JSON.parse(data.dataString) as DTO.MessageImageRequest
      const token = data.tokenModel.token
      const messageId = request.messageId
      const messageModel = await this.messageRepo.getMessageByMessageId(
        token,
        messageId,
      )
      if (!messageModel) {
        throw new Error(`messageImage(${messageId}) not found`)
      }
      if (messageModel.type !== types.Message.Image) {
        throw new Error(`messageImage(${messageId}) is not an image`)
      }

      const response: DTO.MessageImageResponse = {
        imageFilebox: '', // TODO: implement
      }

      this.rabbitProcessor.sendSuccessResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        response,
      )
    } catch (error) {
      const err = error as CallCenterApiError
      this.logger.error(`messageImage(${data.dataString}) error: ${error}`)
      this.rabbitProcessor.sendErrorResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        err.$code || -1,
        err,
      )
    }
  }

  @OnEvent(`${ClientCommandPrefix}.messageSendText`)
  async messageSendText(data: ClientCommandEventPayload) {
    try {
      const request = JSON.parse(data.dataString) as DTO.MessageSendTextRequest

      const response: DTO.MessageSendTextResponse = {} as any // TODO: implement

      this.rabbitProcessor.sendSuccessResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        response,
      )
    } catch (error) {
      const err = error as CallCenterApiError
      this.logger.error(`messageSendText(${data.dataString}) error: ${error}`)
      this.rabbitProcessor.sendErrorResponseToExchange(
        data.tokenModel.token,
        data.traceId,
        err.$code || -1,
        err,
      )
    }
  }
}
