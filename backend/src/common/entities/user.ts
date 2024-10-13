import { RestrictProperties } from '../utils/restrictProperties';
import { user as UserType } from '@prisma/client';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User implements RestrictProperties<User, UserType> {
	id: number;
	email: string;
	confirmed: boolean;
	password: string;
}
