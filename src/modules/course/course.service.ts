import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from '../../dto/getQueryDto';
import { CourseRepository } from '../../repositories/course.repository';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdateCourseDto } from './dto/updateCourse.dto';

@Injectable()
export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  async createCourse(createCourseDto: CreateCourseDto, session: ClientSession) {
    const course = await this.courseRepository.createCourse(
      createCourseDto,
      session,
    );
    return course;
  }

  async getCourse(courseId: MongooseSchema.Types.ObjectId) {
    return await this.courseRepository.getCourseById(courseId);
  }

  async getCourses(getQueryDto: GetQueryDto) {
    return await this.courseRepository.getCourses(getQueryDto);
  }

  async deleteCourse(courseId: MongooseSchema.Types.ObjectId) {
    return await this.courseRepository.deleteCourseById(courseId);
  }

  async updateCourse(
    courseId: MongooseSchema.Types.ObjectId,
    updateCourseDto: UpdateCourseDto,
    session: ClientSession,
  ) {
    return await this.courseRepository.updateCourse(
      courseId,
      updateCourseDto,
      session,
    );
  }
}
