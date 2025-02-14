import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('M-One social network')
    .setDescription('Docmentation for the bacend task')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, () => console.log(`Listening on port ${port}`));
}

bootstrap();
