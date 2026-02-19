import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Replicate from 'replicate';

@Injectable()
export class ReplicateService {
  private readonly logger = new Logger(ReplicateService.name);
  private replicate: Replicate;

  constructor(private configService: ConfigService) {
    const apiToken = this.configService.get<string>('REPLICATE_API_TOKEN');
    if (!apiToken) {
      this.logger.warn('REPLICATE_API_TOKEN is not set. Replicate features will be disabled.');
      return;
    }
    this.replicate = new Replicate({ auth: apiToken });
  }

  /**
   * Generate a child face from two parent photos using Replicate
   * Uses easel/ai-avatars model which supports 1-2 input images
   * @param parent1ImageUrl URL to first parent's photo
   * @param parent2ImageUrl URL to second parent's photo
   * @param prompt Optional prompt describing the desired child appearance
   * @returns URL to generated child image
   */
  async generateChildFace(
    parent1ImageUrl: string,
    parent2ImageUrl: string,
    prompt?: string,
  ): Promise<string> {
    if (!this.replicate) {
      throw new Error('Replicate API token is not configured');
    }

    try {
      this.logger.log(`Generating child face from two parent photos...`);

      // Using easel/ai-avatars model which accepts 1-2 face images
      // For child generation, we'll use both parent images
      const defaultPrompt =
        prompt ||
        'a realistic child portrait, natural lighting, high quality photo';
      
      const output = await this.replicate.run('easel/ai-avatars', {
        input: {
          prompt: defaultPrompt,
          face_image: parent1ImageUrl,
          face_image_b: parent2ImageUrl, // Second parent's photo
          user_gender: 'neutral', // Neutral gender for child generation
        },
      });

      // The output is a FileOutput object with a url() method
      if (output && typeof output === 'object' && 'url' in output) {
        const imageUrl = (output as any).url();
        this.logger.log(`Child face generated successfully: ${imageUrl}`);
        return imageUrl;
      }

      // Fallback: if output is a string URL
      if (typeof output === 'string') {
        this.logger.log(`Child face generated successfully: ${output}`);
        return output;
      }

      throw new Error('Unexpected output format from Replicate');
    } catch (error) {
      this.logger.error(
        `Failed to generate child face: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to generate child face: ${error.message}`);
    }
  }

  /**
   * Check if Replicate is configured and available
   */
  isAvailable(): boolean {
    return !!this.replicate;
  }
}
