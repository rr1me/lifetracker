import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../shared/prisma.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '../jwt/jwt.service';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';

@Module({
	imports: [JwtModule],
	controllers: [AuthController],
	providers: [PrismaService, JwtService, AuthResolver, AuthService]
})
export class AuthModule {}
