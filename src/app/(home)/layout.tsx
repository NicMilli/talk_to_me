import UserButton from '@/components/UserButton'
import Image from 'next/image'
import FullLogo from '../FullLogo.png'
import { ReactNode } from 'react'

interface Props {
  children?: ReactNode
  // any props that come into the component
}

const NavbarLayout = ({ children }: Props) => {
  return (
    <div className="h-screen w-screen relative">
      <header className="h-[60px] border-b border-black/10">
        <nav>
          <div className="h-full w-full px-6 flex items-center justify-around">
            <div className="w-[50%]">
              <Image
                src={FullLogo}
                width={60}
                height={60}
                alt="Nicholas Milligan Logo"
              />
            </div>

            <div className="flex justify-between w-[50%]">
              <button className="bg-gradient-to-r from-amber-600 to-fuchsia-600 px-2 py-1 rounded-md text-l">
                TalkToMe
              </button>
              <button className="bg-gradient-to-r from-amber-600 to-fuchsia-600 px-2 py-1 rounded-md text-l">
                WriteMe
              </button>
              <UserButton />
            </div>
          </div>
        </nav>
      </header>
      <div className="h-[calc(100vh-60px)]">{children}</div>
    </div>
  )
}

export default NavbarLayout
