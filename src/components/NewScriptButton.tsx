'use client'

import { createNewScript } from '@/utils/api'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'

const NewScriptButton = () => {
  const router = useRouter()

  const handleOnClick = async () => {
    const data = await createNewScript()
    router.push(`/TalkToMe/${data.id}`)
  }

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-lg bg-white shadow"
      onClick={handleOnClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="text-3xl">New Entry</span>
      </div>
    </div>
  )
}

export default NewScriptButton
