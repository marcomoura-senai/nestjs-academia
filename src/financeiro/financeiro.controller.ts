import { Controller, UseGuards } from '@nestjs/common';
import { Roles } from '../@common/decorators/roles.decorator';
import { RolesEnum } from '../roles/roles.entity';
import { JwtGuard } from '../@common/guards/jwt.guard';

@Roles(RolesEnum.FINANCEIRO)
@UseGuards(JwtGuard)
@Controller('financeiro')
export class FinanceiroController {}
