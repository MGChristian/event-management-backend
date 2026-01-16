import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  Req,
  Request, // Note: Use Request from @nestjs/common or express
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserRoles } from 'src/auth/decorators/user-roles.decorator';
import { UserRole } from 'src/users/enums/user-roles.enum';
import { GetEventDto } from './dto/get-event.dto';

// REMOVE GUARDS FROM HERE
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiResponse({
    status: 200,
    description: 'List of events retrieved successfully.',
    type: [GetEventDto],
  })
  @Get()
  findAll(): Promise<GetEventDto[]> {
    return this.eventsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Get('organizer')
  @ApiResponse({
    status: 200,
    description: 'Organizer events.',
    type: [GetEventDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllByOrganizer(@Req() request: Request): Promise<GetEventDto[]> {
    const organizerId: number = request['user'].id;
    return this.eventsService.findAllByOrganizer(organizerId);
  }

  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully.',
    type: GetEventDto,
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GetEventDto | null> {
    return this.eventsService.findOne(id);
  }

  // --- PROTECTED ROUTES (Add Guards Here) ---

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @UserRoles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Post()
  @ApiResponse({ status: 201, description: 'Created.', type: GetEventDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(
    @Body(new ValidationPipe()) createEventDto: CreateEventDto,
    @Req() req,
  ) {
    const organizerId = req.user.id;
    return this.eventsService.create(organizerId, createEventDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @UserRoles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Updated.', type: GetEventDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @UserRoles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
