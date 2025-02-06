import { Module } from '@nestjs/common'
import { DataModule } from 'src/data/data.module'
import { TokenController } from './token.controller'
import { TokenService } from './token.service'

@Module({
  imports: [DataModule],
  providers: [TokenService],
  exports: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
