import { IsEmail, IsOptional, IsString, Length, MinLength } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";

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

export class ActiveUserDTO {
  @IsString()
  @MinLength(6)
  code: string
}