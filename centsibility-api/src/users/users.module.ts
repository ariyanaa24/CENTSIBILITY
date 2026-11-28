import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * Users feature: the controller, the service, and the Users table.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // AuthModule uses UsersService to find the user at login.
  exports: [UsersService],
})
export class UsersModule {}
