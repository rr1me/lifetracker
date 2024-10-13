import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
	@Query(() => String, { nullable: true })
	emptyRoot(): string {
		return null;
	}
}
