import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configure CORS
  app.enableCors();
  
  // Serve static files from the 'uploads' directory
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Log the uploads directory for debugging
  console.log(`Serving uploads from: ${uploadsDir}`);
  
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
