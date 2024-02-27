import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty({ message: 'Sequence number is required' })
  @IsNumber({}, { message: 'Sequence number must be a number' })
  seqNo: number;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Duration is required' })
  @IsNumber({}, { message: 'Duration must be a number' })
  duration: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive?: boolean;

  @IsNotEmpty({ message: 'Course ID is required' })
  @IsMongoId({ message: 'Course ID must be a valid ID' })
  course: string;
}
