import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Course } from './course.entity';

@Schema({ timestamps: true })
export class Lesson extends Document {
  @Prop({ required: true, type: Number })
  seqNo: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number })
  duration: number;

  @Prop({ type: Boolean, default: true })
  isActive: { type: boolean };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Course.name })
  course: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  creator: MongooseSchema.Types.ObjectId;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
