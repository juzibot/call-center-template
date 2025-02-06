import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { json } from 'express'
import { Logger as Pino } from 'nestjs-pino'
import { AppModule } from './app.module'
import { AppConfig } from './config/configuration'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })
  app.useLogger(app.get(Pino))
  const logger = new Logger('Bootstrap')
  app.flushLogs()

  app.use(json({ limit: '5mb' }))

  const configService = app.get(ConfigService<AppConfig>)
  const port = configService.get('port', { infer: true })
  await app.listen(port)
  logger.log(`server started listening on port ${port}`)
}
bootstrap()
