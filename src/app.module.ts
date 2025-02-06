import { existsSync, mkdirSync } from 'fs'
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { LogStream } from 'logfilestream'
import { LoggerModule } from 'nestjs-pino'
import { multistream } from 'pino'
import pretty from 'pino-pretty'
import { AppConfig } from './config/configuration'
import { DataModule } from './data/data.module'
import { HttpLogMiddleware } from './middleware/http-log'
import { OssModule } from './oss/oss.module'
import { PuppetModule } from './puppet/puppet.module'
import { RabbitModule } from './rabbit/rabbit.module'
import { TokenModule } from './token/token.module'

@Module({
  imports: [
    DataModule,
    TokenModule,
    RabbitModule,
    PuppetModule,
    OssModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig>) => {
        const isDev = config.get('isDev', { infer: true })
        const logPath: string = config.get('logPath', { infer: true })
        if (!existsSync(logPath)) {
          mkdirSync(logPath)
        }

        const destStreams: Array<{ stream: any; level?: any }> = [
          {
            stream: LogStream({
              logdir: logPath,
              nameformat: '[tiktok-call-center]YYYY-MM-DD[.log]',
            }),
          },
        ]

        if (isDev) {
          const prettyStream = pretty({
            include: 'level,time,token',
            singleLine: true,
            messageFormat: (item) => {
              const { context, msg, err, info } = item as {
                context: string
                msg: string
                err?: Error
                info?: unknown
              }

              const strArr = [`[${context}] ${err?.message || msg}`]
              if (err?.stack) {
                strArr.push('\n')
                strArr.push(err?.stack)
              }

              if (info) {
                strArr.push('\n')
                if (typeof info === 'string') {
                  strArr.push(info)
                } else {
                  strArr.push(JSON.stringify(info))
                }
              }

              return strArr.join('')
            },
          })
          destStreams.push({
            stream: prettyStream,
            level: 'debug',
          })
        }

        return {
          pinoHttp: [
            {
              level: isDev ? 'debug' : 'info',
              formatters: {
                level: (label) => {
                  return { level: label }
                },
              },
              autoLogging: false,
            },
            multistream(destStreams),
          ],
        }
      },
    }),
    ConfigModule.forRoot({
      load: [() => AppConfig.instance],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'mongodb',
          url: config.get<string>('mongoUri'),
          database: config.get<string>('mongoDbName'),
          entities: require('./data/entity'),
          synchronize: true,
          useUnifiedTopology: true,
        }
      },
    }),
    EventEmitterModule.forRoot({
      verboseMemoryLeak: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        return {
          type: 'mongodb',
          url: config.get<string>('mongoUri'),
          database: config.get<string>('mongoDbName'),
          entities: require('./data/entity'),
          synchronize: true,
          useUnifiedTopology: true,
        }
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<AppConfig>,
      ): RedisModuleOptions => {
        return {
          config: {
            url: configService.get('redisUri', { infer: true }),
            keyPrefix: configService.get('redisKeyPrefix', { infer: true }),
          },
        }
      },
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLogMiddleware).forRoutes('*')
  }
}
