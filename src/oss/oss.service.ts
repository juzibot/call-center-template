import { Inject, Injectable } from '@nestjs/common'
import { S3Client, S3UploadBody } from './s3.client'

@Injectable()
export class OssService {
  @Inject()
  private readonly s3Client: S3Client

  async upload(fullPath: string, file: S3UploadBody) {
    return this.s3Client.upload(fullPath, file)
  }
}
