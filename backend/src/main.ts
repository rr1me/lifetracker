import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

(async () => {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('LifeTracker api')
		.setDescription('The LifeTracker API description')
		.setVersion('0.1')
		.addTag('meow')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(3000);
})();
