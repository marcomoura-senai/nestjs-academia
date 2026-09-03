import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateInstrutorDto {
  // @ApiProperty()
  @IsString()
  nome!: string;

  @ApiProperty({ required: false })
  @IsString()
  especialidade!: string;

  @IsString()
  // @ApiProperty()
  registro!: string;

  // @ApiProperty()
  @IsString()
  senha!: string;
}
