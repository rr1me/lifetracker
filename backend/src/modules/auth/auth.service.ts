import {
	BadRequestException,
	ConflictException,
	ImATeapotException,
	Injectable
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { UserDto } from './dto/user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { decodeJwt, JWTPayload } from 'jose';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService,
		private readonly mailService: MailerService
	) {}

	async signUp({ email, password }: UserDto) {
		const user = await this.prisma.user.findFirst({
			where: {
				email
			}
		});

		console.log(user);

		if (user)
			throw new ConflictException(user.confirmed ? 'Email verified' : 'User already exists');

		const { publicKey, link } = await this.jwt.createConfirmationLink(email);

		if (user)
			await this.prisma.user.update({
				data: {
					verifyPublicKey: publicKey
				},
				where: {
					id: user.id
				}
			});
		else
			await this.prisma.user.create({
				data: {
					email,
					password,
					confirmed: false,
					verifyPublicKey: publicKey
				}
			});

		// try{
		// 	await this.mailService.sendMail({
		// 		from: 'LifeTracker notifier <auth@lifetracker.rr1me.space>',
		// 		to: 'test@mail.com',
		// 		subject: 'test subject',
		// 		text: jwtConfirmationLink
		// 	});
		// }catch (e) {
		// 	console.log('well:', e);
		// }

		return link;
	}

	async verifyEmail(jwt: string) {
		const payload: JWTPayload & { email: string } = decodeJwt(jwt);

		const user = await this.prisma.user.findFirst({
			where: {
				email: payload.email
			}
		});

		if (!user || user.confirmed) throw new BadRequestException('No such link');

		if (!this.jwt.verifyJwt(jwt, user.verifyPublicKey))
			throw new ImATeapotException("Can't verify JWT");

		await this.prisma.user.update({
			data: {
				confirmed: true
			},
			where: {
				id: user.id
			}
		});

		return 'Verified';
	}
}
