// src/application/use-cases/auth/verifyOtpAndRegisterUser.ts

import OtpModel from '../../../infrastructure/database/schemas/otpModel';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';

export class VerifyOtpAndRegisterUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(user: User, enteredOtp: number): Promise<User> {
    const otpEntry = await OtpModel.findOne({ email: user.email });
    console.log('otpEntry  ',otpEntry?.otp);
    console.log('enteredOtp',enteredOtp);
    console.log('otpEntry type ', typeof otpEntry?.otp); 
    console.log('enteredOtp type',typeof enteredOtp );
    
    if (!otpEntry) {
      throw new Error('OTP not found');
    }

    if (otpEntry.otp != enteredOtp) {
      throw new Error('Invalid OTP');
    }

    if (otpEntry.expiresAt < new Date()) {
      throw new Error('OTP expired');
    }

    const existing = await this.userRepo.findByEmail(user.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const newUser = await this.userRepo.createUser(user);
    await OtpModel.deleteOne({ email: user.email }); // optional: clean up OTP
    return newUser;
  }
}
