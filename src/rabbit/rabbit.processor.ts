import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'
import { types } from '@juzi/wechaty-puppet'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { ConsumeMessage } from 'amqplib'
import {
  CLIENT_EXCHANGE_NAME,
  SERVER_COMMAND_QUEUE_NAME,
  SERVER_EXCHANGE_NAME,
} from 'src/config/configuration'
import { TokenRepo } from 'src/data/token.repo'
import { ClientCommandPrefix } from 'src/event/command'
import { v4 } from 'uuid'
import {
  MqCommandMessage,
  MqMessageType,
} from './rabbit.model'
const IGNORE_EVENTS: types.PuppetEventName[] = ['dong', 'dirty']
const IGNORE_COMMANDS = ['ding', 'dirtyPayload']

@Injectable()
export class RabbitProcessor {
  private readonly logger = new Logger(RabbitProcessor.name)

  @Inject()
  private readonly tokenRepo: TokenRepo

  @Inject()
  private readonly eventEmitter: EventEmitter2

  @Inject()
  private readonly amqpConnection: AmqpConnection

  @RabbitSubscribe({
    exchange: SERVER_EXCHANGE_NAME,
    routingKey: 'command',
    queue: SERVER_COMMAND_QUEUE_NAME,
  })
  async handleCommand(message: MqCommandMessage, amqpMsg: ConsumeMessage) {
    const token = amqpMsg.properties.appId as string
    if (!token) {
      this.logger.error(`handleMessage(${message}) token is empty`)
      return
    } else if (!IGNORE_COMMANDS.includes(message.commandType)) {
      this.logger.log(`handleMessage(${JSON.stringify(message)})`, {
        token,
      })
    }
    const tokenModel = await this.tokenRepo.findOneByToken(token)
    if (!tokenModel) {
      this.logger.error(`handleMessage(${message}) cannot find token ${token}`)
      return
    }

    this.eventEmitter.emit(`${ClientCommandPrefix}.${message.commandType}`, {
      traceId: message.traceId,
      dataString: message.data,
      tokenModel,
    })
  }

  sendEventToExchange(
    token: string,
    eventType: types.PuppetEventName,
    data: any,
  ) {
    if (!IGNORE_EVENTS.includes(eventType)) {
      this.logger.log(
        `sendEvent(${eventType})ToExchange(${JSON.stringify(data)}) to ${token}`,
        {
          token,
        },
      )
    }

    this.amqpConnection.publish(CLIENT_EXCHANGE_NAME, token, {
      traceId: v4(),
      type: eventType,
      eventType,
      data: JSON.stringify(data),
    })
  }

  sendErrorResponseToExchange(
    token: string,
    traceId: string,
    code: number,
    error: Error,
  ) {
    this.logger.log(
      `sendErrorResponseToExchange(${error.message}) to ${token}, traceId: ${traceId}`,
      {
        token,
      },
    )
    this.amqpConnection.publish(CLIENT_EXCHANGE_NAME, token, {
      traceId,
      type: MqMessageType.command,
      data: '{}',
      code,
      error: error.message,
    })
  }

  sendSuccessResponseToExchange(
    token: string,
    traceId: string,
    data: any,
    noLog = false,
  ) {
    if (!noLog) {
      this.logger.log(
        `sendSuccessResponseToExchange(${JSON.stringify(data)}) to ${token}, traceId: ${traceId}`,
        {
          token,
        },
      )
    }
    this.amqpConnection.publish(CLIENT_EXCHANGE_NAME, token, {
      traceId,
      type: MqMessageType.command,
      data: JSON.stringify(data),
    })
  }
}
