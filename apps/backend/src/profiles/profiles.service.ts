import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, asc, or, and } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../database';
import { userProfiles, userMedia, users, families } from '../database/schema';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async createProfile(userId: string, dto: CreateProfileDto) {
    // Check if profile already exists
    const existing = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Profile already exists for this user');
    }

    const [profile] = await this.db
      .insert(userProfiles)
      .values({
        userId,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        age: dto.age,
        role: dto.role,
        height: dto.height || null,
        build: dto.build || null,
        ethnicity: dto.ethnicity || null,
        education: dto.education || null,
        interests: dto.interests || [],
        openness: dto.openness || null,
        conscientiousness: dto.conscientiousness || null,
        extraversion: dto.extraversion || null,
        agreeableness: dto.agreeableness || null,
        neuroticism: dto.neuroticism || null,
      })
      .returning();

    return profile;
  }

  async updateProfile(userId: string, dto: Partial<CreateProfileDto>) {
    const existing = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundException('Profile not found');
    }

    const updateData: Partial<typeof userProfiles.$inferInsert> = {};
    if (dto.firstName) updateData.firstName = dto.firstName.trim();
    if (dto.lastName) updateData.lastName = dto.lastName.trim();
    if (dto.age) updateData.age = dto.age;
    if (dto.role) updateData.role = dto.role;
    if (dto.height !== undefined) updateData.height = dto.height || null;
    if (dto.build !== undefined) updateData.build = dto.build || null;
    if (dto.ethnicity !== undefined) updateData.ethnicity = dto.ethnicity || null;
    if (dto.education !== undefined) updateData.education = dto.education || null;
    if (dto.interests !== undefined) updateData.interests = dto.interests || [];
    if (dto.openness !== undefined) updateData.openness = dto.openness || null;
    if (dto.conscientiousness !== undefined) updateData.conscientiousness = dto.conscientiousness || null;
    if (dto.extraversion !== undefined) updateData.extraversion = dto.extraversion || null;
    if (dto.agreeableness !== undefined) updateData.agreeableness = dto.agreeableness || null;
    if (dto.neuroticism !== undefined) updateData.neuroticism = dto.neuroticism || null;

    const [profile] = await this.db
      .update(userProfiles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();

    return profile;
  }

  async getProfile(userId: string) {
    const [profile] = await this.db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async addMedia(userId: string, filePath: string, mediaType: 'photo' | 'video', sortOrder: number = 0) {
    const [media] = await this.db
      .insert(userMedia)
      .values({
        userId,
        filePath,
        mediaType,
        sortOrder,
      })
      .returning();

    return media;
  }

  async getMedia(userId: string) {
    return this.db
      .select()
      .from(userMedia)
      .where(eq(userMedia.userId, userId))
      .orderBy(asc(userMedia.sortOrder));
  }

  async createPartnerProfile(dto: CreateProfileDto) {
    // Create user without email/password for partner
    const [partnerUser] = await this.db
      .insert(users)
      .values({
        email: null,
        passwordHash: null,
      })
      .returning();

    // Create profile for partner
    const profile = await this.createProfile(partnerUser.id, dto);
    return { user: partnerUser, profile };
  }

  async createFamily(fatherId: string, motherId: string) {
    // Verify both users exist
    const [father] = await this.db.select().from(users).where(eq(users.id, fatherId)).limit(1);
    const [mother] = await this.db.select().from(users).where(eq(users.id, motherId)).limit(1);

    if (!father || !mother) {
      throw new NotFoundException('Father or mother user not found');
    }

    const [family] = await this.db
      .insert(families)
      .values({
        fatherId,
        motherId,
      })
      .returning();

    return family;
  }

  async findFamilyByUserId(userId: string) {
    // Find family where user is either father or mother
    const [family] = await this.db
      .select()
      .from(families)
      .where(or(eq(families.fatherId, userId), eq(families.motherId, userId)))
      .limit(1);

    return family || null;
  }

  async findFamilyByParents(fatherId: string, motherId: string) {
    // Find family by both father and mother IDs
    const [family] = await this.db
      .select()
      .from(families)
      .where(and(eq(families.fatherId, fatherId), eq(families.motherId, motherId)))
      .limit(1);

    return family || null;
  }
}
