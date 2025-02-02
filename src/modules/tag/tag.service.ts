import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Tag from './entities/tag.entity';
import { Repository } from 'typeorm';
import convertTextToSlug from 'src/shared/utils/textToSlug';
import { v4 as uuidv4 } from 'uuid';
import { IResponse } from 'src/shared/types/CustomResponse';
@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async createNewTag(name: string): Promise<IResponse> {
    try {
      const slug = convertTextToSlug(name);
      let tag = await this.tagRepository.findOneBy({ slug });
      if(!tag) {

        tag = this.tagRepository.create({ id: uuidv4(), name, slug });
        await this.tagRepository.save(tag);
        return {
          code: HttpStatus.CREATED,
          success: true,
          message: 'TAG.CREATE.SUCCESS',
        }
      } else {
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'TAG.CREATE.EXISTED'
        }
      }
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'TAG.CREATE.FAIL',
        errors: error
      }
    }
  }
  async getAllTag(): Promise<IResponse> {
    try {
      const tags = await this.tagRepository.find();

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'TAG.GET.SUCCESS',
        data: tags
      }
    } 
    catch(error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'TAG.CREATE.FAIL',
        errors: error
      }
    }
  }

  async getTagBySlug(slug: string): Promise<IResponse> {
    try {
      const tag = await this.tagRepository.findOneBy({ slug });

      if(!tag) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'TAG.GET.NOT_FOUND',
        }
      } else {
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'TAG.GET.SUCCESS',
          data: tag
        }
      }
    } catch(error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'TAG.GET.FAIL',
        errors: error
      }
    }
  }
}
