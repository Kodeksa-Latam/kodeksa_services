import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardConfigurationEntity } from './card-configuration.entity';
import { CardConfigurationService } from './card-configuration.service';
import { CardConfigurationController } from './card-configuration.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CardConfigurationEntity]),
    forwardRef(() => UserModule), // Prevenir dependencia circular
  ],
  controllers: [CardConfigurationController],
  providers: [CardConfigurationService],
  exports: [CardConfigurationService],
})
export class CardConfigurationModule {}