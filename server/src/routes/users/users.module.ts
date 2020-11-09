import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbUtilsService } from 'src/utils/db-utils.service';
import { userSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    DbUtilsService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
