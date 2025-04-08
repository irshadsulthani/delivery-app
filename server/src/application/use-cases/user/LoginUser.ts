import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { AuthService } from '../../services/AuthService';

export class LoginUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await this.userRepo.comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = AuthService.generateToken(user);
    return { token };
  }
}
