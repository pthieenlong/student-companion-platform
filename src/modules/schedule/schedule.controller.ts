import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { VerifyUserGuard } from '../../common/guards/auth/verify-user.guard';
import { IResponse } from '../../shared/types/CustomResponse';
import { CreateScheduleDTO } from './DTO/schedule.dto';
import CustomRequest from '../../shared/types/CustomRequest';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {

  }

  @UseGuards(AuthGuard, VerifyUserGuard)
  @Get('/:username')
  async getSchedulesByUsername(@Param('username') username: string): Promise<IResponse> {
    return await this.scheduleService.getSchedulesByUsername(username);
  }

  @UseGuards(AuthGuard, VerifyUserGuard)
  @Get('/:username/:id')
  async getScheduleByUsernameAndID(@Param('username') username: string, @Param('id') id: string): Promise<IResponse> {
    return await this.scheduleService.getScheduleByUsernameAndID(username, id);
  } 

  @UseGuards(AuthGuard, VerifyUserGuard)
  @Post('/:username')
  async createSchedule(@Body() body: CreateScheduleDTO, @Param('username') username: string): Promise<IResponse> {
    return await this.scheduleService.createSchedule(body, username)
  }

  @UseGuards(AuthGuard, VerifyUserGuard)
  @Delete('/:username/:id')
  async deleteSchedulesByID(@Param('id') id: string): Promise<IResponse> {
    return await this.scheduleService.deleteSchedulesByID(id);
  }
}
