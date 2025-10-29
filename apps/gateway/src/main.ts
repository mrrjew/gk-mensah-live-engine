import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Version, VersioningType } from '@nestjs/common';
import { ApiVersion } from 'apps/gateway/src/core/common/constants/app';
import { JwtGuard } from './core/common/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()

  app.enableVersioning({
    type:  VersioningType.URI,
    defaultVersion: [ApiVersion.V1],
  })

  app.setGlobalPrefix('api')

  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));

  // await app.listen(await getPort());
  await app.listen(process.env.GATEWAY_PORT || 3000);
  console.log(`Geteway microservice is running on port ${process.env.GATEWAY_PORT || 3000}`);


}
bootstrap();
