import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DRIZZLE, createDrizzleProvider } from './drizzle.provider';
import type { DrizzleDB } from './drizzle.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE,
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        if (!url) throw new Error('DATABASE_URL is required');
        const { db } = createDrizzleProvider(url);
        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}

// Для инжекта в сервисах: @Inject(DRIZZLE) private db: DrizzleDB
export { DRIZZLE };
export type { DrizzleDB };
