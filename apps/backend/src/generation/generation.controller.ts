import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerationService } from './generation.service';
import { GenerateChildDto } from './dto/generate-child.dto';

@Controller('generation')
@UseGuards(JwtAuthGuard)
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  /**
   * Generate a child face from two parent photos
   * POST /generation/child
   * Body: { parent1UserId?: string, parent2UserId?: string, prompt?: string }
   */
  @Post('child')
  async generateChild(@Request() req, @Body() dto: GenerateChildDto) {
    return this.generationService.generateChild(req.user.id, dto);
  }
}
