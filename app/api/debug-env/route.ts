// app/api/debug-env/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    CLERK_ENCRYPTION_KEY: process.env.CLERK_ENCRYPTION_KEY ? 'Set' : 'Not set',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set',
    NODE_ENV: process.env.NODE_ENV
  })
}