import { Module } from '@nestjs/common'
import { S3Client } from './s3.client'
import { OssService } from './oss.service'

@Module({
  providers: [S3Client, OssService],
  exports: [OssService],
})
export class OssModule {}
