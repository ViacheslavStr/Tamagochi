import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { FamiliesController } from '../families/families.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController, FamiliesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
