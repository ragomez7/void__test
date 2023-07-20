import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
import * as path from 'path';
import { GlobalExceptionFilter } from './filters/exception.filter';

const PORT = process.env.PORT || 80;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`LISTENING ON PORT ${PORT}`)
  const swaggerDocument = YAML.load(
    path.resolve(__dirname, '../swagger_file.yaml'),
  );
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.useGlobalFilters(new GlobalExceptionFilter());
  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
