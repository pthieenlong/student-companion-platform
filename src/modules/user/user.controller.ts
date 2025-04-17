import { Body, Controller, Get, Param, Patch, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { IResponse } from '../../shared/types/CustomResponse';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { ActiveUserDTO, UserUpdateDTO } from './DTO/user.dto';
import { VerifyUserGuard } from '../../common/guards/auth/verify-user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_PATH } from '../../shared/constants/const';
import * as fs from 'fs';
import * as path from "path";
import { RedisService } from '../../redis/redis.service';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly redisService: RedisService,
    
  ) {}

  // @UseGuards(AuthGuard)
  @Get('/:username')
  async findUser(@Param('username') username: string): Promise<IResponse> {
    const cacheKey = `user:${username}`;
    const cachedUser = await this.redisService.get(cacheKey);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.userService.findOne(username);
    await this.redisService.set(cacheKey, JSON.stringify(user), 60 * 60);
    return user;
  }
  
  @UseGuards(AuthGuard, VerifyUserGuard)
  @Put('/:username')
  updateUser(@Body() userUpdateDTO: UserUpdateDTO, @Param('username') username: string) {
    return this.userService.updateSelf(username, userUpdateDTO);
  }

  activeUser(@Body() activeUserDTO: ActiveUserDTO, @Param('username') username: string) {
    return this.userService.activeUser(username);
  }

  @UseGuards(AuthGuard, VerifyUserGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const username = req.body.username;
        const userDir = path.join(FILE_PATH, username, 'self');

        if(!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
        }

        callback(null, userDir);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = `AVATAR-${Date.now()}-${file.originalname}`;
        callback(null, uniqueSuffix);
      }
    })
  }))
  @Patch('/:username/avatar')
  updateUserAvatar(@Param('username') username: string, @UploadedFile() avatar: Express.Multer.File): Promise<IResponse> {
    return this.userService.updateAvatar(username, avatar);
  }
  
  @UseGuards(AuthGuard, VerifyUserGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, callback) => {
        const username = req.body.username;
        const userDir = path.join(FILE_PATH, username, 'self');

        if(!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
        }

        callback(null, userDir);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = `THUMBNAIL-${Date.now()}-${file.originalname}`;
        callback(null, uniqueSuffix);
      }
    })
  }))
  @Patch('/:username/thumbnail')
  updateUserThumbnail(@Param('username') username: string, @UploadedFile() thumbnail: Express.Multer.File): Promise<IResponse> {
    return this.userService.updateThumbnail(username, thumbnail);
  }
}
