import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChildrenService } from './children.service';
import { ProfilesService } from '../profiles/profiles.service';

@Controller('children')
@UseGuards(JwtAuthGuard)
export class ChildrenController {
  constructor(
    private readonly childrenService: ChildrenService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * Get all children for current user's family
   * GET /children
   */
  @Get()
  async getChildren(@Request() req) {
    const userId = req.user.id;

    // Find family for current user
    const family = await this.profilesService.findFamilyByUserId(userId);
    if (!family) {
      throw new NotFoundException('No family found for current user');
    }

    return this.childrenService.getChildrenByFamilyId(family.id);
  }

  /**
   * Get a specific child by ID
   * GET /children/:childId
   */
  @Get(':childId')
  async getChild(@Param('childId') childId: string) {
    return this.childrenService.getChildWithMedia(childId);
  }

  /**
   * Get media for a child
   * GET /children/:childId/media
   */
  @Get(':childId/media')
  async getChildMedia(@Param('childId') childId: string) {
    return this.childrenService.getChildMedia(childId);
  }

  /**
   * Update child name
   * PUT /children/:childId/name
   */
  @Put(':childId/name')
  async updateChildName(
    @Param('childId') childId: string,
    @Body('name') name: string,
  ) {
    return this.childrenService.updateChildName(childId, name);
  }
}
