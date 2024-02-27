import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../config/config.service';
import { AccessTokenPayload } from '../modules/auth/types/accessTokenPayload';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const config = new ConfigService();
    const authJwtToken = req.headers.authorization;

    if (!authJwtToken) {
      next(); // No token provided, continue to the next middleware
      return;
    }

    try {
      const decodedToken = jwt.verify(
        authJwtToken,
        config.get('JWT_ACCESS_SECRET'),
      ) as AccessTokenPayload;

      req['user'] = decodedToken; // Set the decoded token on the request object for further use
      next(); // Continue to the next middleware
    } catch (error) {
      throw new UnauthorizedException('Invalid token'); // Throw UnauthorizedException with appropriate message
    }
  }
}
