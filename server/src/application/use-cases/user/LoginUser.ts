import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AuthService } from '../../services/AuthService';

export class LoginUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string, password: string): Promise<{
    name: string;
    email: string;
    role: string;
    token: string;
  }> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) throw new Error("Invalid credentials");

    if (user.role !== 'customer') throw new Error("Access denied");

    const isMatch = await this.userRepo.comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = AuthService.generateToken(user);

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }
}
