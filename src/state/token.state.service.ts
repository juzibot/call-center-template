import { RedisService } from '@liaoliaots/nestjs-redis'
import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { TokenInfo } from './token.state.model'

@Injectable()
export class TokenStateService {
  private readonly redis: Redis

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow()
  }

  private getTokenInfoKey(token: string) {
    return `token_info:${token}`
  }

  async setTokenInfo(token: string, info: TokenInfo) {
    const key = this.getTokenInfoKey(token)
    await this.redis.set(key, JSON.stringify(info))
  }

  async getTokenInfo(token: string): Promise<TokenInfo> {
    const key = this.getTokenInfoKey(token)
    const data = await this.redis.get(key)
    if (!data) {
      return this.generateNullTokenInfo()
    }
    try {
      const result = JSON.parse(data) as TokenInfo
      return result
    } catch (e) {
      await this.redis.del(key)
      return this.generateNullTokenInfo()
    }
  }

  generateNullTokenInfo(): TokenInfo {
    return {
      messageSyncKey: '',
    }
  }
}
