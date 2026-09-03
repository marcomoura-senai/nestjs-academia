import { ApiProperty } from '@nestjs/swagger';
import {
  ClassConstructor,
  plainToInstance,
  Transform,
  Type,
} from 'class-transformer';
import {
  IsIn,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';

class OrderByDto {
  @ApiProperty()
  @IsString()
  field!: string;

  @ApiProperty()
  @Transform(({ value }: { value: string }) => value.toUpperCase())
  @IsIn(['ASC', 'DESC'])
  order!: 'ASC' | 'DESC';
}

class PaginationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  number!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Max(100)
  size!: number;
}

function validateJsonDto(value: unknown, cls: ClassConstructor<unknown>) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  try {
    return plainToInstance(cls, JSON.parse(value) as OrderByDto);
  } catch {
    return null;
  }
}

export class SearchAlunoDto {
  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  nomes!: string[];

  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  planos!: string[];

  @ApiProperty({ type: OrderByDto })
  @Transform((params) => {
    return validateJsonDto(params.value, OrderByDto);
  })
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  orderBy?: OrderByDto;

  @ApiProperty({ type: PaginationDto })
  @Transform((params) => {
    return validateJsonDto(params.value, PaginationDto);
  })
  @IsOptional()
  @ValidateNested()
  page?: PaginationDto;
}
