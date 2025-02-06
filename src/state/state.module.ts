import { Module } from '@nestjs/common'
import { TokenStateService } from './token.state.service'

@Module({
  providers: [TokenStateService],
  exports: [TokenStateService],
})
export class StateModule {}
