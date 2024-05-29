import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CredentialsDto } from './dto';
import { AuthService } from './services/auth.service';
import { Public } from '@utils/decorators';
import { MessagePattern } from '@nestjs/microservices';
import { CurrentUser } from './current-user.decorator';
import { User } from './users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() credentials: CredentialsDto) {
    return this.authService.register(credentials);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user;
  }
}
