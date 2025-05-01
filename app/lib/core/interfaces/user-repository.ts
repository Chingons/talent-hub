import { User } from "../entities/user"

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  createUser(user: Omit<User, 'id'>): Promise<User>
}