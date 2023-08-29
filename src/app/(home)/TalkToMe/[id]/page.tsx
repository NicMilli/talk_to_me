import Editor from '@/components/Editor'
import NewScriptButton from '@/components/NewScriptButton'
import { getDBUser } from '@/utils/auth'
import { prisma } from '@/utils/db'

interface Script {
  id: string
  createdAt: Date
  updatedAt: Date
  title: string
  content: string | null
  audience: string | null
  authorId: string
}

const getScript = async (id: string): Promise<Script | null> => {
  const user = await getDBUser()
  const script: Script | null = await prisma.script.findUnique({
    where: {
      authorId_id: {
        authorId: user.id,
        id: id,
      },
    },
  })

  return script
}

const TalkToMe = async ({ params }: { params: { id: string } }) => {
  const script = await getScript(params.id)
  console.log(script)
  return (
    <div className=" h-full w-full">
      <Editor
        Content={script?.content}
        Title={script?.title}
        Audience={script?.audience}
      />
    </div>
  )
}

export default TalkToMe
