import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaUserRepository } from '../../../lib/infrastructure/repositories/user-repository'
import { AuthUseCase } from '../../../lib/core/usecases/auth-usecase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password, name } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const userRepository = new PrismaUserRepository()
    const authUseCase = new AuthUseCase(userRepository)

    const user = await authUseCase.register({ email, password, name })

    return res.status(201).json({ user })
  } catch (error: any) {
    return res.status(400).json({ message: error.message || 'Registration failed' })
  }
}