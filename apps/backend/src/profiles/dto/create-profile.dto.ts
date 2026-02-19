import { IsIn, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength, IsArray } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @IsNumber()
  @Min(18)
  @Max(120)
  age: number;

  @IsIn(['mother', 'father'])
  role: 'mother' | 'father';

  // Questionnaire (all optional)
  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsString()
  build?: string;

  @IsOptional()
  @IsString()
  ethnicity?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  openness?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  conscientiousness?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  extraversion?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  agreeableness?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  neuroticism?: number;
}
