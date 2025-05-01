import { UserRepository } from '../interfaces/user-repository'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../entities/user'

export class AuthUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async login(email: string, password: string): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error('Invalid credentials')
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })

    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  }

  async register(userData: Omit<User, 'id'>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email)
    if (existingUser) {
      throw new Error('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    return this.userRepository.createUser({ ...userData, password: hashedPassword })
  }
}