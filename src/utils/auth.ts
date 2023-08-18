import { auth } from '@clerk/nextjs'
import { prisma } from './db'

export const getDBUser = async () => {
  const { userId } = await auth()
  // Throw incase user exists in clerk but not our DB
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId,
    },
  })

  return user
}
