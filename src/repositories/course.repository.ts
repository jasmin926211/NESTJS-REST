import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from '../dto/getQueryDto';
import { Course } from '../entities/course.entity';
import { CreateCourseDto } from '../modules/course/dto/createCourse.dto';
import { UpdateCourseDto } from '../modules/course/dto/updateCourse.dto';

export class CourseRepository {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto, session: ClientSession) {
    try {
      let course = new this.courseModel(createCourseDto);
      course = await course.save({ session });
      return course;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async updateCourse(
    id: MongooseSchema.Types.ObjectId,
    updateCourse: UpdateCourseDto,
    session: ClientSession,
  ) {
    try {
      const course = await this.courseModel
        .findOneAndUpdate({ _id: id }, updateCourse, {
          new: true,
        })
        .session(session)
        .exec();

      if (!course) {
        throw new ConflictException('Error trying to update course');
      }

      return course;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getCourses(query: GetQueryDto) {
    const { from = 0, limit = 0 } = query;
    let courses: Course[] = [];
    try {
      const queryBuilder = this.courseModel
        .find()
        .populate('instructor')
        .populate('instructor', 'name email')
        .skip(from)
        .sort({ createdAt: -1 });

      if (limit !== 0) {
        queryBuilder.limit(limit);
      }

      courses = await queryBuilder.exec();
      const response = {
        ok: true,
        data: courses.length > 0 ? courses : [],
      };

      return response;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getCourseById(id: MongooseSchema.Types.ObjectId) {
    try {
      const course = await this.courseModel.findById(id).exec();
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return course;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async deleteCourseById(id: MongooseSchema.Types.ObjectId) {
    try {
      const course = await this.courseModel.findByIdAndDelete(id).exec();
      if (!course) {
        throw new NotFoundException('Course not found');
      }
      return {
        message: 'Course deleted successfully',
      };
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
