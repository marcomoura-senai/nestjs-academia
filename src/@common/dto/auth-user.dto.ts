import { JwtPayload } from 'jsonwebtoken';
import { RolesEnum } from '../../roles/roles.entity';

export interface AuthUserDto extends JwtPayload {
  data: {
    id: number;
    nome: string;
    especialidade: string;
    registro: string;
    roles: RolesEnum[];
  };
}
