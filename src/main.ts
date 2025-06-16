import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/allException.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserService } from './modules/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation pipe for validation errors
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in DTO
      forbidNonWhitelisted: true, // throws error if extra properties are present
      transform: true,
    }),
  );

  // Custom message on Any type of exception
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('JK NestJS API')
    .setDescription('User, Document and Ingestion APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // const userService = app.get(UserService);
  // await userService.seedUsers(); // <== manually call seeder

  await app.listen(process.env.APP_PORT ?? 3000);
}

bootstrap();
