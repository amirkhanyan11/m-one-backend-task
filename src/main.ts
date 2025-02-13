import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));
  app.useGlobalPipes(new ValidationPipe());
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, () => console.log(`Listening on port ${port}`));
}
bootstrap();
