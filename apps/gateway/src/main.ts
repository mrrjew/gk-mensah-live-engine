import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Version, VersioningType } from '@nestjs/common';
import { ApiVersion } from 'apps/gateway/src/common/constants/app';
import { JwtGuard } from './common/guards/jwt.guard';
import { GraphQLExceptionFilter } from './common/exception.filters/graphql.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Attach microservice (TCP)
  const tcpPort = parseInt(process.env.GATEWAY_PORT || '3001', 10);
  const httpPort = parseInt(process.env.PORT || '4001', 10);
  const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);


  app.connectMicroservice({
    transport: 'TCP',
    options: {
      port: tcpPort,
    },
  });

  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: [ApiVersion.V1],
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalFilters(new GraphQLExceptionFilter());

  app.useGlobalGuards(new JwtGuard(app.get(Reflector)));

  // Start both HTTP and microservice
  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(
    `Gateway microservice is running on HTTP port ${httpPort} and TCP port ${tcpPort}`,
  );
}
bootstrap();
