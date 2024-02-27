import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Connection } from 'mongoose';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { LocalAuthGuard } from 'src/guards/localAuth.guard';
import { RefreshTokenGuard } from 'src/guards/refreshToken.guard';
import { CreateUserDto } from 'src/modules/user/dto/createUser.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async singUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const user = await this.authService.signUp(createUserDto, session);
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(user);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Req() req, @Body() body: AuthDto, @Res() res: Response) {
    try {
      console.log(req.user);
      const tokens = await this.authService.signIn(body);
      return res.status(HttpStatus.OK).send(tokens);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    await this.authService.logout(req.user['userId'], session);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshToken(userId, refreshToken);
  }
}
