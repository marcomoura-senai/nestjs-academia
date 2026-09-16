import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateInstrutorDto } from './dto/create-instrutor.dto';
import { InstrutorService } from './instrutor.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { GetInstrutorResponse } from './dto/response/get-instrutor.response';
import { CreatedInstrutorResponse } from './dto/response/created-instrutor.response';

@Controller('instrutores')
export class InstrutorController {
  constructor(private readonly instrutorService: InstrutorService) {}

  @Get(':id')
  @ApiOkResponse({ type: GetInstrutorResponse })
  get(@Param('id', new ParseIntPipe()) id: number) {
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
