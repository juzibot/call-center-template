import { TokenModel } from 'src/data/entity'

export const tokenEventPrefix = 'token.event'

export const TokenEvent = {
  start: `${tokenEventPrefix}.start`,
  delete: `${tokenEventPrefix}.delete`,
}

export interface TokenEventPayload {
  tokenModel: TokenModel
}
