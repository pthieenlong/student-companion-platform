import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FileEntity from './entities/file.entity';
import { Repository } from 'typeorm';
import { FileType } from 'src/shared/enum/EFile';
import { v4 as uuidv4 } from 'uuid';
import User from '../user/entities/user.entity';
@Injectable()
export class FileService {
  constructor(@InjectRepository(FileEntity) private fileRepository: Repository<FileEntity>, @InjectRepository(User) private userRepository: Repository<User>) {}

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

  async uploadAvatar(file: Express.Multer.File, user: User) { 
    const fs = require('fs');
    let avatar = await this.fileRepository.findOne({
      where: { 
        userAvatar: { id: user.id }
      }
    })
    if(avatar) {
      if(fs.existsSync(avatar.filePath)) {
        fs.unlinkSync(avatar.filePath);
      }
      avatar.fileName = file.originalname;
      avatar.filePath = file.path;
      avatar.fileType = FileType.AVATAR;
      avatar.size = file.size;
    } else {
      avatar = this.fileRepository.create({
        id: uuidv4(),
        fileName: file.originalname,
        filePath: file.path,
        fileType: FileType.AVATAR,
        size: file.size,
        userAvatar: { id: user.id },
      });
    }

    user.avatar = avatar;

    await this.userRepository.save(user);
    return await this.fileRepository.save(avatar);
  }
  async uploadThumbnail(file: Express.Multer.File, user: User) { 
    const fs = require('fs');
    let thumbnail = await this.fileRepository.findOne({
      where: { 
        userThumbnail: { id: user.id }
      }
    });

    if(thumbnail) {
      if(fs.existsSync(thumbnail.filePath)) {
        fs.unlinkSync(thumbnail.filePath);
      }
      thumbnail.fileName = file.originalname;
      thumbnail.filePath = file.path;
      thumbnail.fileType = FileType.THUMBNAIL;
      thumbnail.size = file.size;
    } else {
      thumbnail = this.fileRepository.create({
        id: uuidv4(),
        fileName: file.originalname,
        filePath: file.path,
        fileType: FileType.THUMBNAIL,
        size: file.size,
        userAvatar: { id: user.id },
      });
    }

    user.avatar = thumbnail;

    await this.userRepository.save(user);
    return await this.fileRepository.save(thumbnail);
  }
}


