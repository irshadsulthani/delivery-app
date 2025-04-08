import jwt from 'jsonwebtoken'
import { User } from '../../domain/entities/User'
import {config} from '../../config/index'

const ACCESS_SECRET = config.jwtSecret;

export class AuthService {
  static generateToken(user: User): string {
    return jwt.sign({ id: user._id.toString(), role: user.role }, ACCESS_SECRET, {
      expiresIn: '1h'
    });
  }
}
