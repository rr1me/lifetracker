import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../shared/prisma.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '../jwt/jwt.service';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		JwtModule,
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					host: configService.get<string>('SMTP_HOST'),
					port: configService.get<number>('SMTP_PORT'),
					auth: {
						user: configService.get<string>('SMTP_USER'),
						pass: configService.get<string>('SMTP_PASS')
					}
				}
			})
		})
	],
	controllers: [AuthController],
	providers: [PrismaService, JwtService, AuthResolver, AuthService]
})
export class AuthModule {}
