import { Body, Controller, Post } from '@nestjs/common'
import { CreateTokenDto, DeleteTokenDto } from './token.model'
import { TokenService } from './token.service'

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('create')
  async createToken(@Body() body: CreateTokenDto) {
    const tokenModel = await this.tokenService.createToken(body)
    return { tokenModel }
  }

  @Post('delete')
  async deleteToken(@Body() body: DeleteTokenDto) {
    await this.tokenService.deleteToken(body.token)
    return { success: true }
  }
}
