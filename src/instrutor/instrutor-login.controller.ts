import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { batat } from './instrutor.service';

@Controller('instrutores/login')
export class InstrutorLoginController {
  constructor(private readonly instrutorService: batat) {}

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.instrutorService.login(loginDto);
  }
}
