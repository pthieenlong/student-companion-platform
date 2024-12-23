import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserUpdateDTO {
  @IsEmail()
  @IsOptional()
  email: string;
  
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsString()
  @IsOptional()
  biography: string;

  @IsString()
  @IsOptional()
  major: string;
}