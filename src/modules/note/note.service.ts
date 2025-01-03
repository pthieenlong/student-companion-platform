import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Note from './entities/note.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { IResponse } from 'src/shared/types/CustomResponse';
import { v4 as uuidv4 } from 'uuid';
import { take } from 'rxjs';
import convertTextToSlug from 'src/shared/utils/textToSlug';

@Injectable()
export class NoteService {
  constructor(@InjectRepository(Note) private noteRepository: Repository<Note>) {

  }

  async createNote(note: Partial<Note>, username: string): Promise<IResponse> {
    try {
      const slug = convertTextToSlug(note.title);
      const exist = await this.noteRepository.findOneBy({ slug });
      if(exist) {
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'NOTE.CREATE.EXISTED'
        }
      } 
      await this.noteRepository.save({...note, slug, createdByUsername: username, id: uuidv4() })
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'NOTE.CREATE.SUCCESS'
      }
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'NOTE.CREATE.FAIL'
      }
    }
  }

  async getAllNotesBy(username: string, page: number = 1, take: number = 10): Promise<IResponse> {
    try {
      const skip = (page - 1) * take;
      const [result, total] = await this.noteRepository.findAndCount({
        where: { createdByUsername: username },
        order: { created_at: "DESC" },
        take,
        skip,
      });
      if(total <= 0) {
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'NOTE.GET.NOT_FOUND'
        }
      }
      const totalPage = Math.ceil(total/take);
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'NOTE.GET.SUCCESS',
        data: {
          limit: take,
          page,
          totalPage,
          totalItem: total,
          item: result
        }
      }
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'NOTE.CREATE.FAIL'
      }
    }
  }

  async getNoteBySlug(slug: string): Promise<IResponse> {
    try {
      const note = await this.noteRepository.findOneBy({ slug });
      if(note) 
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'NOTE.GET.SUCCESS',
          data: note
        }
      else 
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'NOTE.GET.NOT_FOUND',
        }
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'NOTE.GET.FAIL'
      }
    }
  }
}
