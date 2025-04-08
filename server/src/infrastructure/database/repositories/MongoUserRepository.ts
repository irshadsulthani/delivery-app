// src/infrastructure/database/repositories/MongoUserRepository.ts

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserModel } from '../schemas/userModel';
import { PasswordService } from '../../../domain/services/PasswordService';



export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email }) as User;
  }

  async createUser(user: User): Promise<User> {
    const hashed = await PasswordService.hash(user.password || '');
    
    const createdUser = new UserModel({
      ...user,
      password: hashed,
      role: 'customer',
    });

    const savedUser = await createdUser.save();

    return {
      ...savedUser.toObject(),
      _id: savedUser._id.toString(),
    };
  }

  async comparePassword(input: string, hash: string): Promise<boolean> {
    return PasswordService.compare(input, hash);
  }
}
