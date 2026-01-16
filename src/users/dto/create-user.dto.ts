import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from '../enums/user-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'userEmail@email.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'User Name',
    description: 'The name of the user',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'SecurePassword123',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: UserRole.USER,
    description: 'The role of the user',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    example: 'Company Inc.',
    description: 'The company of the user',
  })
  @IsOptional()
  company?: string;
}
