import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '../../common/entities/user';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => String)
	async singUp(@Args('user') user: UserDto): Promise<string> {
		return await this.authService.signUp(user);
	}
}
