import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { JwtService } from '../jwt/jwt.service';
import { UserDto } from './dto/user.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService,
		private readonly mailService: MailerService
	) {}

	async signUp({ email, password }: UserDto) {
		// const user = await this.prisma.user.findFirst({
		// 	where: {
		// 		email
		// 	}
		// });
		//
		// if (user) throw new ConflictException('User already exists');
		//
		// await this.prisma.user.create({
		// 	data: {
		// 		email,
		// 		password,
		// 		confirmed: false
		// 	}
		// });

		const jwtConfirmationLink = await this.jwt.createConfirmationLink(email);

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

		return jwtConfirmationLink;
	}
}
