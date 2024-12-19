import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { IResponse } from '../../shared/types/CustomResponse';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:username')
  findUser(@Param('username') username: string): Promise<IResponse> {
    return this.userService.findOne(username);
  }
  
}
