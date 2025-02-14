import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UserModule, JwtModule],
  providers: [FriendshipService],
  controllers: [FriendshipController],
})
export class FriendshipModule {}
