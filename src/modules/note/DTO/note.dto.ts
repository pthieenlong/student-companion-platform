import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateNoteDTO {
  @IsString()
  title: string;
  
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsArray()
  @IsOptional()
  files: string[];
}

export class UpdateNoteDTO {
  @IsString()
  @IsOptional()
  title: string;
  
  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsArray()
  @IsOptional()
  files: string[];
}