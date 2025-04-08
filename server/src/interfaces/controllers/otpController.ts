import { Request, Response } from 'express'; 
import { sendOtpUseCase } from "../../application/use-cases/auth/sendOtpUseCase";

export const handleOtpRequest = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  console.log('its here coming');
  

  console.log(req.body);
  
  try {
    const { otp, expiresAt } = await sendOtpUseCase(email);

    res.status(200).json({ message: 'OTP sent successfully', otp, expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};


// src/interfaces/controllers/verifyOtpController.ts
import { VerifyOtpAndRegisterUser } from '../../application/use-cases/auth/verifyOtpAndRegisterUser';
import { MongoUserRepository } from '../../infrastructure/database/repositories/MongoUserRepository';

const userRepo = new MongoUserRepository();

export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
  const { email, otp, ...userData } = req.body;
    console.log(email,otp,userData);
    
  try {
    const useCase = new VerifyOtpAndRegisterUser(userRepo);
    const user = await useCase.execute({ email, ...userData }, otp);
    res.status(200).json({ message: 'OTP verified and user registered successfully', user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

