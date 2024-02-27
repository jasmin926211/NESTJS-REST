import { PartialType } from '@nestjs/mapped-types';

import { CreateLessonDto } from './createLesson.dto';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}

// import { IsMongoId } from 'class-validator';
// import { CreateLessonDto } from './createLesson.dto';

// export class UpdateLessonDto extends CreateLessonDto {
//   @IsMongoId({ message: 'ID must be a valid MongoDB ObjectId' })
//   id: string;
// }
