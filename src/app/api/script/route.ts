import { getDBUser } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async () => {
  const user = getDBUser()
  const script = await prisma.script.create({
    data: {
      authorId: (await user).id,
      content: 'Body content',
      title: 'New script',
    },
  })

  revalidatePath('/scripts')

  return NextResponse.json({ data: script })
}

export const PATCH = async (req: NextRequest) => {
  const user = getDBUser()
  const body = await req.json()
  const script = await prisma.script.updateMany({
    where: {
      authorId: (await user).id,
      id: body.id,
    },
    data: {
      content: body.content,
      title: body.title,
      audience: body.audience,
    },
  })

  revalidatePath('/scripts')

  return NextResponse.json({ data: script })
}
