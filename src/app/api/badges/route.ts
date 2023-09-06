import { getDBUser } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async () => {
  const user = getDBUser()
  const script = await prisma.icon.findMany({})

  return NextResponse.json({ data: script })
}
