import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { ScanService } from './scan.service';
import { UserRoles } from 'src/auth/decorators/user-roles.decorator';
import { UserRole } from 'src/users/enums/user-roles.enum';
import { UpdateResult } from 'typeorm';

@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @ApiResponse({
    status: 201,
    description: 'Ticket scanned successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  @UserRoles(UserRole.ORGANIZER, UserRole.ADMIN)
  @Post()
  scanTicket(@Body() body: { ticketId: string }) {
    return this.scanService.scanTicket(body.ticketId);
  }
}
