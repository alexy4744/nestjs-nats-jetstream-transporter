# NestJS Nats JetStream Transpoter

NATS JetStream transporter for NestJS

- [NestJS Nats JetStream Transpoter](#nestjs-nats-jetstream-transpoter)
  - [Installation](#installation)
  - [Publishing Messages](#publishing-messages)
    - [Request-Reply](#request-reply)
    - [Event-Based](#event-based)
  - [Receiving Messages](#receiving-messages)
  - [Tests](#tests)
  
## Installation

```bash
$ npm install nestjs-nats-jetstream-transporter nats@latest
```

## Publishing Messages

### Request-Reply
```ts
// main.ts
import { NatsTransportStrategy } from "nestjs-nats-jetstream-transporter";

const app = await NestFactory.create(AppModule);

const microservice = app.connectMicroservice<MicroserviceOptions>({
  strategy: new NatsTransportStrategy()
});

await microservice.listenAsync();
```

```ts
// math.controller.ts
import { NatsClient } from "nestjs-nats-jetstream-transporter";

@Controller()
export class MathController {
  private readonly client = new NatsClient();

  accumulate(): Observable<number> {
    return this.client.send<number>("sum", [1, 2, 3]);
  }
}
```

### Event-Based
```ts
// main.ts
import { NatsTransportStrategy } from "nestjs-nats-jetstream-transporter";

const app = await NestFactory.create(AppModule);

const microservice = app.connectMicroservice<MicroserviceOptions>({
  strategy: new NatsTransportStrategy({
    // Create a stream with a subject called "orders.created"
    // This is important later on when we publish an event with NatsClient
    streams: [
      {
        name: "orders-events",
        subjects: ["orders.created"]
      }
    ]
  })
});

await microservice.listenAsync();
```

```ts
// orders.controller.ts
import { NatsClient } from "nestjs-nats-jetstream-transporter";

@Controller()
export class OrdersController {
  private readonly client = new NatsClient();

  constructor(private readonly ordersService: OrdersService) {}

  async create() {
    const order = await this.ordersService.create();

    this.client.emit("orders.created", order);
  }
}
```

## Receiving Messages

There are no special changes needed to receive messages. Just use the `@EventPattern()` and `@MessagePattern()` decorators provided by NestJS.

`@Ctx()` works exactly the same, however you should use the `NatsContext` provided by this package as the parameter type. It exposes an additional `getMessage()` method that returns the original message object if needed.

## Tests

Run tests using the following commands:
```bash
$ npm run test
$ npm run test:watch
```
