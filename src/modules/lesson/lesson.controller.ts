import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetQueryDto } from '../../dto/getQueryDto';
import { CreateLessonDto } from './dto/createLesson.dto';
import { UpdateLessonDto } from './dto/updateLesson.dto';
import { LessonService } from './lesson.service';

@Controller('lessons')
export class LessonController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private lessonService: LessonService,
  ) {}

  @Post('/')
  async createLesson(
    @Body() createLessonDto: CreateLessonDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const lesson: any = await this.lessonService.createLesson(
        createLessonDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(lesson);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  @Put('/:id')
  async updateLesson(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Body() updateLessonDto: UpdateLessonDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const lesson: any = await this.lessonService.updateLesson(
        id,
        updateLessonDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(lesson);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  @Get('/:id')
  async getLesson(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const lesson = await this.lessonService.getLesson(id);
    return res.status(HttpStatus.OK).send(lesson);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/')
  async getLessons(@Query() getQueryDto: GetQueryDto, @Res() res: Response) {
    const lessons: any = await this.lessonService.getLessons(getQueryDto);
    return res.status(HttpStatus.OK).send(lessons);
  }

  @UseGuards(AccessTokenGuard, AdminGuard)
  @Delete('/:id')
  async deleteLesson(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const lesson: any = await this.lessonService.deleteLesson(id);
    return res.status(HttpStatus.NO_CONTENT).send(lesson);
  }
}
