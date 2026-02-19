import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { DRIZZLE, DrizzleDB } from '../database';
import { refreshTokens } from '../database/schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(DRIZZLE) private db: DrizzleDB,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // User must have password to login
    if (!user.passwordHash) {
      throw new UnauthorizedException('User account does not have a password set');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    // Don't return password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const tokenRecord = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, refreshToken))
      .limit(1);

    if (tokenRecord.length === 0) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const token = tokenRecord[0];
    if (new Date(token.expiresAt) < new Date()) {
      // Delete expired token
      await this.db.delete(refreshTokens).where(eq(refreshTokens.id, token.id));
      throw new UnauthorizedException('Refresh token expired');
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(token.userId);

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await this.db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken));
  }

  private generateAccessToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload, {
      expiresIn: '15m', // Access token expires in 15 minutes
    });
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Refresh token expires in 30 days

    await this.db.insert(refreshTokens).values({
      userId,
      token,
      expiresAt,
    });

    return token;
  }
}
