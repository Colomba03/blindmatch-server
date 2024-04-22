/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
}

bootstrap().catch((error) => {
  console.error('Error during Nest application startup', error);
});