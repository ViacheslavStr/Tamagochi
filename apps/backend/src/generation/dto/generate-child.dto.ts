import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GenerateChildDto {
  @IsOptional()
  @IsUUID()
  parent1UserId?: string;

  @IsOptional()
  @IsUUID()
  parent2UserId?: string;

  @IsOptional()
  @IsString()
  prompt?: string;
}
