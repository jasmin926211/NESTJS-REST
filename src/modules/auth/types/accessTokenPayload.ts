import { Schema as MongooseSchema } from 'mongoose';

export type AccessTokenPayload = {
  userId: MongooseSchema.Types.ObjectId;
  email: string;
  exp: number;
};
