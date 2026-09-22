import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateInstrutorDto } from './dto/create-instrutor.dto';
import { InstrutorService } from './instrutor.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { GetInstrutorResponse } from './dto/response/get-instrutor.response';
import { CreatedInstrutorResponse } from './dto/response/created-instrutor.response';
import { JwtGuard } from '../@common/guards/jwt.guard';
import { GetUserJwt } from '../@common/decorators/get-user-jwt.decorator';
import { type AuthUserDto } from '../@common/dto/auth-user.dto';

@UseGuards(JwtGuard)
@Controller('instrutores')
export class InstrutorController {
  constructor(private readonly instrutorService: InstrutorService) {}

  @Get(':id')
  @ApiOkResponse({ type: GetInstrutorResponse })
  get(
    @Param('id', new ParseIntPipe()) id: number,
    @GetUserJwt() user: AuthUserDto,
  ) {
    if (user.data.id !== id) {
      throw new ForbiddenException();
    }
    return this.instrutorService.get(id);
  }

  @ApiCreatedResponse({ type: CreatedInstrutorResponse })
  @Post()
  async create(@Body() createInstrutorDto: CreateInstrutorDto) {
    const instrutor = await this.instrutorService.create(createInstrutorDto);

    return {
      ...instrutor,
      roles: instrutor.roles?.map((r) => r.role),
    };
  }
}
