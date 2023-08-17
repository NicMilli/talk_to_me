import Link from 'next/link'
import UserButton from '@/src/components/UserButton'
import { auth } from '@clerk/nextjs'

export default async function Home() {
  const { userId } = await auth()

  let href = userId ? '/home' : '/new-user'
  return (
    <div className="w-screen h-screen homeColor flex justify-center items-center">
      <div className="bubble a"></div>
      <div className="bubble b"></div>
      <div className="bubble c"></div>
      <div className="bubble d"></div>
      <div className="bubble e"></div>
      <div className="bubble f"></div>
      <div className="bubble g"></div>
      <div className="bubble h"></div>
      <div className="bubble i"></div>
      <div className="bubble j"></div>
      <div className="bubble k"></div>
      <main>
        <h1 className="text-6xl font-bold mb-4">Talk to Me!</h1>
        <p className="text-2xl text-white/80 mb-4">
          Elevate your speech skills to conquer the virtual world
        </p>
        <div>
          <Link href={href}>
            <button className="bg-purple-600 px-4 py-2 rounded-lg text-xl">
              Get Started!
            </button>
          </Link>
          <UserButton />
        </div>
      </main>
    </div>
  )
}
