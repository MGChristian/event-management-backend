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
  Req,
  Request,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetTicketDto } from './dto/get-ticket.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiResponse({
    status: 201,
    description: 'The ticket has been created successfully.',
    type: CreateTicketDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  create(
    @Body(new ValidationPipe()) createTicketDto: CreateTicketDto,
    @Req() request: Request,
  ) {
    const userId: number = request['user'].id;
    return this.ticketsService.create(userId, createTicketDto);
  }

  @ApiResponse({
    status: 200,
    description: 'List of user tickets retrieved successfully.',
    type: [GetTicketDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get('mine')
  findMyTickets(@Req() request: Request) {
    console.log(request['user']);
    const userId: number = request['user'].id;
    return this.ticketsService.findMyTickets(userId);
  }

  @ApiResponse({
    status: 200,
    description: 'List of tickets retrieved successfully.',
    type: [GetTicketDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get(':eventId')
  findAll(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.ticketsService.findAll(eventId);
  }

  @ApiResponse({
    status: 200,
    description: 'The ticket has been deleted successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ticketsService.remove(id);
  }
}
