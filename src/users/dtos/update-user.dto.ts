import { IsEmail, IsOptional, IsString } from 'class-validator';

export class upodateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
