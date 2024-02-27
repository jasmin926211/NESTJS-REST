import { PartialType } from '@nestjs/mapped-types';

import { CreateCourseDto } from './createCourse.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
