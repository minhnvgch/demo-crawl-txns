import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import * as config from 'config';
import { CharkLib } from 'src/libs/chark.lib';

const appPort = config.get<number>('app.port');
const prefix = config.get<string>('app.prefix');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(prefix);

  await CharkLib.logInfo(`App running at port ${appPort}`);
  await app.listen(appPort);
}
bootstrap();
