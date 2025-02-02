import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FileEntity from './entities/file.entity';
import { Repository } from 'typeorm';
import { FileType } from 'src/shared/enum/EFile';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class FileService {
  constructor(@InjectRepository(FileEntity) private fileRepository: Repository<FileEntity>) {}

  async uploadAttachFilesToNote(files: Express.Multer.File[], noteID: string) {
    const uploadedFiles = files.map((file) => 
      this.fileRepository.create({
        id: uuidv4(),
        fileName: file.originalname,
        filePath: file.path,
        fileType: FileType.NOTE_ATTACHMENT,
        size: file.size,
        note: { id: noteID }
      }));

    return await this.fileRepository.save(uploadedFiles);
  }

  async uploadAvatar(file: Express.Multer.File, userID: string) {
    const avatar = await this.fileRepository.create({
      id: uuidv4(),
      fileName: file.originalname,
      filePath: `${file.path}/userID/avatar`,
      fileType: FileType.AVATAR,
      size: file.size,
      userAvatar: { id: userID }
    });

    return await this.fileRepository.save(avatar);
  }
}

