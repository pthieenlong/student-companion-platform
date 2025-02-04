import { ArrayNotEmpty, IsArray, IsOptional, IsString } from "class-validator";
import { NoteStatus } from "../../../shared/enum/ENote";
import Tag from '../../tag/entities/tag.entity';
import FileEntity from "../../file/entities/file.entity";

export class CreateNoteDTO {
  @IsString()
  title: string;
  
  @IsString()
  content: string;
  
  @IsArray()
  @ArrayNotEmpty()
  tags: Tag[];

  @IsString()
  @IsOptional()
  thumbnail: string;

  @IsArray()
  @IsOptional()
  files: FileEntity[];


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
  files: FileEntity[];

  @IsString()
  @IsOptional()
  noteStatus: NoteStatus;
}