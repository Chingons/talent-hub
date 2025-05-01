import { NextResponse } from 'next/server'
import { PrismaUserRepository } from '../../../lib/infrastructure/repositories/user-repository'
import { AuthUseCase } from '../../../lib/core/usecases/auth-usecase'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const userRepository = new PrismaUserRepository()
    const authUseCase = new AuthUseCase(userRepository)

    const { user, token } = await authUseCase.login(email, password)

    const response = NextResponse.json({ user })
    
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/',
    })

    return response
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Authentication failed' },
      { status: 401 }
    )
  }
}