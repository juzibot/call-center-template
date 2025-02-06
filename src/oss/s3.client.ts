/* eslint-disable @typescript-eslint/no-var-requires */
import { Readable } from 'stream'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type S3 from 'aws-sdk/clients/s3'
import { AppConfig, S3Config } from 'src/config/configuration'
import { Constructor } from 'type-fest'

@Injectable()
export class S3Client {
  private s3Instance?: S3Interface
  private config: S3Config

  constructor(private readonly configService: ConfigService<AppConfig>) {
    this.config = this.configService.get('S3Config', { infer: true })
    const S3: Constructor<S3Interface> = require('aws-sdk/clients/s3')
    const param: S3.Types.ClientConfiguration = {
      region: this.config.s3Region,
      signatureVersion: 'v4',
      credentials: {
        accessKeyId: this.config.s3Key,
        secretAccessKey: this.config.s3Secret,
      },
    }
    this.s3Instance = new S3(param)
  }

  async upload(fullPath: string, file: S3UploadBody) {
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: this.config.s3Bucket,
      Key: fullPath,
    }
    const result = await new Promise<S3UploadResult>((resolve, reject) => {
      this.s3Instance.upload(params, (err: Error, data: S3UploadResult) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
    return result.Location
  }
}

export interface S3Interface {
  upload: (
    param: S3UploadParam,
    callback: (err: Error, data: S3UploadResult) => void,
  ) => void
}

export interface S3UploadParam {
  ACL: string
  Body: S3UploadBody
  Bucket: string
  Key: string
}

export interface S3UploadResult {
  Location: string
}

export type S3UploadBody = Buffer | Uint8Array | Blob | string | Readable
