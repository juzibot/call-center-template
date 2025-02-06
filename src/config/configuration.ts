// this has to be set outside class because they might be used in decorators

const MQ_BASE_NAME = 'template'

export const CLIENT_EXCHANGE_NAME =
  process.env.CLIENT_EXCHANGE_NAME || `${MQ_BASE_NAME}.message.to.client`
export const SERVER_EXCHANGE_NAME =
  process.env.SERVER_EXCHANGE_NAME || `${MQ_BASE_NAME}.message.to.server`
export const SERVER_COMMAND_QUEUE_NAME =
  process.env.SERVER_COMMAND_QUEUE_NAME || `${MQ_BASE_NAME}.command.queue`

export class AppConfig {
  private static _instance: AppConfig
  public static get instance(): AppConfig {
    return this._instance || (this._instance = new this())
  }

  // base
  port: number
  mqUri: string
  mongoUri: string
  mongoDbName: string
  redisUri: string
  redisKeyPrefix: string

  isDev: boolean
  logPath: string

  // oss
  S3Config: S3Config

  constructor() {
    this.port = parseInt(process.env.PORT || '3000')
    this.mqUri =
      process.env.MQ_URI
    this.mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017'
    this.mongoDbName = process.env.MONGO_DB_NAME || 'call_center_template'
    this.redisUri = process.env.REDIS_URI || 'redis://localhost:6379'
    this.redisKeyPrefix = process.env.REDIS_KEY_PREFIX || 'call_center_template'

    this.isDev = process.env.NODE_ENV !== 'production'
    this.logPath = process.env.LOG_PATH || 'logs'

    this.S3Config = {
      s3Region: process.env.S3_REGION,
      s3Key: process.env.S3_KEY,
      s3Secret: process.env.S3_SECRET,
      s3Bucket: process.env.S3_BUCKET,
    }
  }
}

export interface S3Config {
  s3Region: string
  s3Key: string
  s3Secret: string
  s3Bucket: string
}
