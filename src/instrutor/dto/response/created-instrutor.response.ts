import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from '../../../roles/roles.entity';

export class CreatedInstrutorResponse {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  nome!: string;

  @ApiProperty()
  especialidade!: string;

  @ApiProperty()
  registro!: string;

  @ApiProperty({ enum: [Object.values(RolesEnum)] })
  roles!: RolesEnum[];

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty()
  deletedAt!: Date;
}
