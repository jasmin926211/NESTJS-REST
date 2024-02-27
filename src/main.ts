import { NestFactory } from '@nestjs/core';

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http.filter';
import { ValidationExceptionFilter } from './filters/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();

  const options = new DocumentBuilder()
    .setTitle('STUDENT CRUD')
    .setDescription('APIs For User Learning')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addTag('Crud Operations')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('apis', app, document);

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new ValidationExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  await app.listen(await config.getPortConfig());
}
bootstrap();
