import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';
import { UserEntity } from './infrastructure/persistence/entities/user.entity';
import { ExternalServiceClient } from './infrastructure/http/external-service.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    ExternalServiceClient,
  ],
  exports: [UsersService],
})
export class UsersModule {}