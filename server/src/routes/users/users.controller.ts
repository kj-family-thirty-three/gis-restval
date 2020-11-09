import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
// import { roles } from 'src/guards/decorators/roles.decorator';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/guards/role.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { MongoId } from './dto/id.param';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {

  constructor(
    private readonly _usersService: UsersService,
  ) { }

  // @Roles('admin')
  // @UseGuards(RolesGuard)
  @Get()
  async findAll(@Request() req): Promise<UserResponse[]> {
    return this._usersService.findAll(req.user.company_id);
  }

  // @Roles('admin')
  // @UseGuards(RolesGuard)
  @Get(':id')
  async findById(@Param() params: MongoId): Promise<UserResponse> {
    return this._usersService.findById(params.id);
  }

  // @Roles('admin')
  // @UseGuards(RolesGuard)
  @Post()
  async create(@Body() data: CreateUserDto, @Request() req): Promise<UserResponse> {
    return this._usersService.create(data, req.user.company_id);
  }

  @Delete()
  async delete(@Body() data: MongoId): Promise<UserResponse> {
    return this._usersService.delete(data.id);
  }
}
