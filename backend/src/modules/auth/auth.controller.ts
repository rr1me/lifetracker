import { Controller, HttpStatus, Post } from '@nestjs/common';

@Controller()
export class AuthController {
	@Post('signup')
	signup(): HttpStatus {
		return HttpStatus.OK;
	}
}
