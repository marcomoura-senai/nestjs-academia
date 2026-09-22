import { genSalt, hash, compare } from 'bcrypt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InstrutorRepository } from './instrutor.repository';
import { CreateInstrutorDto } from './dto/create-instrutor.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '../auth/jwt.service';

const mockPassword =
  'askjfjksdhjkgsfjlkgbnjfdklnbjkldfgnjklbsndfjkbnjklfnbjklkjlnsdnbfjaskjfjksdhjkgsfjlkgbnjfdklnbjkldfgnjklbsndfjkbnjklfnbjklkjlnsdnbfjaskjfjksdhjkgsfjlkgbnjfdklnbjkldfgnjklbsndfjkbnjklfnbjklkjlnsdnbfjaskjfjksdhjkgsfjlkgbnjfdklnbjkldfgnjklbsndfjkbnjklfnbjklkjlnsdnbfj';

const mockHash = '$2b$10$liPXVrx7zaMeWgeQDfUCNubFoRyNQ/ev3kYzIkZAB19jZySmbjBCG';

@Injectable()
export class InstrutorService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly instrutorRepository: InstrutorRepository,
  ) {}

  async create(instrutor: CreateInstrutorDto) {
    const salt = await genSalt(10);
    const hashPassword = await hash(instrutor.senha, salt);
    return this.instrutorRepository.create({
      ...instrutor,
      senha: hashPassword,
    });
  }

  async login(loginDto: LoginDto) {
    const instrutor = await this.instrutorRepository.getPasswordByRegistro(
      loginDto.registro,
    );

    if (!instrutor) {
      await compare(mockPassword, mockHash);
      throw new UnauthorizedException();
    }

    if (!(await compare(loginDto.senha, instrutor.senha))) {
      throw new UnauthorizedException();
    }

    const { senha: _, ...instrutorWithoutPassword } = instrutor;

    const jwt = this.jwtService.sign({
      ...instrutorWithoutPassword,
      roles: instrutorWithoutPassword.roles.map((r) => r.role),
    });

    return { jwt };
  }

  async get(id: number) {
    const instrutor = await this.instrutorRepository.get(id);
    if (!instrutor) {
      throw new NotFoundException(`Instrutor ${id} not found`);
    }

    return instrutor;
  }
}
