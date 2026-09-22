import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InstrutorService } from './instrutor.service';
import { seconds, Throttle } from '@nestjs/throttler';

@Controller('instrutores/login')
export class InstrutorLoginController {
  constructor(private readonly instrutorService: InstrutorService) {}

  @Throttle({ default: { limit: 2, ttl: seconds(60) } })
  @HttpCode(200)
  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.instrutorService.login(loginDto);
  }
}
