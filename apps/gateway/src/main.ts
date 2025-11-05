import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Version, VersioningType } from '@nestjs/common';
import { ApiVersion } from 'apps/gateway/src/common/constants/app';
import { JwtGuard } from './common/guards/jwt.guard';
import { GraphQLExceptionFilter } from './common/exception.filters/graphql.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()

  app.enableVersioning({
    type:  VersioningType.URI,
    defaultVersion: [ApiVersion.V1],
  })

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
  new ValidationPipe({
    transform: true, 
  }),
);

  app.useGlobalFilters(new GraphQLExceptionFilter());

  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));

  // await app.listen(await getPort());
  await app.listen(process.env.GATEWAY_PORT || 3000);
  console.log(`Geteway microservice is running on port ${process.env.GATEWAY_PORT || 3000}`);


}
bootstrap();
