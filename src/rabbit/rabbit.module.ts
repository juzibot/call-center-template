import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  CLIENT_EXCHANGE_NAME,
  SERVER_EXCHANGE_NAME,
} from 'src/config/configuration'
import { DataModule } from 'src/data/data.module'
import { RabbitProcessor } from './rabbit.processor'

@Module({
  imports: [
    DataModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mqUri = config.get<string>('mqUri')
        return {
          uri: mqUri,
          connectionInitOptions: { wait: false },
          exchanges: [
            {
              name: CLIENT_EXCHANGE_NAME,
              type: 'direct',
            },
            {
              name: SERVER_EXCHANGE_NAME,
              type: 'direct',
            },
          ],
          channels: {
            'call-center-channel': {
              prefetchCount: 10,
              default: true,
            },
          },
        }
      },
    }),
  ],
  providers: [RabbitProcessor],
  exports: [RabbitProcessor],
})
export class RabbitModule {}
