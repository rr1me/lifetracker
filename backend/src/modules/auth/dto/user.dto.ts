import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserDto {
	@Field()
	email: string;

	@Field()
	password: string;
}
