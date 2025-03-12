import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import User from '../user/entities/user.entity';
import { IResponse } from '../../shared/types/CustomResponse';
import { getNow } from '../../shared/utils/Time';
@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getScheduleByUsernameAndID(username: string, id: string): Promise<IResponse> {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: {
          'id': id,
          'createdBy': { username }
        }
      });
      if(!schedule) {
        return {
          code: HttpStatus.NOT_FOUND,
          message: 'SCHEDULE.GET.NOT_FOUND',
          success: false
        }
      } else {
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'SCHEDULE.GET.SUCCESS',
          data: schedule
        }
      }
    } catch(error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'SCHEDULE.GET.FAIL',
        errors: error
      }
    }
  }

  async getSchedulesByUsername(username: string): Promise<IResponse> {
    try {
      const schedules = await this.scheduleRepository.find({
        where: {
          'createdBy': { username }
        }
      });
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'SCHEDULE.GET.SUCCESS',
        data: schedules
      }
    } catch(error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'SCHEDULE.GET.FAIL',
        errors: error
      }
    }
  }

  async createSchedule(inputSchedule: Partial<Schedule>, username: string): Promise<IResponse> {
    try {
      const id = uuidv4();
      const user = await this.userRepository.findOne({ 
        where: { username }
      })
      const schedule = this.scheduleRepository.create({ id, ...inputSchedule, createdBy: user });

      await this.scheduleRepository.save(schedule);
      return {
        code: HttpStatus.CREATED,
        success: true,
        message: 'SCHEDULE.CREATE.SUCCESS'
      }
    } 
    catch(error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'SCHEDULE.CREATE.FAIL',
        errors: error
      }
    }
  }

  async updateSchedule(scheduleID: string, inputSchedule: Partial<Schedule>, username: string): Promise<IResponse> {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { id: scheduleID, createdBy: { username } }
      });

      if(!schedule) {
        return {
          code: HttpStatus.NOT_FOUND,
          message: 'SCHEDULE.GET.NOT_FOUND',
          success: false
        }
      } else {
        Object.assign(schedule, inputSchedule);
        schedule.updatedAt = getNow();
        await this.scheduleRepository.save(schedule);
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'SCHEDULE.UPDATE.SUCCESS',
          data: schedule
        }
      }
    } catch(error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'SCHEDULE.UPDATE.FAIL',
        errors: error
      }
    }
  }

  async deleteSchedulesByID(id: string): Promise<IResponse> {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { id }
      });
      if(!schedule) {
        return {
          code: HttpStatus.NOT_FOUND,
          message: 'SCHEDULE.GET.NOT_FOUND',
          success: false
        }
      } else {
        await this.scheduleRepository.softDelete({ id });
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'SCHEDULE.DELETE.SUCCESS',
        }
      }
    } catch(error) {
      console.log(error);
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'SCHEDULE.DELETE.FAIL',
        errors: error
      }
    }
  }
}
