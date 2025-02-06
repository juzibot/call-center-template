import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { v4 } from 'uuid'

@Injectable()
export class HttpLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger(HttpLogMiddleware.name)

  use(req: Request, res: Response, next: NextFunction) {
    const key = `${req.method} ${req.url} ${v4()}`
    this.logger.log(
      `${key}, query: ${JSON.stringify(req.query)}, body: ${JSON.stringify(req.body)}`,
    )

    res.on('finish', () => {
      const { statusCode } = res
      const contentLength = res.get('content-length')

      this.logger.log(`${key}, code: ${statusCode} length: ${contentLength}`)
    })
    next()
  }
}
