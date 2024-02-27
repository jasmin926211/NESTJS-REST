import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private userService: UserService,
  ) {}

  @Post('/')
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for user object',
  })
  @ApiResponse({
    status: 201,
    description: 'Created.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const user: any = await this.userService.createUser(
        createUserDto,
        session,
      );

      await session.commitTransaction();

      return res.status(HttpStatus.CREATED).send({ id: user._id });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  @Get('/:id')
  async getUser(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const user: any = await this.userService.getUserById(id);
    return res.status(HttpStatus.OK).send(user);
  }
}
