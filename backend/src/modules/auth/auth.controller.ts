import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// @Post('signup')
	// async signup(
	// 	@Res() res: Response,
	// 	@Body() user: Pick<User, 'email' | 'password'>
	// ): Promise<string | HttpStatus | Response> {
	// 	// this.authService.signup(user);
	// 	return res.status(418).send('meowww');
	// }

	@Get('verify/:jwt')
	async verifyEmail(@Param('jwt') jwt: string) {
		return await this.authService.verifyEmail(jwt);
	}
}
