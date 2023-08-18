import { getDBUser } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getStats = async () => {
  const user = await getDBUser()

  const stats = await prisma.feedback.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return stats
}

const Home = async () => {
  const stats = await getStats()
  return (
    <div>
      Home
      <div>{'stats' + stats[0]}</div>
    </div>
  )
}

export default Home
