import { HttpService, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(Logger);

  const httpService = app.get(HttpService);
  app.useGlobalGuards(new AuthGuard(httpService));

  const configService = app.get(ConfigService);
  const port: number = configService.get('PORT') || 3000;

  await app.listen(port, () => {
    logger.log(`Listening on port: ${port}`, 'Server');
  });
}
bootstrap();
