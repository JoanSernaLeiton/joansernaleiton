---
title: NestJS Microservices over TCP
author: Joan Serna Leiton
pubDatetime: 2026-10-05T12:40:00Z
slug: nestjs-microservices-tcp-transport
featured: false
draft: true
tags:
  - NestJS
  - Microservices
  - Node.js
  - TCP
description: NestJS includes a microservices module with several transports. The TCP transport is the simplest one to start with. Let's build two services that talk to each other, one using request-response and the other using events.
---

## Transports in NestJS

NestJS can use different transport layers for communication between services: TCP, Redis, NATS, RabbitMQ, Kafka, gRPC and others. TCP needs no extra infrastructure, so it is a great way to learn the concepts. In production you may prefer a message broker for durability and retries.

```bash
npm i @nestjs/microservices
```

## The microservice

This service listens on TCP port 4001.

```ts
// main.ts
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { host: "0.0.0.0", port: 4001 },
    }
  );
  await app.listen();
}
bootstrap();
```

## Request-response with `@MessagePattern`

```ts
@Controller()
export class UsersController {
  @MessagePattern({ cmd: "get_user" })
  getUser(data: { id: number }) {
    return { id: data.id, name: "Ada" };
  }

  @EventPattern("user_created")
  handleUserCreated(data: { id: number }) {
    console.log("user created", data.id);
  }
}
```

`@MessagePattern` expects a response. `@EventPattern` is fire-and-forget, the sender does not wait for an answer.

## The client (API gateway)

```ts
@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USERS_SERVICE",
        transport: Transport.TCP,
        options: { host: "users", port: 4001 },
      },
    ]),
  ],
})
export class AppModule {}
```

```ts
@Controller("users")
export class UsersGatewayController {
  constructor(@Inject("USERS_SERVICE") private readonly client: ClientProxy) {}

  @Get(":id")
  getUser(@Param("id") id: number) {
    return this.client.send({ cmd: "get_user" }, { id });
  }

  @Post()
  create() {
    this.client.emit("user_created", { id: 1 });
  }
}
```

`send` returns an observable and waits for the response, `emit` publishes an event.

## Things to keep in mind

- Add timeouts to `send` with the RxJS `timeout` operator so a slow service does not hang the caller.
- Handle errors with `RpcException` and exception filters.
- TCP gives no message persistence: if the service is down, the message is lost. Use a broker when you need delivery guarantees.
- Do not expose the TCP port to the internet, keep it on a private network.

## Conclusion

The TCP transport lets us split a system into services with very little setup. Start there to understand message patterns and events, and move to a broker when reliability requirements grow.
