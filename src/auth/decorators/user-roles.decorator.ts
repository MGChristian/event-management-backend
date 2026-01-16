import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/enums/user-roles.enum';

export const ROLES_KEY = 'roles';
export const UserRoles = (...roles: [UserRole, ...UserRole[]]) =>
  SetMetadata(ROLES_KEY, roles);
