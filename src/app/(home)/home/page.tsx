import Link from 'next/link'
import NewScriptButton from '@/components/NewScriptButton'
import ScriptCard from '@/components/ScriptCard'
import { getDBUser } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getScripts = async () => {
  const user = await getDBUser()

  const scripts = await prisma.script.findMany({
    where: {
      authorId: user.id,
    },
    include: {
      analyses: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return scripts
}

const Home = async () => {
  const scripts = await getScripts()

  return (
    <div className="p-10 h-full bg-zinc-400/10">
      <NewScriptButton />
      <h2 className="text-3xl mb-8">Previous speeches:</h2>
      <div className="grid grid-cols-3 gap-4">
        {scripts.map((script) => (
          <Link href={`/TalkToMe/${script.id}`} key={script.id}>
            <ScriptCard key={script.id} script={script} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
