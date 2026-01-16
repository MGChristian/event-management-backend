import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/users/enums/user-roles.enum';

export class SignupDto {
  @ApiProperty({
    example: 'email@gmail.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: UserRole.USER,
    description: 'The role of the user',
  })
  role: UserRole = UserRole.USER;
}
