import prisma from '../database/prisma-client'
import { User } from '../../core/entities/user'
import { UserRepository } from '../../core/interfaces/user-repository'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? new User(user.id, user.email, user.password, user.name || undefined) : null
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const user = await prisma.user.create({ data: userData })
    return new User(user.id, user.email, user.password, user.name || undefined)
  }
}