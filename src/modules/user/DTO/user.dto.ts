import { IsArray, IsEmail, IsOptional, IsString, Length, MinLength } from "class-validator";
import { Match } from "src/common/decorators/match.decorator";
import FileEntity from "src/modules/file/entities/file.entity";

export class UserUpdateDTO {
  @IsEmail()
  @IsOptional()
  email: string;
  
  @IsString()
  @IsOptional()
  phoneNumber: string;

  // @IsString()
  // @IsOptional()
  // avatar: string;

  // @IsString()
  // @IsOptional()
  // thumbnail: string;

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