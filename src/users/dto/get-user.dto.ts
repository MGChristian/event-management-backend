import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-roles.enum';

export class GetUserDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user',
  })
  id: number;

  @ApiProperty({
    example: 'User Name',
    description: 'The name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'Tech Corp',
    description: 'The company of the user',
    nullable: true,
  })
  company?: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    example: UserRole.USER,
    description: 'The role of the user',
  })
  role: UserRole;

  @ApiProperty({
    example: true,
    description: 'Indicates if the user is active',
  })
  isActive: boolean;
}
