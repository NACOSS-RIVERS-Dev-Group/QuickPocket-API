import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const corsOptions: CorsOptions = {
  //   origin: '*', // Specify the origin of your frontend
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
  //   allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  //   // preflightContinue: false,
  //   // optionsSuccessStatus: 200,
  //   // maxAge: 5,
  // };

  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: 'http://localhost:3035/', // Specify the origin of your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'], // Specify the allowed HTTP methods
    // allowedHeaders: [
    //   'Content-Type',
    //   'Authorization',
    //   'Access-Control-Allow-Origin',
    // ], // Specify the allowed headers
  });

  await app.listen(6000);
}
bootstrap();
