import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService
	) {}

	async signUp({ email, password }: UserDto) {
		const user = await this.prisma.user.findFirst({
			where: {
				email
			}
		});

		if (user) throw new ConflictException('User already exists');

		await this.prisma.user.create({
			data: {
				email,
				password,
				confirmed: false
			}
		});

		return await this.jwt.createConfirmationLink(email);
	}
}
