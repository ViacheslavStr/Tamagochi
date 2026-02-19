import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, asc } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../database';
import { children, childMedia, families } from '../database/schema';

@Injectable()
export class ChildrenService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /**
   * Create a new child for a family
   */
  async createChild(familyId: string, name?: string) {
    const [child] = await this.db
      .insert(children)
      .values({
        familyId,
        name: name || null,
      })
      .returning();

    return child;
  }

  /**
   * Get all children for a family
   */
  async getChildrenByFamilyId(familyId: string) {
    return this.db
      .select()
      .from(children)
      .where(eq(children.familyId, familyId))
      .orderBy(asc(children.createdAt));
  }

  /**
   * Get a child by ID
   */
  async getChildById(childId: string) {
    const [child] = await this.db
      .select()
      .from(children)
      .where(eq(children.id, childId))
      .limit(1);

    if (!child) {
      throw new NotFoundException('Child not found');
    }

    return child;
  }

  /**
   * Get child by family ID (for cases where there's only one child per family)
   */
  async getChildByFamilyId(familyId: string) {
    const [child] = await this.db
      .select()
      .from(children)
      .where(eq(children.familyId, familyId))
      .limit(1);

    return child || null;
  }

  /**
   * Add media (photo/video) for a child
   */
  async addChildMedia(
    childId: string,
    filePath: string,
    mediaType: 'photo' | 'video',
    options?: {
      ageVariant?: string;
      generationPrompt?: string;
      metadata?: Record<string, unknown>;
      sortOrder?: number;
    },
  ) {
    const [media] = await this.db
      .insert(childMedia)
      .values({
        childId,
        filePath,
        mediaType,
        ageVariant: options?.ageVariant || null,
        generationPrompt: options?.generationPrompt || null,
        metadata: options?.metadata || null,
        sortOrder: options?.sortOrder || 0,
      })
      .returning();

    return media;
  }

  /**
   * Get all media for a child
   */
  async getChildMedia(childId: string) {
    return this.db
      .select()
      .from(childMedia)
      .where(eq(childMedia.childId, childId))
      .orderBy(asc(childMedia.sortOrder), asc(childMedia.createdAt));
  }

  /**
   * Get child with all media
   */
  async getChildWithMedia(childId: string) {
    const child = await this.getChildById(childId);
    const media = await this.getChildMedia(childId);

    return {
      ...child,
      media,
    };
  }

  /**
   * Update child name
   */
  async updateChildName(childId: string, name: string) {
    const [updated] = await this.db
      .update(children)
      .set({ name, updatedAt: new Date() })
      .where(eq(children.id, childId))
      .returning();

    if (!updated) {
      throw new NotFoundException('Child not found');
    }

    return updated;
  }
}
