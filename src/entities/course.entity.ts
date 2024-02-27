import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { User } from './user.entity';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  iconUrl: string;

  @Prop({ required: true, type: Number })
  duration: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  level: string;

  @Prop({ type: Number })
  lessonsCount: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  instructor: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  creator: MongooseSchema.Types.ObjectId;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
