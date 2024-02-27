import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Schema as MongooseSchema } from 'mongoose';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../modules/user/dto/createUser.dto';
import { UpdateUserDto } from '../modules/user/dto/updateUser.dto';

export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto, session: ClientSession) {
    try {
      let user = await this.userModel
        .findOne({ email: createUserDto.email }, 'name email role')
        .exec();

      if (user) {
        throw new ConflictException('User already exists');
      }

      user = new this.userModel(createUserDto);
      await user.save({ session });

      return user;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getUserById(id: MongooseSchema.Types.ObjectId) {
    try {
      const user = await this.userModel.findById({ _id: id });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async updateUser(
    id: MongooseSchema.Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!user) {
        throw new ConflictException('Error trying to update user');
      }

      return user;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUserById(id: MongooseSchema.Types.ObjectId) {
    try {
      const user = await this.userModel.findByIdAndDelete(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async getUserByEmail(email: string) {
    try {
      let user = await this.userModel.findOne({ email }).exec();
      return user;
    } catch (error) {
      if (error.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
