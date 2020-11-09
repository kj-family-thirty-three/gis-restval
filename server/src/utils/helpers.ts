import { GisPermission } from 'src/routes/users/interfaces/permission.enum';
import { MongoError } from 'mongodb';
import * as bcrypt from 'bcrypt';

export function encodePermissions(permissions?: GisPermission[]): number {
  let permissionsBin = 0b0;
  if (permissions) {
    permissions.forEach(exp => {
      permissionsBin = permissionsBin | Math.pow(2, exp);
    });
    return permissionsBin;
  }
  return permissionsBin | (Math.pow(2, Object.keys(GisPermission).length / 2) - 1);
}

export function decodePermissions(permissionsBin: number): GisPermission[] {
  const permissions = [];
  for (let i = 0; i < Object.keys(GisPermission).length / 2; i++) {
    if (permissionsBin & Math.pow(2, i)) {
      permissions.push(GisPermission[i]);
    }
  }
  return permissions;
}

export function constructMongoError(err: NodeJS.ErrnoException): MongoError {
  return new MongoError({
    name: err.name,
    code: err.code,
    errmsg: err.message,
  });
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function comparePasswords(newPassword: string, passwortHash: string): Promise<boolean> {
  return bcrypt.compare(newPassword, passwortHash);
}
