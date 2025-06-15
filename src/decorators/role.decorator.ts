import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/user.enum';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
