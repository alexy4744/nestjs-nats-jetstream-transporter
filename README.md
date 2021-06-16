# NestJS Nats JetStream Transpoter

NATS JetStream transporter for NestJS

- [NestJS Nats JetStream Transpoter](#nestjs-nats-jetstream-transpoter)
  - [Installation](#installation)
  - [Publishing Messages](#publishing-messages)
    - [Request-Reply](#request-reply)
    - [Event-Based](#event-based)
  - [Tests](#tests)
  - [Todo](#todo)

## Installation

```bash
$ npm install nestjs-nats-jetstream-transporter nats@latest
```

## Publishing Messages

### Request-Reply
```ts
// main.ts
const app = await NestFactory.create(AppModule);

const microservice = app.connectMicroservice<MicroserviceOptions>({
  strategy: new NatsTransportStrategy({
    connection: {
      port: 4222
    }
  })
});

await microservice.listenAsync();
```

### Event-Based
```ts
// main.ts
const app = await NestFactory.create(AppModule);

const microservice = app.connectMicroservice<MicroserviceOptions>({
  strategy: new NatsTransportStrategy({
    connection: {
      port: 4222
    },
    // This will upsert a stream called orders-events in NATS JetStream
    streams: [
      {
        name: "orders-events",
        subjects: ["orders.created", "orders.deleted"]
      }
    ]
  })
});

await microservice.listenAsync();
```

## Tests

Run tests using the following commands:
```bash
$ npm run test
$ npm run test:watch
```

## Todo

- Add tests
- Add docs
