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
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from '../../dto/getQueryDto';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';

@Controller('courses')
export class CourseController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private courseService: CourseService,
  ) {}

  @Post('/')
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const course: any = await this.courseService.createCourse(
        createCourseDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(course);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  @Put('/:id')
  async updateCourse(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Body() updateCourseDto: UpdateCourseDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const course: any = await this.courseService.updateCourse(
        id,
        updateCourseDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(course);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  @Get('/:id')
  async getCourse(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const course = await this.courseService.getCourse(id);
    return res.status(HttpStatus.OK).send(course);
  }

  @Get('/')
  async getCourses(@Query() getQueryDto: GetQueryDto, @Res() res: Response) {
    const courses: any = await this.courseService.getCourses(getQueryDto);
    return res.status(HttpStatus.OK).send(courses);
  }

  @Delete('/:id')
  async deleteCourse(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const course: any = await this.courseService.deleteCourse(id);
    return res.status(HttpStatus.NO_CONTENT).send(course);
  }
}
