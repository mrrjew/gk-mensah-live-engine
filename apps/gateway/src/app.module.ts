import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphInspector } from '@nestjs/core';
import { GraphQLModule as Graph } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { CoreModule } from './core/core.module';

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
      path: 'api/v1/graphql',
      introspection: true,
      plugins: [GraphInspector],
    }),
    CoreModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule{}