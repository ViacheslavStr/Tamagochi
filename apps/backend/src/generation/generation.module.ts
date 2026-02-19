import { Module } from '@nestjs/common';
import { ReplicateService } from './replicate.service';
import { GenerationController } from './generation.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { ChildrenModule } from '../children/children.module';

@Module({
  imports: [ProfilesModule, ChildrenModule],
  providers: [ReplicateService],
  controllers: [GenerationController],
  exports: [ReplicateService],
})
export class GenerationModule {}
