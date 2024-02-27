import { Injectable } from '@nestjs/common';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from '../../dto/getQueryDto';
import { LessonRepository } from '../../repositories/lesson.repositoty';
import { CreateLessonDto } from './dto/createLesson.dto';
import { UpdateLessonDto } from './dto/updateLesson.dto';

@Injectable()
export class LessonService {
  constructor(private lessonRepository: LessonRepository) {}

  async createLesson(createLessonDto: CreateLessonDto, session: ClientSession) {
    const lesson = await this.lessonRepository.createLesson(
      createLessonDto,
      session,
    );
    return lesson;
  }

  async getLesson(lessonId: MongooseSchema.Types.ObjectId) {
    return await this.lessonRepository.getLessonById(lessonId);
  }

  async getLessons(getQueryDto: GetQueryDto) {
    return await this.lessonRepository.getLessons(getQueryDto);
  }

  async deleteLesson(lessonId: MongooseSchema.Types.ObjectId) {
    return await this.lessonRepository.deleteLessonById(lessonId);
  }

  async updateLesson(
    lessonId: MongooseSchema.Types.ObjectId,
    updateLessonDto: UpdateLessonDto,
    session: ClientSession,
  ) {
    return await this.lessonRepository.updateLesson(
      lessonId,
      updateLessonDto,
      session,
    );
  }
}
