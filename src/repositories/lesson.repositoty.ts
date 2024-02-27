import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from '../dto/getQueryDto';
import { Lesson } from '../entities/lesson.entity';
import { CreateLessonDto } from '../modules/lesson/dto/createLesson.dto';
import { UpdateLessonDto } from '../modules/lesson/dto/updateLesson.dto';

export class LessonRepository {
  constructor(
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto, session: ClientSession) {
    try {
      let lesson = new this.lessonModel(createLessonDto);
      lesson = await lesson.save({ session });
      return lesson;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async updateLesson(
    id: MongooseSchema.Types.ObjectId,
    updateLesson: UpdateLessonDto,
    session: ClientSession,
  ) {
    try {
      const lesson = await this.lessonModel
        .findOneAndUpdate({ _id: id }, updateLesson, {
          new: true,
        })
        .session(session)
        .exec();

      if (!lesson) {
        throw new ConflictException('Error trying to update lesson');
      }

      return lesson;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getLessons(query: GetQueryDto) {
    const { from = 0, limit = 0 } = query;
    let lessons: Lesson[] = [];
    try {
      const queryBuilder = this.lessonModel
        .find()
        .select('-__v -updatedAt')
        .populate({
          path: 'course',
          select: 'name description', // Specify the fields you want to populate for the course
        })
        .populate('creator', 'name email')
        .skip(from)
        .sort({ createdAt: -1 });

      if (limit !== 0) {
        queryBuilder.limit(limit);
      }

      lessons = await queryBuilder.exec();
      const response = {
        ok: true,
        data: lessons.length > 0 ? lessons : [],
      };

      return response;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getLessonById(id: MongooseSchema.Types.ObjectId) {
    try {
      const lesson = await this.lessonModel
        .findById(id)
        .select('-__v -updatedAt')
        .populate({
          path: 'course',
          select: 'name description isActive', // Specify the fields you want to populate for the course
        })
        .populate({
          path: 'creator',
          select: 'name email', // Specify the fields you want to populate for the creator
        })
        .exec();

      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      return lesson;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async deleteLessonById(id: MongooseSchema.Types.ObjectId) {
    try {
      const lesson = await this.lessonModel.findByIdAndDelete(id).exec();
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
      return {
        message: 'Lesson deleted successfully',
      };
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
