import { payloads } from '@juzi/wechaty-puppet'

export enum PuppetEvent {
  MESSAGE = 'puppet.event.message',
}

export type PuppetMessageEventPayload = payloads.EventMessage
