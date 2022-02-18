import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { LocalSerializer } from './local.serializer';

import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, LocalSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
