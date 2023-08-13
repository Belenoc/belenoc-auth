import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() CreateUserDto: UserDto) {
    return this.authService.create(CreateUserDto);
  }

  @Post('login')
  loginUser(@Body() LoginUserDto: UserDto) {
    return this.authService.login(LoginUserDto);
  }
}
