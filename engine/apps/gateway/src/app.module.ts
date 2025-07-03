import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthResolver } from './auth/auth.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001, // Make sure your auth microservice listens on this port
        },
      },
    ]),
  ],
  providers: [AuthResolver],
})
export class AppModule {}
