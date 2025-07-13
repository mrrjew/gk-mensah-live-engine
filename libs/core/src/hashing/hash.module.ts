import { Module } from "@nestjs/common";
import { HashService } from "./hash.service";   

@Module({
  controllers: [],
  providers: [HashService],
})

export class HashModule {}