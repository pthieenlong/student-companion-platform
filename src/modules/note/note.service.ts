import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Note from './entities/note.entity';
import { In, Repository } from 'typeorm';
import { IResponse } from 'src/shared/types/CustomResponse';
import { v4 as uuidv4 } from 'uuid';
import convertTextToSlug from 'src/shared/utils/textToSlug';
import React from '../react/entities/react.entity';
import User from '../user/entities/user.entity';
import { TagService } from '../tag/tag.service';
import Tag from '../tag/entities/tag.entity';
import { getNow } from 'src/shared/utils/Time';
import FileEntity from '../file/entities/file.entity';
import { FileService } from '../file/file.service';
@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(React) private reactRepository: Repository<React>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(FileEntity) private fileRepository: Repository<FileEntity>,
    private tagService: TagService,
    private fileService: FileService,
  ) {  }

  async createNote(note: Partial<Note>, username: string, files?: Express.Multer.File[]): Promise<IResponse> {
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

      const tags = note.tags.map((tag) => (tag));
      const existingTags = await this.tagRepository.find({ 
        where: { slug: In(tags) }
      })
      if(files && files.length > 0) {
        await this.fileService.uploadAttachFilesToNote(files, note.id);
      }
      const newNote = await this.noteRepository.save({...note, tags: existingTags, slug, createdByUsername: username, id: uuidv4() })
      return {
        code: HttpStatus.CREATED,
        success: true,
        message: 'NOTE.CREATE.SUCCESS',
        data: {
          title: newNote.title,
          slug: newNote.slug,
          thumbnail: newNote.thumbnail,
          content: newNote.content,
          noteStatus: newNote.noteStatus,
          createdByUsername: newNote.createdByUsername,
          likeCount: newNote.likeCount,
          tags: newNote.tags.map(tag => { return { name: tag.name, slug: tag.slug }}),
          files: note.files?.map(file => { return { name: file.fileName, path: file.filePath }}),
          created_at: newNote.created_at,
          updated_at: newNote.updated_at,
        }
      }
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'NOTE.CREATE.FAIL',
        errors: error
      }
    }
  }

  async getAllNotesByUsername(username: string, page: number = 1, take: number = 10): Promise<IResponse> {
    try {
      const skip = (page - 1) * take;
      const [result, total] = await this.noteRepository.findAndCount({
        where: { createdByUsername: username },
        relations:['tags', 'files'],
        order: { created_at: "DESC" },
        take,
        skip,
      });
      if(total < 0) {
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'NOTE.GET.NOT_FOUND'
        }
      }
      const totalPage = Math.ceil(total/take);
      const data = result.map((note) => {
        return {
          title: note.title,
          slug: note.slug,
          thumbnail: note.thumbnail,
          content: note.content,
          noteStatus: note.noteStatus,
          createdByUsername: note.createdByUsername,
          likeCount: note.likeCount,
          tags: note.tags?.map(tag => { return { name: tag.name, slug: tag.slug }}),
          files: note.files?.map(file => { return { name: file.fileName, path: file.filePath }}),
          created_at: note.created_at,
          updated_at: note.updated_at,
        }
      })
      return {
        code: HttpStatus.OK,
        success: true,
        message: 'NOTE.GET.SUCCESS',
        data: {
          limit: take,
          page,
          totalPage,
          totalItem: total,
          item: data
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
      const note = await this.noteRepository.findOne({
        where: { slug },
        relations: ['files', 'comments']
      });
      
      if(note) 
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'NOTE.GET.SUCCESS',
          data: {
            title: note.title,
            slug: note.slug,
            thumbnail: note.thumbnail,
            content: note.content,
            noteStatus: note.noteStatus,
            createdByUsername: note.createdByUsername,
            likeCount: note.likeCount,
            tags: note.tags?.map(tag => { return { name: tag.name, slug: tag.slug }}),
            comments: [],//note.comments,
            files: note.files?.map(file => { return { fileName: file.fileName, filePath: file.filePath, fileType: file.fileType,}}),
            created_at: note.created_at,
            updated_at: note.updated_at,
          }
        }
      else 
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'NOTE.GET.NOT_FOUND',
        }
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'NOTE.GET.FAIL',
        errors: error
      }
    }
  }

  async updateNoteBySlug(slug: string, noteAttr: Partial<Note>, files?: Express.Multer.File[]): Promise<IResponse>{
    try {
      const note = await this.noteRepository.findOne({
        where: { slug },
        relations: ['files'],
      });
      if(!note) {
        return {
          code: HttpStatus.CONFLICT,
          success: false,
          message: 'NOTE.GET.NOT_FOUND',
        }
      }

      if(files && files.length > 0) {
        if(note.files.length > 0) {
          note.files.map(async (file) => {
            await this.fileRepository.delete({ id: file.id })
          })
        } 
        await this.fileService.uploadAttachFilesToNote(files, note.id);
      }

      if(noteAttr.title) {
        const newSlug = convertTextToSlug(noteAttr.title);
        const isExist = await this.noteRepository.findOneBy({ slug: newSlug });
        if(isExist) {
          return {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'NOTE.GET.EXIST_TITLE',
          }
        } else {
          await this.noteRepository.update( { slug },{ ...noteAttr, updated_at: getNow(), slug: newSlug });
          return {
            code: HttpStatus.OK,
            success: true,
            message: 'NOTE.UPDATE.SUCCESS',
          }
        }
      } else {
        await this.noteRepository.update( { slug },{ ...noteAttr, updated_at: getNow() });
          return {
            code: HttpStatus.OK,
            success: true,
            message: 'NOTE.UPDATE.SUCCESS',
          }
      }
    } catch (error) {
      console.log(error);
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'NOTE.UPDATE.FAIL'
      }
    }
  }

  async reactToNoteWithSlugAndUserId(slug: string, userID: string): Promise<IResponse> {
    try {
      const note = await this.noteRepository.findOneBy({ slug });
      const user = await this.userRepository.findOneBy( { id: userID });

      if(!note) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'NOTE.GET.NOT_FOUND'
        }
      }

      if(!user) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'USER.GET.NOT_FOUND'
        }
      }

      const existingReact = await this.reactRepository.findOne({
        where: { user: { id: userID }, note: { slug }}
      });

      if(existingReact) {
        await this.reactRepository.delete(existingReact.id);
        note.likeCount--;
        await this.noteRepository.save(note);
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'REACT.REMOVE.SUCCESS'
        }
      } else {
        const react = this.reactRepository.create({ id: uuidv4(), user, note });
        await this.reactRepository.save(react);
        note.likeCount++;
        await this.noteRepository.save(note);
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'REACT.ADD.SUCCESS'
        }
      }
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'REACT.ADD.FAIL'
      }
    }
  }

  async deleteNote(slug: string, username: string): Promise<IResponse> {
    try {

      const deletedNote = await this.noteRepository.findOneBy({ slug, createdByUsername: username });
      if(deletedNote) {
        await this.noteRepository.softDelete({ slug, createdByUsername: username });
        return {
          code: HttpStatus.OK,
          success: true,
          message: 'NOTE.DELETE.SUCCESS'
        }
      } else {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'NOTE.DELETE.FAIL'
        }
      }
    } catch (error) {
      return {
        code: HttpStatus.CONFLICT,
        success: false,
        message: 'NOTE.DELETE.FAIL',
        errors: error
      }
    }
  }
}
