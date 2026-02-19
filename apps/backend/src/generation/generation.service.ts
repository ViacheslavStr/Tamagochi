import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { ReplicateService } from './replicate.service';
import { ProfilesService } from '../profiles/profiles.service';
import { ChildrenService } from '../children/children.service';
import { GenerateChildDto } from './dto/generate-child.dto';

export type GenerateChildResult = {
  success: true;
  child: { id: string; familyId: string; name: string | null };
  media: { id: string; filePath: string; mediaType: string; [key: string]: unknown };
  generatedImageUrl: string;
};

@Injectable()
export class GenerationService {
  private readonly logger = new Logger(GenerationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly replicateService: ReplicateService,
    private readonly profilesService: ProfilesService,
    private readonly childrenService: ChildrenService,
  ) {}

  async generateChild(currentUserId: string, dto: GenerateChildDto): Promise<GenerateChildResult> {
    if (!this.replicateService.isAvailable()) {
      throw new BadRequestException('Replicate API is not configured');
    }

    const { fatherId, motherId } = await this.resolveParentIds(currentUserId, dto);
    const { parent1ImageUrl, parent2ImageUrl } = await this.getParentImageUrls(fatherId, motherId);

    this.logger.log(
      `Generating child face from: ${parent1ImageUrl} and ${parent2ImageUrl}`,
    );

    const generatedImageUrl = await this.replicateService.generateChildFace(
      parent1ImageUrl,
      parent2ImageUrl,
      dto.prompt,
    );

    const family = await this.getFamily(fatherId, motherId);
    const child = await this.findOrCreateChild(family.id);

    const downloadedFilePath = await this.downloadAndSaveImage(generatedImageUrl, child.id);

    const savedMedia = await this.childrenService.addChildMedia(
      child.id,
      downloadedFilePath,
      'photo',
      {
        generationPrompt: dto.prompt || null,
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

  private async resolveParentIds(
    currentUserId: string,
    dto: GenerateChildDto,
  ): Promise<{ fatherId: string; motherId: string }> {
    if (dto.parent1UserId && dto.parent2UserId) {
      return { fatherId: dto.parent1UserId, motherId: dto.parent2UserId };
    }

    const family = await this.profilesService.findFamilyByUserId(currentUserId);
    if (!family) {
      throw new BadRequestException(
        'No family found. Please provide parent1UserId and parent2UserId, or create a family first.',
      );
    }
    return { fatherId: family.fatherId, motherId: family.motherId };
  }

  private async getParentImageUrls(
    fatherId: string,
    motherId: string,
  ): Promise<{ parent1ImageUrl: string; parent2ImageUrl: string }> {
    const [parent1Media, parent2Media] = await Promise.all([
      this.profilesService.getMedia(fatherId),
      this.profilesService.getMedia(motherId),
    ]);

    const parent1Photos = parent1Media.filter((m) => m.mediaType === 'photo');
    const parent2Photos = parent2Media.filter((m) => m.mediaType === 'photo');

    if (parent1Photos.length === 0 || parent2Photos.length === 0) {
      throw new BadRequestException(
        'Both parents must have at least one photo uploaded',
      );
    }

    const baseUrl = this.configService.get<string>('BACKEND_URL') || 'http://localhost:3300';

    const toAbsoluteUrl = (filePath: string) =>
      filePath.startsWith('http') ? filePath : `${baseUrl}${filePath}`;

    return {
      parent1ImageUrl: toAbsoluteUrl(parent1Photos[0].filePath),
      parent2ImageUrl: toAbsoluteUrl(parent2Photos[0].filePath),
    };
  }

  private async getFamily(fatherId: string, motherId: string) {
    const family = await this.profilesService.findFamilyByParents(fatherId, motherId);
    if (!family) {
      throw new BadRequestException(
        'No family found for these parents. Complete onboarding first to create a family.',
      );
    }
    return family;
  }

  private async findOrCreateChild(familyId: string) {
    let child = await this.childrenService.getChildByFamilyId(familyId);
    if (!child) {
      child = await this.childrenService.createChild(familyId);
    }
    return child;
  }

  private downloadAndSaveImage(imageUrl: string, childId: string): Promise<string> {
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
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          reject(err);
        });
    });
  }
}
