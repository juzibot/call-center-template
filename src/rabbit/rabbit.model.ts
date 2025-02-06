export interface MqCommandMessage {
  traceId: string
  commandType: string
  data: string
}

export interface WecomEventMessage {
  openKfId: string
  token: string
}

export enum MqMessageType {
  command = 'command',
  event = 'event',
}
