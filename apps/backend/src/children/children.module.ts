import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';

@Module({
  imports: [DatabaseModule, ProfilesModule],
  providers: [ChildrenService],
  controllers: [ChildrenController],
  exports: [ChildrenService],
})
export class ChildrenModule {}
