import { Module } from '@nestjs/common'
import { DataModule } from 'src/data/data.module'
import { OssModule } from 'src/oss/oss.module'
import { RabbitModule } from 'src/rabbit/rabbit.module'
import { PuppetService } from './puppet.service'
@Module({
  providers: [PuppetService],
  exports: [PuppetService],
  imports: [DataModule, RabbitModule, OssModule],
})
export class PuppetModule {}
