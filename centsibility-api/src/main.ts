// main.ts - the starting point of the backend.
// Run it with: npm run start:dev
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

/**
 * Creates and starts the NestJS application.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Every route starts with /api/v1 (the version is part of the URL).
  app.setGlobalPrefix('api/v1');

  // Validate every request body and query:
  // - whitelist: remove fields that are not in the DTO
  // - forbidNonWhitelisted: return 400 if the client sends unknown fields (for example userId)
  // - transform: convert values to the DTO types (for example page=1 becomes the number 1)
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // Make every error use the same response format.
  app.useGlobalFilters(new AllExceptionsFilter());

  // The port comes from the .env file (default 3000).
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Centsibility API running at http://localhost:${port}/api/v1`);
}

// Start the app.
bootstrap();
