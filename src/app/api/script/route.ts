import { getDBUser } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

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
