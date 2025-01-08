import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
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
    console.log(note.tags);
    
    return await this.noteService.createNote(note, username);
  }
  
  @UseGuards(AuthGuard, VerifyUserGuard)
  @Delete('/user/:username/:slug')
  async deleteNode(@Param() param): Promise<IResponse> {
    return await this.noteService.deletePost(param.slug, param.username);
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
  @UseGuards(AuthGuard, VerifyUserGuard)
  async updateNoteBySlug(@Param('slug') slug: string, @Body() body: UpdateNoteDTO) {
    return await this.noteService.updateNoteBySlug(slug, { ...body });
  }

  @Patch('/react/:slug')
  @UseGuards(AuthGuard)
  async reactToNoteWithSlugAndUserId(@Param('slug') slug: string, @Req() request): Promise<IResponse> {
    const userID = request.token?.info?.id;

    return await this.noteService.reactToNoteWithSlugAndUserId(slug, userID);
  }

  
}
