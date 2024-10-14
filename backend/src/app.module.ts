import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';
import * as process from 'node:process';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: (() => {
				switch (process.env.NODE_ENV) {
					case 'dev':
						return '.env.dev';
					default:
						return '.env'; // Default or fallback environment file
				}
			})()
		}),
		AuthModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			playground: true,
			// fieldResolverEnhancers: ['guards'],
			// autoSchemaFile: join(process.cwd(), 'src/schema.gql')
			autoSchemaFile: true
			// buildSchemaOptions: {
			// 	numberScalarMode: 'integer'
			// },
			// introspection: true,
			// include: [AuthModule, AppModule]
		})
	],
	controllers: [AppController],
	providers: [AppService, AppResolver]
})
export class AppModule {}
