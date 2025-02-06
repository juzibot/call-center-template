import { TokenModel } from 'src/data/entity'

export interface ClientCommandEventPayload {
  traceId: string
  dataString: string
  tokenModel: TokenModel
}

export const ClientCommandPrefix = 'client.command'
