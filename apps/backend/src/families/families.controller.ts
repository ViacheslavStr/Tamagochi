import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilesService } from '../profiles/profiles.service';

@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async createFamily(@Request() req, @Body() dto: { fatherId: string; motherId: string }) {
    return this.profilesService.createFamily(dto.fatherId, dto.motherId);
  }
}
