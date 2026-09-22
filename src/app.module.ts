import { Module } from '@nestjs/common';
import { InstrutorModule } from './instrutor/instrutor.module';
import { AlunoModule } from './aluno/aluno.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './@common/filters/http-exception.filter';
import { BadRequestExceptionFilter } from './@common/filters/bad-request-exception.filter';
import { RoleModule } from './roles/role.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    InstrutorModule,
    AlunoModule,
    RoleModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: seconds(60),
          limit: 10,
        },
      ],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
