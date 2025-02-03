import { Body, Controller, Get, Param, Patch, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { IResponse } from '../../shared/types/CustomResponse';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { ActiveUserDTO, UserUpdateDTO } from './DTO/user.dto';
import { VerifyUserGuard } from '../../common/guards/auth/verify-user.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_PATH } from '../../shared/constants/const';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(AuthGuard)
  @Get('/:username')
  findUser(@Param('username') username: string): Promise<IResponse> {
    return this.userService.findOne(username);
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
        callback(null, FILE_PATH);
      },
      filename: (req, file, callback) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        callback(null, uniqueSuffix);
      }
    })
  }))
  @UseGuards(AuthGuard, VerifyUserGuard)
  @Patch('/:username/avatar')
  updateUserAvatar(@Param('username') username: string, @UploadedFile() avatar: Express.Multer.File): Promise<IResponse> {
    console.log(avatar);
    
    return this.userService.updateAvatar(username, avatar);
  }
}
