import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Dow John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '7046460053',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'rehmat.sayani@gmail.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'ADMIN|USER' })
  @IsString()
  @IsNotEmpty()
  role: any;

  @IsString()
  @IsOptional()
  refreshToken: string;
}

// import {
//   IsNotEmpty,
//   IsString,
//   MinLength,
//   IsAlpha,
//   Matches,
//   IsEnum,
// } from 'class-validator';

// export enum UserState {
//   ACTIVE = 'Active',
//   IN_ACTIVE = 'Inactive',
// }

// export class CreateUserDto {
//   @IsNotEmpty()
//   @IsString()
//   @IsAlpha()
//   @MinLength(1)
//   readonly firstName: string;

//   @IsNotEmpty()
//   @IsString()
//   readonly lastName: string;

//   @IsNotEmpty()
//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/g)
//   readonly email: string;

//   @IsNotEmpty()
//   @IsString()
//   @Matches(/^[6789]\d{9}$/)
//   readonly phoneNumber: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(3)
//   readonly companyName: string;

//   @IsEnum(UserState)
//   readonly userState: UserState;
// }
