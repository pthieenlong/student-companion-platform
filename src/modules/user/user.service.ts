import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { IResponse } from '../../shared/types/CustomResponse';
import { Active } from '../../shared/enum/EUser';
import { FileService } from '../file/file.service';
import FileEntity from '../file/entities/file.entity';
import { FileType } from '../../shared/enum/EFile';
import { getNow } from '../../shared/utils/Time';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private fileService: FileService,
    @InjectRepository(FileEntity) private fileRepository: Repository<FileEntity>,

  ) {}
  async findOne(username: string): Promise<IResponse> {
    const user = await this.repo.findOne({ 
      where: { username },
      relations: ['avatar', 'thumbnail']
    });

    const thumbnail = user.thumbnail ?{
      id: user.thumbnail?.id,
      fileName: user.thumbnail?.fileName,
      filePath: user.thumbnail?.filePath,
      fileType: user.thumbnail?.fileType,
      created_At: user.thumbnail?.createdAt,
      updated_At: user.thumbnail?.updatedAt,
    } : null;
    
    const avatar = user.avatar ? {
      id: user.avatar.id,
      fileName: user.avatar?.fileName,
      filePath: user.avatar?.filePath,
      fileType: user.avatar?.fileType,
      created_At: user.avatar?.createdAt,
      updated_At: user.avatar?.updatedAt,
    } : null;

    const userData = {
      username: user.username,
      thumbnail: thumbnail,  
      avatar: avatar,
      phoneNumber: user.phoneNumber,
      biography: user.biography,
      major: user.major,
      school: user.school,
      groupMemberships: user.groupMemberships,
      created_at: user.createdAt
    }

    return {
      code: HttpStatus.OK,
      success: true,
      message: 'USER.GET.SUCCESS',
      data: userData
    }
  }
  
  async updateAvatar(username: string, avatar: Express.Multer.File): Promise<IResponse> {
    try {
      const user = await this.repo.findOne({ 
        where: { username },
        relations: ['avatar'],
      });
      const uploadAvatar = await this.fileService.uploadAvatar(avatar, user);
      user.avatar = uploadAvatar;
      user.updatedAt = getNow();
      await this.repo.save(user);
      return {
        code: HttpStatus.OK,
        success: false,
        message: 'USER.UPDATE.AVATAR.SUCCESS',
      }
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'USER.UPDATE.AVATAR.FAIL',
        errors: error
      }
    }
  } 

  async updateThumbnail(username: string, thumbnail: Express.Multer.File): Promise<IResponse> {
    try {
      const user = await this.repo.findOne({ 
        where: { username },
        relations: ['thumbnail'],
      });
      const uploadThumbnail = await this.fileService.uploadThumbnail(thumbnail, user);
      user.thumbnail = uploadThumbnail;
      user.updatedAt = getNow();
      await this.repo.save(user);
      return {
        code: HttpStatus.OK,
        success: false,
        message: 'USER.UPDATE.THUMBNAIL.SUCCESS',
      }
    } catch(error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'USER.UPDATE.THUMBNAIL.FAIL',
        errors: error
      }
    }
  }

  async updateSelf(username: string, userAttrs: Partial<User>): Promise<IResponse> {
    try {
      const user = await this.repo.findOneBy({ username });
      if(!user) {
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'USER.UPDATE.NOT_FOUND'
        }
      }

      Object.assign(user, userAttrs);
      user.updatedAt = getNow();
      await this.repo.save(user);
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'USER.UPDATE.SUCCESS'
      }
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'USER.UPDATE.FAIL',
        errors: error
      }
    }
  }

  async activeUser(username: string): Promise<IResponse>{
    try {
      const user = await this.repo.findOneBy({ username });
      if(!user) {
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'USER.ACTIVE.NOT_FOUND'
        }
      } else {
        user.isActive = Active.ACTIVE;
        await this.repo.save(user);
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'USER.ACTIVE.SUCCESS'
        }
      }
    } catch(error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'USER.ACTIVE.FAIL',
        errors: error
      }
    }
  }
}
