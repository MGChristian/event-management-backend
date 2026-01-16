import {
  Controller,
  Get,
  UseGuards,
  Req,
  Body,
  ValidationPipe,
  Patch,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { GetUserDto } from './dto/get-user.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UserRoles } from 'src/auth/decorators/user-roles.decorator';
import { UserRole } from './enums/user-roles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    type: [GetUserDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UserRoles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiResponse({
    status: 201,
    description: 'The user has been created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UserRoles(UserRole.ADMIN)
  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UserRoles(UserRole.ADMIN)
  @Patch(':userId')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body(new ValidationPipe()) updateUserDto: Partial<UpdateUserDto>,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }
}
