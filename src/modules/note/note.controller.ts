import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { IResponse } from '../../shared/types/CustomResponse';
import { NoteService } from './note.service';
import { CreateNoteDTO, UpdateNoteDTO } from './DTO/note.dto';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { VerifyUserGuard } from '../../common/guards/auth/verify-user.guard';

@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @UseGuards(AuthGuard, VerifyUserGuard)
  @Post('/user/:username/create-note')
  async createNote(@Body() body: CreateNoteDTO, @Param('username') username: string): Promise<IResponse> {
    const note = { ...body }
    return await this.noteService.createNote(note, username);
  }

  @Get('/user/:username')
  async getAllNotesBy(@Param('username') username: string, @Query('page') page: string = '1', @Query('take') take: string = '10'): Promise<IResponse> {
    return await this.noteService.getAllNotesBy(username, parseInt(page), parseInt(take));
  }

  @Get('/:slug')
  async getNoteBySlug(@Param('slug') slug: string): Promise<IResponse> {
    return await this.noteService.getNoteBySlug(slug)
  }

  @Patch('/:slug')
  async updateNoteBySlug(@Param('slug') slug: string, @Body() body: UpdateNoteDTO) {
    
  }
}
