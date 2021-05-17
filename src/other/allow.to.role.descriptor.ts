import { SetMetadata } from '@nestjs/common';

export const AllowToRoles = (...roles: ('administrator' | 'customer')[]) => {
  return SetMetadata('allow_to_roles', roles);
};
