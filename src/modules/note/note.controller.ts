import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { IResponse } from '../../shared/types/CustomResponse';
import { NoteService } from './note.service';
import { CreateNoteDTO, UpdateNoteDTO } from './DTO/note.dto';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { VerifyUserGuard } from '../../common/guards/auth/verify-user.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FILE_PATH } from 'src/shared/constants/const';
@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @UseGuards(AuthGuard, VerifyUserGuard)
  @UseInterceptors(FilesInterceptor('file', 3, {
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
  @Post('/user/:username/create-note')
  async createNote(@Body() body: CreateNoteDTO, @Param('username') username: string, @UploadedFiles() files?: Express.Multer.File[]): Promise<IResponse> {
    const note = { ...body }
    return await this.noteService.createNote(note, username, files ? files : null);
  }
  
  @UseGuards(AuthGuard, VerifyUserGuard)
  @Delete('/user/:username/:slug')
  async deleteNote(@Param() param): Promise<IResponse> {
    return await this.noteService.deleteNote(param.slug, param.username);
  }

  @Get('/user/:username')
  async getAllNotesByUsername(@Param('username') username: string, @Query('page') page: string = '1', @Query('take') take: string = '10'): Promise<IResponse> {
    return await this.noteService.getAllNotesByUsername(username, parseInt(page), parseInt(take));
  }

  @Get('/:slug')
  async getNoteBySlug(@Param('slug') slug: string): Promise<IResponse> {
    return await this.noteService.getNoteBySlug(slug)
  }

  @Patch('/:slug')
  @UseInterceptors(FilesInterceptor('file', 3, {
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
  @UseGuards(AuthGuard)
  async updateNoteBySlug(@Param('slug') slug: string, @Body() body: UpdateNoteDTO,  @UploadedFiles() files?: Express.Multer.File[]) {
    return await this.noteService.updateNoteBySlug(slug, { ...body }, files ? files : null);
  }

  @Patch('/react/:slug')
  @UseGuards(AuthGuard)
  async reactToNoteWithSlugAndUserId(@Param('slug') slug: string, @Req() request): Promise<IResponse> {
    const userID = request.token?.info?.id;

    return await this.noteService.reactToNoteWithSlugAndUserId(slug, userID);
  }

  
}
