import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { IResponse } from '../../shared/types/CustomResponse';
import { Active } from '../../shared/enum/EUser';
import { FileService } from '../file/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private fileService: FileService, 
  ) {}
  async findOne(username: string): Promise<IResponse> {
    const user = await this.repo.findOne({ 
      where: { username },
      relations: ['avatar', 'thumbnail'],
    });

    const userData = {
      username: user.username,
      thumbnail: user.thumbnail,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      biography: user.biography,
      major: user.major,
      school: user.school,
      groupMemberships: user.groupMemberships,
      created_at: user.created_at
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
      const uploadAvatar = await this.fileService.uploadAvatar(avatar, user.id);
      return {
        code: HttpStatus.OK,
        success: false,
        message: 'USER.UPDATE.AVATAR.SUCCESS',
      }
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'USER.UPDATE.AVATAR.FAIL',
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
        errors: [...error]
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
        errors: [...error]
      }
    }
  }
}
