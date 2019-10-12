import { NestFactory } from '@nestjs/core';
import { AppModule } from '@root/AppModule';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: false,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
