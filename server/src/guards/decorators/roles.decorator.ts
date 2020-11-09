import { SetMetadata } from '@nestjs/common';

export const customRoles = (...roles: string[]) => SetMetadata('roles', roles);
