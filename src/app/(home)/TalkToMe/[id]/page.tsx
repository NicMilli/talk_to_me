import Editor from '@/components/Editor'
import NewScriptButton from '@/components/NewScriptButton'
import { getDBUser } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getScript = async (id) => {
  const user = await getDBUser()
  const script = await prisma.script.findUnique({
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
  return (
    <div className=" h-full w-full">
      <Editor script={script} />
    </div>
  )
}

export default TalkToMe
