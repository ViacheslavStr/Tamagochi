import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReplicateService } from './replicate.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ChildrenService } from '../children/children.service';
import { GenerateChildDto } from './dto/generate-child.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

@Controller('generation')
@UseGuards(JwtAuthGuard)
export class GenerationController {
  private readonly logger = new Logger(GenerationController.name);

  constructor(
    private readonly replicateService: ReplicateService,
    private readonly profilesService: ProfilesService,
    private readonly childrenService: ChildrenService,
  ) {}

  /**
   * Generate a child face from two parent photos
   * POST /generation/child
   * Body: { parent1UserId?: string, parent2UserId?: string, prompt?: string }
   */
  @Post('child')
  async generateChild(@Request() req, @Body() dto: GenerateChildDto) {
    const { parent1UserId, parent2UserId, prompt } = dto;
    if (!this.replicateService.isAvailable()) {
      throw new BadRequestException('Replicate API is not configured');
    }

    const currentUserId = req.user.id;

    // If no user IDs provided, use current user and their partner
    let fatherId: string;
    let motherId: string;

    if (parent1UserId && parent2UserId) {
      // Use provided user IDs
      fatherId = parent1UserId;
      motherId = parent2UserId;
    } else {
      // Try to find family for current user
      const family = await this.profilesService.findFamilyByUserId(currentUserId);
      if (!family) {
        throw new BadRequestException(
          'No family found. Please provide parent1UserId and parent2UserId, or create a family first.',
        );
      }
      // Use the family's father and mother IDs
      fatherId = family.fatherId;
      motherId = family.motherId;
    }

    // Get media (photos) for both parents
    const parent1Media = await this.profilesService.getMedia(fatherId);
    const parent2Media = await this.profilesService.getMedia(motherId);

    const parent1Photos = parent1Media.filter((m) => m.mediaType === 'photo');
    const parent2Photos = parent2Media.filter((m) => m.mediaType === 'photo');

    if (parent1Photos.length === 0 || parent2Photos.length === 0) {
      throw new BadRequestException(
        'Both parents must have at least one photo uploaded',
      );
    }

    // Use first photo from each parent
    const parent1PhotoPath = parent1Photos[0].filePath;
    const parent2PhotoPath = parent2Photos[0].filePath;

    // Convert local file paths to URLs
    // Assuming backend runs on localhost:3300 and serves static files from /uploads
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:3300';
    const parent1ImageUrl = parent1PhotoPath.startsWith('http')
      ? parent1PhotoPath
      : `${baseUrl}${parent1PhotoPath}`;
    const parent2ImageUrl = parent2PhotoPath.startsWith('http')
      ? parent2PhotoPath
      : `${baseUrl}${parent2PhotoPath}`;

    this.logger.log(
      `Generating child face from: ${parent1ImageUrl} and ${parent2ImageUrl}`,
    );

    // Generate child face using Replicate
    const generatedImageUrl = await this.replicateService.generateChildFace(
      parent1ImageUrl,
      parent2ImageUrl,
      prompt,
    );

    // Find or create family for these parents
    let family = await this.profilesService.findFamilyByParents(fatherId, motherId);
    if (!family) {
      // If family doesn't exist, create it
      family = await this.profilesService.createFamily(fatherId, motherId);
    }

    // Check if child already exists for this family
    let child = await this.childrenService.getChildByFamilyId(family.id);
    if (!child) {
      // Create a new child record
      child = await this.childrenService.createChild(family.id);
    }

    // Download the generated image and save it locally
    const downloadedFilePath = await this.downloadAndSaveImage(
      generatedImageUrl,
      child.id, // Use child.id for filename
    );

    // Save to child_media table
    const savedMedia = await this.childrenService.addChildMedia(
      child.id,
      downloadedFilePath,
      'photo',
      {
        generationPrompt: prompt || null,
        metadata: {
          model: 'easel/ai-avatars',
          parent1UserId: fatherId,
          parent2UserId: motherId,
          generatedImageUrl,
        },
      },
    );

    return {
      success: true,
      child: {
        id: child.id,
        familyId: child.familyId,
        name: child.name,
      },
      media: savedMedia,
      generatedImageUrl,
    };
  }

  /**
   * Download image from URL and save it locally
   */
  private async downloadAndSaveImage(
    imageUrl: string,
    childId: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadsDir = './uploads';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
      const fileName = `child-${childId}-${Date.now()}${ext}`;
      const filePath = path.join(uploadsDir, fileName);
      const file = fs.createWriteStream(filePath);

      const client = imageUrl.startsWith('https') ? https : http;

      client
        .get(imageUrl, (response) => {
          if (response.statusCode !== 200) {
            reject(
              new Error(
                `Failed to download image: ${response.statusCode} ${response.statusMessage}`,
              ),
            );
            return;
          }

          response.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve(`/uploads/${fileName}`);
          });
        })
        .on('error', (err) => {
          fs.unlinkSync(filePath); // Delete the file on error
          reject(err);
        });
    });
  }
}
