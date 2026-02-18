import { IsEmail, IsIn, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateUserDto {
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

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
