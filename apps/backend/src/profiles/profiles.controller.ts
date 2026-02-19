import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import * as path from 'path';
import * as fs from 'fs';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  async createProfile(@Request() req, @Body() dto: CreateProfileDto) {
    const userId = req.user.id;
    return this.profilesService.createProfile(userId, dto);
  }

  @Put()
  async updateProfile(@Request() req, @Body() dto: Partial<CreateProfileDto>) {
    const userId = req.user.id;
    return this.profilesService.updateProfile(userId, dto);
  }

  @Get()
  async getProfile(@Request() req) {
    const userId = req.user.id;
    return this.profilesService.getProfile(userId);
  }

  @Post('media')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: './uploads',
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    }),
  )
  async uploadMedia(
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('mediaType') mediaType: 'photo' | 'video',
    @Body('userId') targetUserId?: string, // Optional: for partner media upload
  ) {
    const userId = targetUserId || req.user.id;
    const uploadsDir = './uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = path.extname(file.originalname);
      const fileName = `${userId}-${Date.now()}-${i}${ext}`;
      const filePath = path.join(uploadsDir, fileName);

      // Move file from temp to permanent location
      fs.renameSync(file.path, filePath);

      const media = await this.profilesService.addMedia(userId, `/uploads/${fileName}`, mediaType, i);
      results.push(media);
    }

    return results;
  }

  @Get('media')
  async getMedia(@Request() req) {
    const userId = req.user.id;
    return this.profilesService.getMedia(userId);
  }

  @Post('partner')
  async createPartnerProfile(@Request() req, @Body() dto: CreateProfileDto) {
    // Create a user without email/password for partner, then create profile
    return this.profilesService.createPartnerProfile(dto);
  }
}
