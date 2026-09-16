import { expect, it, describe, beforeAll, jest } from '@jest/globals';
import { InstrutorService } from '../instrutor.service';
import { InstrutorRepository } from '../instrutor.repository';
import { Instrutor } from '../../@common/entities/instrutor.entity';
import { CreateInstrutorDto } from '../dto/create-instrutor.dto';
import { JwtService } from '../../auth/jwt.service';
import { UnauthorizedException } from '@nestjs/common';

// MOCK -> Dublê
// FAKE -> InstrutorRepositoryMock implements InstrutorRepository
// SPY -> "Espionar". Verificar qual foi o argumento passado pra uma função, e qual foi o retorno

// FAKE
class InstrutorRepositoryMock implements InstrutorRepository {
  private memoryDb = new Map<number, Instrutor>();

  private idSequence = 0;

  create(instrutor: CreateInstrutorDto): Promise<Instrutor> {
    const instrutorEntity = new Instrutor();
    instrutorEntity.id = this.idSequence + 1;
    instrutorEntity.createdAt = new Date();
    instrutorEntity.updatedAt = new Date();
    instrutorEntity.registro = instrutor.registro;
    instrutorEntity.nome = instrutor.nome;
    instrutorEntity.especialidade = instrutor.especialidade;
    instrutorEntity.senha = instrutor.senha;
    instrutorEntity.roles = [];
    this.memoryDb.set(instrutorEntity.id, instrutorEntity);

    return Promise.resolve(instrutorEntity);
  }
  get(id: number): Promise<Instrutor | null> {
    return Promise.resolve(this.memoryDb.get(id) ?? null);
  }
  getPasswordByRegistro(
    registro: string,
  ): Promise<(Instrutor & { senha: string }) | null> {
    for (const instrutor of this.memoryDb.values()) {
      if (instrutor.registro === registro) {
        return Promise.resolve({
          ...instrutor,
          senha: instrutor.senha,
        });
      }
    }

    return Promise.resolve(null);
  }
}

jest.mock('bcrypt', () => {
  return {
    compare: jest.fn().mockImplementation((a, b) => Promise.resolve(a === b)),
  };
});

describe(InstrutorService.name, () => {
  const instrutorRepositoryMock = new InstrutorRepositoryMock();

  beforeAll(async () => {
    await instrutorRepositoryMock.create({
      nome: 'John Doe',
      especialidade: 'Engenharia de Software',
      registro: '123',
      senha: '123456',
    });
  });

  describe('login', () => {
    it('should login the instructor', async () => {
      const jwtServiceMock = {
        sign: jest.fn().mockReturnValue('batata'),
      } as unknown as JwtService;
      const service = new InstrutorService(
        jwtServiceMock,
        instrutorRepositoryMock,
      );

      const dto: CreateInstrutorDto = {
        nome: 'John Doe',
        especialidade: 'Engenharia de Software',
        registro: '123',
        senha: '123456',
      };

      const result = await service.login(dto);

      expect(result).toEqual({
        jwt: 'batata',
      });
    });

    it('should throw unauthorized if instrutor password is wrong', async () => {
      const jwtServiceMock = {
        sign: jest.fn().mockReturnValue('batata'),
      } as unknown as JwtService;

      const service = new InstrutorService(
        jwtServiceMock,
        instrutorRepositoryMock,
      );

      const dto: CreateInstrutorDto = {
        nome: 'John Doe',
        especialidade: 'Engenharia de Software',
        registro: '123',
        senha: '123',
      };

      const error = await service.login(dto).catch((err) => err as Error);

      expect(error).toBeInstanceOf(UnauthorizedException);
    });

    it('should throw unauthorized if instrutor is not found', async () => {
      const jwtServiceMock = jest.fn().mockReturnValue({});
      const service = new InstrutorService(
        jwtServiceMock as unknown as JwtService,
        instrutorRepositoryMock,
      );

      const dto: CreateInstrutorDto = {
        nome: 'John Doe',
        especialidade: 'Engenharia de Software',
        registro: '456',
        senha: '123456',
      };

      const error = await service.login(dto).catch((err) => err as Error);

      expect(error).toBeInstanceOf(UnauthorizedException);
    });
  });
});
