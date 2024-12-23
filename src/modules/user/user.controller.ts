import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IResponse } from '../../shared/types/CustomResponse';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { UserUpdateDTO } from './DTO/user.dto';
import { VerifyUserGuard } from '../../common/guards/auth/verify-user.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard, RoleGuard)
  // @Roles(Role.USER)
  @Get('/:username')
  findUser(@Param('username') username: string): Promise<IResponse> {
    return this.userService.findOne(username);
  }
  
  @UseGuards(AuthGuard, VerifyUserGuard)
  @Put('/:username')
  updateUser(@Body() userUpdateDTO: UserUpdateDTO, @Param('username') username: string) {

  }
}
