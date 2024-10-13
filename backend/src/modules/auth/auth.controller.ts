import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { User } from '../../common/entities/user';

@Controller()
export class AuthController {
	// constructor(private readonly authService: AuthService) {}

	@Post('signup')
	async signup(@Res() res: Response, @Body() user: Pick<User, 'email' | 'password'>): Promise<string | HttpStatus | Response> {
		// this.authService.signup(user);
		return res.status(418).send('meowww');
	}
}
