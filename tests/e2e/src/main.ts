import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

import { AppModule } from "./app/app.module";

import { NatsTransportStrategy } from "../../../src";

(async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    strategy: new NatsTransportStrategy({
      connection: {
        port: 4222
      },
      consumer: (options) => {}
    })
  });

  await app.listenAsync();
})();
