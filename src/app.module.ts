import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

import { CourseModule } from './modules/course/course.module';
import { LessonModule } from './modules/lesson/lesson.module';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
// import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule,
    // MongoDB Connection
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getMongoConfig(),
    }),
    UserModule,
    CourseModule,
    LessonModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(AuthMiddleware).forRoutes('*');
//   }
// }
export class AppModule {}
