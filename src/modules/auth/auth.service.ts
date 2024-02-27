import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { CreateUserDto } from 'src/modules/user/dto/createUser.dto';
import { ConfigService } from '../../config/config.service';
import { UserRepository } from '../../repositories/user.repository';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  hashData(data: string) {
    return argon2.hash(data);
  }

  async signUp(createUserDto: CreateUserDto, session: ClientSession) {
    const hash = await this.hashData(createUserDto.password); // Hash password
    const newUser = await this.userRepository.createUser(
      {
        ...createUserDto,
        password: hash,
      },
      session,
    );
    const tokens = await this.getTokens(newUser._id, newUser);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto) {
    try {
      const user = await this.userRepository.getUserByEmail(data.email);
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      const passwordMatches = await argon2.verify(user.password, data.password);

      if (!passwordMatches) {
        throw new BadRequestException('Password is incorrect');
      }

      const tokens = await this.getTokens(user._id, user);
      await this.updateRefreshToken(user._id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw error;
    }
  }

  async logout(id: MongooseSchema.Types.ObjectId, session: ClientSession) {
    return this.userRepository.updateUser(id, { refreshToken: null });
  }

  async updateRefreshToken(
    id: MongooseSchema.Types.ObjectId,
    refreshToken: string,
  ) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userRepository.updateUser(id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: MongooseSchema.Types.ObjectId, user) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          email: user.email,
          role: [user.role],
        },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: '1d',
        },
      ),
      this.jwtService.signAsync(
        {
          userId,
          email: user.email,
          role: [user.role],
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(
    userId: MongooseSchema.Types.ObjectId,
    refreshToken: string,
  ) {
    const user = await this.userRepository.getUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  // This method for local strategy
  async validateUser(data: AuthDto) {
    try {
      console.log(
        `[AuthService] validateUser: email=${data.email}, password=${data.password}`,
      );
      const user = await this.userRepository.getUserByEmail(data.email);
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      const passwordMatches = await argon2.verify(user.password, data.password);

      if (!passwordMatches) {
        throw new BadRequestException('Password is incorrect');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
