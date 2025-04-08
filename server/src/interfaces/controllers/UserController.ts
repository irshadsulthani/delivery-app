import { Request, Response } from 'express';
import { VerifyOtpAndRegisterUser } from '../../application/use-cases/auth/verifyOtpAndRegisterUser';
import { LoginUser } from '../../application/use-cases/user/LoginUser';
import { MongoUserRepository } from '../../infrastructure/database/repositories/MongoUserRepository';
import { User } from '../../domain/entities/User';

const userRepo = new MongoUserRepository();

export class UserController {
  static register = async (req: Request, res: Response) => {
    try {
      const { otp, ...userData } = req.body as User & { otp: number };
      const useCase = new VerifyOtpAndRegisterUser(userRepo);
      const user = await useCase.execute(userData, otp);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const useCase = new LoginUser(userRepo);
      const result = await useCase.execute(req.body.email, req.body.password);
      res.cookie('accessToken', result.token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      });
      const { token, ...userData } = result;
      res.status(200).json(userData);

    } catch (err: any) {
      res.status(401).json({ message: err.message });
    }
  };
}
