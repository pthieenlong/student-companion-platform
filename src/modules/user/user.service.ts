import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { IResponse } from '../../shared/types/CustomResponse';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {

  }
  async findOne(username: string): Promise<IResponse> {
    const user = await this.repo.findOneBy({ username });

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
}
