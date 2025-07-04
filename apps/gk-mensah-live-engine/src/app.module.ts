import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphInspector } from '@nestjs/core';
import { GraphQLModule as Graph } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    Graph.forRoot({
      autoSchemaFile: true,
      driver: ApolloDriver,
      sortSchema: true,
      context: ({ req }) => ({ headers: req.headers }),
      playground: true,
      introspection: true,
      plugins: [GraphInspector],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}