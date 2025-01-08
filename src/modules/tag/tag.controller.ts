import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { CreateTagDTO } from './dto/tag.dto';
import { RoleGuard } from '../../common/guards/role/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../shared/enum/EUser';
import { IResponse } from 'src/shared/types/CustomResponse';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @Post() 
  async createNewTag(@Body() body: CreateTagDTO): Promise<IResponse> {
    const name = body.name;

    return this.tagService.createNewTag(name);
  }

  @Get()
  async getAllTag(): Promise<IResponse> {
    return this.tagService.getAllTag();
  }

  @Get('/:slug')
  async getTagBySlug(@Param('slug') slug: string): Promise<IResponse> {
    return this.tagService.getTagBySlug(slug);
  }
}
