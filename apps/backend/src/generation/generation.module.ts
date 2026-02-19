import { Module } from '@nestjs/common';
import { ReplicateService } from './replicate.service';
import { GenerationService } from './generation.service';
import { GenerationController } from './generation.controller';
import { ProfilesModule } from '../profiles/profiles.module';
import { ChildrenModule } from '../children/children.module';

@Module({
  imports: [ProfilesModule, ChildrenModule],
  providers: [ReplicateService, GenerationService],
  controllers: [GenerationController],
  exports: [ReplicateService, GenerationService],
})
export class GenerationModule {}
